import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import {
  CONNECTION_LABELS,
  // FALLBACK_REFRESH_MS,
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

type GameResultsStore = {
  connectionState: ConnectionState;
  isLoading: boolean;
  results: GameResultItem[];
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

const listeners = new Set<(state: GameResultsStore) => void>();

let store: GameResultsStore = {
  connectionState: "connecting",
  isLoading: true,
  results: [],
};

let hasInitialized = false;

function emit() {
  listeners.forEach((listener) => listener(store));
}

function updateStore(partial: Partial<GameResultsStore>) {
  store = {
    ...store,
    ...partial,
  };
  emit();
}

async function runFetchResults({
  preserveResultsOnError = false,
  showLoading = false,
}: FetchGameResultsOptions = {}) {
  if (showLoading) {
    updateStore({ isLoading: true });
  }

  try {
    const nextResults = await fetchGameResults();
    updateStore({ results: nextResults });
  } catch {
    if (!preserveResultsOnError) {
      updateStore({ results: [] });
    }
  } finally {
    updateStore({ isLoading: false });
  }
}

function initializeStore() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;
  void runFetchResults({ showLoading: true });

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
      updateStore({ connectionState: status });
    },
  );

  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;

  // channel.listen(eventName, () => {
  //   void runFetchResults({ preserveResultsOnError: true });
  // });
  channel.listen(eventName, () => {
  updateStore({
    // results: payload.data ?? payload,
  });
});
  channel.error(() => {
    updateStore({ connectionState: "failed" });
  });

  // window.setInterval(() => {
  //   if (store.connectionState !== "connected") {
  //     void runFetchResults({ preserveResultsOnError: true });
  //   }
  // }, FALLBACK_REFRESH_MS);
window.setInterval(() => {
  if (store.connectionState === "failed") {
    void runFetchResults({ preserveResultsOnError: true });
  }
}, 30000);
  window.addEventListener("beforeunload", () => {
    channel.stopListening(eventName);
    stopListeningToConnection();
    echo.leaveChannel(REALTIME_CHANNEL);
    echo.disconnect();
  });
}

export function useGameResults() {
  const [snapshot, setSnapshot] = useState({...store});

  useEffect(() => {
    initializeStore();

    const listener = (nextState: GameResultsStore) => {
      setSnapshot({...nextState});
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    connectionLabel: CONNECTION_LABELS[snapshot.connectionState],
    connectionState: snapshot.connectionState,
    isLoading: snapshot.isLoading,
    latestResult: snapshot.results[0] ?? null,
    results: snapshot.results,
  };
}
