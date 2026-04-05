import { useEffect, useEffectEvent, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import {
  CONNECTION_LABELS,
  FALLBACK_REFRESH_MS,
  PLAYER_API_URL,
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  REALTIME_HOST,
  REALTIME_PORT,
  REVERB_KEY,
  USE_TLS,
  getAssetUrl,
} from "../config/gameConfig";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "unavailable"
  | "failed";

type PlayerDetailsData = {
  id?: number;
  username?: string;
  avater?: string;
  balance?: string;
  [key: string]: unknown;
};

type PlayerDetails = {
  status?: boolean;
  data?: PlayerDetailsData;
  message?: string;
};

type FetchPlayerOptions = {
  preservePlayerOnError?: boolean;
  showLoading?: boolean;
};

async function fetchPlayerDetails(): Promise<PlayerDetailsData> {
  const response = await fetch(PLAYER_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  const result = (await response.json()) as PlayerDetails;

  if (!result.status || !result.data) {
    throw new Error(result.message || "Player data was not returned.");
  }

  return result.data;
}

const windowWithPusher = window as Window & {
  Pusher?: typeof Pusher;
};

export function resolvePlayerAssetUrl(path: string): string {
  return getAssetUrl(path);
}

export function usePlayerDetails() {
  const [playerDetails, setPlayerDetails] = useState<PlayerDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const fetchPlayer = useEffectEvent(
    async ({
      preservePlayerOnError = false,
      showLoading = false,
    }: FetchPlayerOptions = {}) => {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const nextPlayer = await fetchPlayerDetails();
        setPlayerDetails(nextPlayer);
      } catch {
        if (!preservePlayerOnError) {
          setPlayerDetails(null);
        }
      } finally {
        setIsLoading(false);
      }
    },
  );

  const handleRealtimeUpdate = useEffectEvent(() => {
    void fetchPlayer({ preservePlayerOnError: true });
  });

  useEffect(() => {
    void fetchPlayer({ showLoading: true });
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
        void fetchPlayer({ preservePlayerOnError: true });
      }
    }, FALLBACK_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [connectionState]);

  return {
    avatar: playerDetails?.avater ? resolvePlayerAssetUrl(playerDetails.avater) : "",
    balance: playerDetails?.balance ?? "0.00",
    connectionLabel: CONNECTION_LABELS[connectionState],
    connectionState,
    isLoading,
    playerDetails,
    username: playerDetails?.username ?? "",
  };
}
