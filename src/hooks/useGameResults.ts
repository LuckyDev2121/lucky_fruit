import { useEffect, useEffectEvent, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import {
  CONNECTION_LABELS,
  FALLBACK_REFRESH_MS,
  GAME_RESULTS_API_URL,
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  REALTIME_HOST,
  REALTIME_PORT,
  REVERB_KEY,
  USE_TLS,
} from "../config/gameConfig";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "unavailable"
  | "failed";

type GameResultItem = {
  option_id: number;
  option_name: string;
};

type GameResultsResponse = {
  status?: boolean;
  data?: GameResultItem[];
  message?: string;
};

type FetchGameResultsOptions = {
  preserveResultsOnError?: boolean;
  showLoading?: boolean;
};

async function fetchGameResults(): Promise<GameResultItem[]> {
  const response = await fetch(GAME_RESULTS_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  const result = (await response.json()) as GameResultsResponse;

  if (!result.status || !result.data) {
    throw new Error(result.message || "Game results were not returned.");
  }

  return result.data;
}

const windowWithPusher = window as Window & {
  Pusher?: typeof Pusher;
};

export function useGameResults() {
  const [results, setResults] = useState<GameResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const fetchResults = useEffectEvent(
    async ({
      preserveResultsOnError = false,
      showLoading = false,
    }: FetchGameResultsOptions = {}) => {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const nextResults = await fetchGameResults();
        setResults(nextResults);
      } catch {
        if (!preserveResultsOnError) {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
  );

  const handleRealtimeUpdate = useEffectEvent(() => {
    void fetchResults({ preserveResultsOnError: true });
  });

  useEffect(() => {
    void fetchResults({ showLoading: true });
  }, []);

  useEffect(() => {
    windowWithPusher.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "reverb",
      key: REVERB_KEY,
      wsHost: REALTIME_HOST,
      httpHost: REALTIME_HOST,
      wsPort: REALTIME_PORT,
      httpPort: REALTIME_PORT,
      wssPort: REALTIME_PORT,
      httpsPort: REALTIME_PORT,
      forceTLS: USE_TLS,
      enabledTransports: USE_TLS ? ["wss"] : ["ws"],
      disableStats: true,
      cluster: "",
      namespace: false,
    });

    const stopListeningToConnection = echo.connector.onConnectionChange(
      (status) => {
        setConnectionState(status);
      },
    );

    const channel = echo.channel(REALTIME_CHANNEL);
    const eventName = `.${REALTIME_EVENT}`;

    channel.listen(eventName, handleRealtimeUpdate);
    channel.error(() => {
      setConnectionState("failed");
    });

    return () => {
      channel.stopListening(eventName, handleRealtimeUpdate);
      stopListeningToConnection();
      echo.leaveChannel(REALTIME_CHANNEL);
      echo.disconnect();
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (connectionState !== "connected") {
        void fetchResults({ preserveResultsOnError: true });
      }
    }, FALLBACK_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [connectionState]);

  return {
    connectionLabel: CONNECTION_LABELS[connectionState],
    connectionState,
    isLoading,
    latestResult: results[0] ?? null,
    results: results,
  };
}
