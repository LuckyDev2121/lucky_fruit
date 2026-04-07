import { useCallback, useEffect, useState } from "react";
import { echo } from "./echo";
import {
  fetchGameDetail,
  fetchPlayerInfo,
  fetchGameResults,
  createRound,
  placeBet as placeBetRequest,
  makeGameResult,
  type GameDetailsData,
  type PlayerDetailsData,
  type GameResults,
  type CreateRoundResponse,
  type ResultData,
  type PlaceBet,
} from "../api/api";
import {
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  getAssetUrl,
} from "../config/gameConfig";

export function resolveAssetUrl(path: string): string {
  return getAssetUrl(path);
}

type GameStore = {
  gameDetails: GameDetailsData | null;
  playerInfo: PlayerDetailsData | null;
  results: GameResults | null;
  roundData: CreateRoundResponse | null;
  makeResult: ResultData | null;
  isLoading: boolean;
  lastBetMessage: string | null;
};

const listeners = new Set<(state: GameStore) => void>();

let store: GameStore = {
  gameDetails: null,
  playerInfo: null,
  results: null,
  roundData: null,
  makeResult: null,
  isLoading: true,
  lastBetMessage: null,
};

let hasInitialized = false;

function emit() {
  listeners.forEach((listener) => listener(store));
}

function updateStore(partial: Partial<GameStore>) {
  store = {
    ...store,
    ...partial,
  };
  emit();
}

async function runRefreshGameData() {
  updateStore({ isLoading: true });

  try {
    const [gameDetail, player, gameResults] = await Promise.all([
      fetchGameDetail(),
      fetchPlayerInfo(),
      fetchGameResults(),
    ]);

    updateStore({
      gameDetails: gameDetail,
      playerInfo: player,
      results: gameResults,
      isLoading: false,
    });
  } catch (error) {
    updateStore({ isLoading: false });
    throw error;
  }
}

function initializeStore() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;
  void runRefreshGameData();

  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;

  channel.listen(eventName, async () => {
    await runRefreshGameData();
  });
}

export function useGame() {
  const [snapshot, setSnapshot] = useState({ ...store });

  useEffect(() => {
    initializeStore();

    const listener = (nextState: GameStore) => {
      setSnapshot({ ...nextState });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const refreshGameData = useCallback(async () => {
    await runRefreshGameData();
  }, []);

  const handleCreateRound = useCallback(async () => {
    const data = await createRound();
    updateStore({ roundData: data });
    return data;
  }, []);

  const handleMakeResult = useCallback(async () => {
    const data = await makeGameResult();
    updateStore({ makeResult: data });
    return data;
  }, []);

  const handlePlaceBet = useCallback(async (optionId: number, amount: number) => {
    const currentBalance = Number.parseFloat(store.playerInfo?.balance ?? "0");

    if (currentBalance < amount) {
      throw new Error("Insufficient balance");
    }

    const response: PlaceBet = await placeBetRequest(optionId, amount);
    const nextBalance = Math.max(0, currentBalance - amount);

    updateStore({
      playerInfo: store.playerInfo
        ? {
            ...store.playerInfo,
            balance: nextBalance.toFixed(2),
          }
        : store.playerInfo,
      lastBetMessage: response.message ?? null,
    });

    return response;
  }, []);

  return {
    betAmounts: snapshot.gameDetails?.bet_amounts ?? [],
    options: snapshot.gameDetails?.options ?? [],
    gameDetails: snapshot.gameDetails,
    playerInfo: snapshot.playerInfo,
    results: snapshot.results,
    roundData: snapshot.roundData,
    makeResult: snapshot.makeResult,
    isLoading: snapshot.isLoading,
    lastBetMessage: snapshot.lastBetMessage,
    refreshGameData,
    createRound: handleCreateRound,
    makeGameResult: handleMakeResult,
    placeBet: handlePlaceBet,
  };
}
