import { useEffect, useState } from "react";
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

type PlayerStore = {
  connectionState: ConnectionState;
  isLoading: boolean;
  playerDetails: PlayerDetailsData | null;
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

const listeners = new Set<(state: PlayerStore) => void>();

let store: PlayerStore = {
  connectionState: "connecting",
  isLoading: true,
  playerDetails: null,
};

let hasInitialized = false;

function emit() {
  listeners.forEach((listener) => listener(store));
}

function updateStore(partial: Partial<PlayerStore>) {
  store = {
    ...store,
    ...partial,
  };
  emit();
}

async function runFetchPlayer({
  preservePlayerOnError = false,
  showLoading = false,
}: FetchPlayerOptions = {}) {
  if (showLoading) {
    updateStore({ isLoading: true });
  }

  try {
    const nextPlayer = await fetchPlayerDetails();
    updateStore({ playerDetails: nextPlayer });
  } catch {
    if (!preservePlayerOnError) {
      updateStore({ playerDetails: null });
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
  void runFetchPlayer({ showLoading: true });

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

  channel.listen(eventName, () => {
    void runFetchPlayer({ preservePlayerOnError: true });
  });
  channel.error(() => {
    updateStore({ connectionState: "failed" });
  });

  window.setInterval(() => {
    if (store.connectionState !== "connected") {
      void runFetchPlayer({ preservePlayerOnError: true });
    }
  }, FALLBACK_REFRESH_MS);

  window.addEventListener("beforeunload", () => {
    channel.stopListening(eventName);
    stopListeningToConnection();
    echo.leaveChannel(REALTIME_CHANNEL);
    echo.disconnect();
  });
}

export function resolvePlayerAssetUrl(path: string): string {
  return getAssetUrl(path);
}

export function usePlayerDetails() {
  const [snapshot, setSnapshot] = useState({...store});

  useEffect(() => {
    initializeStore();

    const listener = (nextState: PlayerStore) => {
      setSnapshot({...nextState});
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    avatar: snapshot.playerDetails?.avater
      ? resolvePlayerAssetUrl(snapshot.playerDetails.avater)
      : "",
    balance: snapshot.playerDetails?.balance ?? "0.00",
    connectionLabel: CONNECTION_LABELS[snapshot.connectionState],
    connectionState: snapshot.connectionState,
    isLoading: snapshot.isLoading,
    playerDetails: snapshot.playerDetails,
    username: snapshot.playerDetails?.username ?? "",
  };
}
