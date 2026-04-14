import { useCallback, useEffect, useState } from "react";
import { echo } from "./echo";
import {
  fetchPlayerLog,
  fetchWinToday,
  fetchGameDetail,
  fetchPlayerInfo,
  fetchGameResults,
  createRound,
  placeBet as placeBetRequest,
  makeGameResult,
  fetchSoundSetting,
  saveSoundSetting,
  fetchRankingToday,
  type PlayerLogData,
  type WinTodayResponse,
  type GameDetailsData,
  type PlayerDetailsData,
  type GameResults,
  type CreateRoundResponse,
  type ResultData,
  type PlaceBet,
  type RankingTodayItem,
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
  currentRoundBets: Record<number, number>;
  previousRoundBets: Record<number, number>;
  pendingBalanceDeduction: number;
  isLoading: boolean;
  lastBetMessage: string | null;
  isMusicEnabled: boolean;
  isMusicSettingLoading: boolean;
  rankingTodays: RankingTodayItem[];
  winToday: WinTodayResponse|null;
  playerLog: PlayerLogData[];
};

const listeners = new Set<(state: GameStore) => void>();

let store: GameStore = {
  gameDetails: null,
  playerInfo: null,
  results: null,
  roundData: null,
  makeResult: null,
  currentRoundBets: {},
  previousRoundBets: {},
  pendingBalanceDeduction: 0,
  isLoading: true,
  lastBetMessage: null,
  isMusicEnabled: true,
  isMusicSettingLoading: true,
  rankingTodays: [],
  winToday:null,
  playerLog:[],
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

type RefreshGameDataOptions = {
  resetPendingBalanceDeduction?: boolean;
};

function formatBalanceValue(amount: number): string {
  if (Number.isNaN(amount) || amount <= 0) {
    return "0";
  }

  return Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2).replace(/\.?0+$/, "");
}

function normalizeBetRecord(
  options: GameDetailsData["options"],
  source: Record<number, number>,
): Record<number, number> {
  const normalized: Record<number, number> = {};

  options?.forEach((option) => {
    normalized[option.id] = source[option.id] ?? 0;
  });

  return normalized;
}

async function runRefreshGameData(options?: RefreshGameDataOptions) {
  updateStore({ isLoading: true, isMusicSettingLoading: true });

  try {
    const [gameDetail, player, gameResults, isMusicEnabled, rankingToday, winToday, playerLog] = await Promise.all([
      fetchGameDetail(),
      fetchPlayerInfo(),
      fetchGameResults(),
      fetchSoundSetting(),
      fetchRankingToday(),
      fetchWinToday(),
      fetchPlayerLog(),
    ]);

    updateStore({
      gameDetails: gameDetail,
      playerInfo: player,
      results: gameResults,
      isMusicEnabled,
      isLoading: false,
      isMusicSettingLoading: false,
      rankingTodays: rankingToday,
      playerLog:playerLog,
      winToday:winToday,
      pendingBalanceDeduction: options?.resetPendingBalanceDeduction
        ? 0
        : store.pendingBalanceDeduction,
      previousRoundBets: normalizeBetRecord(gameDetail.options, store.previousRoundBets),
    });
  } catch (error) {
    updateStore({ isLoading: false, isMusicSettingLoading: false });
    throw error;
  }
}

function initializeStore() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;

  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;

  channel.listen(eventName, async () => {
    await runRefreshGameData();
  });
}

