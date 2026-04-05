import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import {
  GAME_DETAILS_API_URL,
  CONNECTION_LABELS,
  FALLBACK_REFRESH_MS,
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

type GameOption = {
  id: number;
  name: string;
  logo: string;
};

type BetAmount = {
  id: number;
  amount: string;
  icon: string;
};

type GameDetailsData = {
  id?: number;
  name?: string;
  options?: GameOption[];
  bet_amounts?: BetAmount[];
  [key: string]: unknown;
};

type GameDetails = {
  status?: boolean;
  data?: GameDetailsData;
  message?: string;
};

type RealtimePayload =
  | { game?: GameDetailsData; data?: GameDetailsData }
  | GameDetailsData
  | string
  | null
  | undefined;

type FetchGameOptions = {
  preserveGameOnError?: boolean;
  showLoading?: boolean;
};

type GameDetailsStore = {
  connectionState: ConnectionState;
  gameDetails: GameDetailsData | null;
  isLoading: boolean;
};

async function fetchGameDetails(): Promise<GameDetailsData> {
  const response = await fetch(GAME_DETAILS_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  const result = (await response.json()) as GameDetails;

  if (!result.status || !result.data) {
    throw new Error(result.message || "Game data was not returned.");
  }

  return result.data;
}

const windowWithPusher = window as Window & {
  Pusher?: typeof Pusher;
};

function isGameRecord(value: unknown): value is GameDetails {
  return typeof value === "object" && value !== null;
}

function normalizeRealtimePayload(
  payload: RealtimePayload,
): GameDetails | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === "string") {
    try {
      return normalizeRealtimePayload(JSON.parse(payload) as RealtimePayload);
    } catch {
      return null;
    }
  }

  if ("game" in payload && isGameRecord(payload.game)) {
    return payload.game;
  }

  if ("data" in payload && isGameRecord(payload.data)) {
    return payload.data;
  }

  return isGameRecord(payload) ? payload : null;
}

function mergeGame(
  currentGame: GameDetailsData | null,
  nextGame: GameDetailsData,
): GameDetailsData {
  return {
    ...(currentGame ?? {}),
    ...nextGame,
  };
}

const listeners = new Set<(state: GameDetailsStore) => void>();

let store: GameDetailsStore = {
  connectionState: "connecting",
  gameDetails: null,
  isLoading: true,
};

let hasInitialized = false;

function emit() {
  listeners.forEach((listener) => listener(store));
}

function updateStore(partial: Partial<GameDetailsStore>) {
  store = {
    ...store,
    ...partial,
  };
  emit();
}

async function runFetchGame({
  preserveGameOnError = false,
  showLoading = false,
}: FetchGameOptions = {}) {
  if (showLoading) {
    updateStore({ isLoading: true });
  }

  try {
    const nextGame = await fetchGameDetails();
    updateStore({
      gameDetails: nextGame,
    });
  } catch {
    if (!preserveGameOnError) {
      updateStore({ gameDetails: null });
    }
  } finally {
    updateStore({ isLoading: false });
  }
}

function handleRealtimeUpdate(payload: RealtimePayload) {
  const nextGame = normalizeRealtimePayload(payload);

  if (!nextGame) {
    void runFetchGame({ preserveGameOnError: true });
    return;
  }

  updateStore({
    gameDetails: mergeGame(store.gameDetails, nextGame),
  });
  void runFetchGame({ preserveGameOnError: true });
}

function initializeStore() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;
  void runFetchGame({ showLoading: true });

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

  channel.listen(eventName, handleRealtimeUpdate);
  channel.error(() => {
    updateStore({ connectionState: "failed" });
  });

  window.setInterval(() => {
    if (store.connectionState !== "connected") {
      void runFetchGame({ preserveGameOnError: true });
    }
  }, FALLBACK_REFRESH_MS);

  window.addEventListener("beforeunload", () => {
    channel.stopListening(eventName, handleRealtimeUpdate);
    stopListeningToConnection();
    echo.leaveChannel(REALTIME_CHANNEL);
    echo.disconnect();
  });
}

export function resolveAssetUrl(path: string): string {
  return getAssetUrl(path);
}

export function useGameDetails() {
  const [snapshot, setSnapshot] = useState({...store});

  useEffect(() => {
    initializeStore();

    const listener = (nextState: GameDetailsStore) => {
      setSnapshot({...nextState});
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    betAmounts: snapshot.gameDetails?.bet_amounts ?? [],
    connectionLabel: CONNECTION_LABELS[snapshot.connectionState],
    connectionState: snapshot.connectionState,
    gameDetails: snapshot.gameDetails,
    gameName: snapshot.isLoading
      ? "Loading..."
      : snapshot.gameDetails?.name || "No name",
    isLoading: snapshot.isLoading,
    options: snapshot.gameDetails?.options ?? [],
  };
}