export async function bootstrapGameStore(options?: RefreshGameDataOptions) {
  initializeStore();
  await runRefreshGameData(options);
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

  const refreshGameData = useCallback(async (options?: RefreshGameDataOptions) => {
    await runRefreshGameData(options);
  }, []);

  const handleCreateRound = useCallback(async () => {
    const data = await createRound();
    updateStore({ roundData: data });
    return data;
  }, []);

  const handlePlayerLog = useCallback(async () => {
    const data = await fetchPlayerLog();
    //  console.log("API playerLog:", data);
    updateStore({ playerLog: data });
    return data;
  }, []);

  const handleWinToday= useCallback(async () => {
    const data = await fetchWinToday();
    // console.log("API winToday:", data);
    updateStore({ winToday: data });
    return data;
  }, []);

  const handleGameRound = useCallback(async (roundId: number) => {
    const data = await makeGameResult(roundId);
    updateStore({
      makeResult: data,
    });

    return data;
  }, []);

  const handleMakeResult = useCallback(async (roundId: number) => {
    const data = await makeGameResult(roundId);
    const [player, gameResults, ranking, playerLog, winToday] = await Promise.all([
      fetchPlayerInfo(),
      fetchGameResults(),
      fetchRankingToday(),
      fetchPlayerLog(),
      fetchWinToday(),
    ]);

    updateStore({
      makeResult: data,
      playerInfo: player,
      results: gameResults,
      rankingTodays: ranking,
      playerLog:playerLog,
      winToday:winToday,
    });

    return data;
  }, []);

  const handlePlaceBet = useCallback(async (optionId: number, amount: number) => {
    const currentBalance = Number.parseFloat(store.playerInfo?.balance ?? "0");

    if (currentBalance < amount) {
      throw new Error("Insufficient balance");
    }
    console.log("useHook",optionId, amount)
    const response: PlaceBet = await placeBetRequest(optionId, amount);
    const nextRoundBets = {
      ...store.currentRoundBets,
      [optionId]: (store.currentRoundBets[optionId] ?? 0) + amount,
    };

    updateStore({
      currentRoundBets: nextRoundBets,
      lastBetMessage: response.message ?? null,
    });

    return response;
  }, []);

  const reserveBetBalance = useCallback((amount: number) => {
    if (amount <= 0) {
      return;
    }

    updateStore({
      pendingBalanceDeduction: store.pendingBalanceDeduction + amount,
    });
  }, []);

  const releaseBetBalance = useCallback((amount: number) => {
    if (amount <= 0) {
      return;
    }

    updateStore({
      pendingBalanceDeduction: Math.max(0, store.pendingBalanceDeduction - amount),
    });
  }, []);

  const handleSetMusicEnabled = useCallback(async (nextValue: boolean) => {
    const playerId = store.playerInfo?.id;

    if (!playerId) {
      throw new Error("Player information is not loaded");
    }

    await saveSoundSetting(playerId, nextValue);
    updateStore({ isMusicEnabled: nextValue });
  }, []);

  const clearCurrentRoundBets = useCallback(() => {
    updateStore({ currentRoundBets: {} });
  }, []);

  const archiveCurrentRoundBets = useCallback(() => {
    updateStore({
      previousRoundBets: normalizeBetRecord(
        store.gameDetails?.options,
        store.currentRoundBets,
      ),
    });
  }, []);

  const setPreviousRoundBets = useCallback((betMap: Record<number, number>) => {
    // console.log("betmout", betMap)
    updateStore({
      previousRoundBets: normalizeBetRecord(
        store.gameDetails?.options,
        betMap,
      ),
    });
  }, []);

  const previousRoundBetEntries = (snapshot.gameDetails?.options ?? []).map((option) => ({
    option_id: option.id,
    amount: snapshot.previousRoundBets[option.id] ?? 0,
  }));

  const rawBalance = Number.parseFloat(snapshot.playerInfo?.balance ?? "0");
  const displayBalance = formatBalanceValue(
    Math.max(0, rawBalance - snapshot.pendingBalanceDeduction),
  );

  return {
    playerLog: snapshot.playerLog ?? [],
    winToday: snapshot.winToday,
    betAmounts: snapshot.gameDetails?.bet_amounts ?? [],
    options: snapshot.gameDetails?.options ?? [],
    gameDetails: snapshot.gameDetails,
    playerInfo: snapshot.playerInfo,
    displayBalance,
    results: snapshot.results,
    roundData: snapshot.roundData,
    makeResult: snapshot.makeResult,
    currentRoundBets: snapshot.currentRoundBets,
    previousRoundBets: snapshot.previousRoundBets,
    previousRoundBetEntries,
    isLoading: snapshot.isLoading,
    lastBetMessage: snapshot.lastBetMessage,
    isMusicEnabled: snapshot.isMusicEnabled,
    isMusicSettingLoading: snapshot.isMusicSettingLoading,
    rankingToday: snapshot.rankingTodays,
    refreshGameData,
    createRound: handleCreateRound,
    makeGameRound:handleGameRound,
    makeGameResult: handleMakeResult,
    placeBet: handlePlaceBet,
    reserveBetBalance,
    releaseBetBalance,
    setMusicEnabled: handleSetMusicEnabled,
    clearCurrentRoundBets,
    archiveCurrentRoundBets,
    setPreviousRoundBets,
    handlePlayerLog,
    handleWinToday,
  };
}
