import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import {
  ApiValidationError,
  ensureRecord,
  ensureString,
  isRecord,
  toArray,
  toNumber,
  toStringValue,
} from "./apiGuards";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://Funint.site";

const DEFAULT_CONTEXT = {
  regisation: 5,
  mode: null as number | null,
  player_id: 261101,
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

function withDefaultContext(
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): typeof DEFAULT_CONTEXT {
  return { ...DEFAULT_CONTEXT, ...overrides };
}

async function withRetry<T>(
  request: () => Promise<T>,
  retries = 2,
  baseDelayMs = 300
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;

      const axiosError = error as AxiosError | undefined;
      const status = axiosError?.response?.status;
      const shouldRetry = !status || status >= 500 || status === 429;
      if (!shouldRetry) break;

      const waitMs = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => window.setTimeout(resolve, waitMs));
    }
  }

  throw lastError;
}

async function getWithRetry<T>(url: string, config: AxiosRequestConfig): Promise<T> {
  return withRetry(async () => {
    const response = await api.get<T>(url, config);
    return response.data;
  });
}

export function toAbsoluteMediaUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export interface GameElement {
  id: number;
  element_name: string;
  element_icon: string;
  paytable: number;
  win_weights: number;
}

export interface IconResponse {
  icon: string;
}

export interface MusicResponse {
  music: string;
}

export interface PlayerPositionResponse {
  player_positon: string;
}

export interface RankTodayResponse {
  mrs__player_id__player_name: string[];
  mrs__player_id__player_pic: string[];
  last_balance: Array<number | string | null>;
  time: string;
}

export interface RankYesterdayResponse {
  mrs__player_id__player_name: string[];
  mrs__player_id__player_pic: string[];
  last_balance: Array<number | string | null>;
}

export interface TodayWinResponse {
  today_win: {
    total_balance: number | null;
  };
}

export interface SessionEndTimeResponse {
  started_at: string;
  next_run_time: string;
}

export type TopWinnerEntry = {
  mrs__player_id__player_name: string;
  last_balance: number | string;
  element__element_name?: string;
};

export type PrizeDistributionResponse = Record<string, unknown>;
export type GameRuleResponse = Record<string, unknown>;
export type AllGameDataResponse = Record<string, unknown>;

function parseGameElements(payload: unknown): GameElement[] {
  if (!Array.isArray(payload)) {
    throw new ApiValidationError("Invalid game elements response");
  }

  return payload
    .filter(isRecord)
    .map((item, index) => {
      const id = toNumber(item.id);
      const paytable = toNumber(item.paytable);
      const winWeights = toNumber(item.win_weights);

      if (id === null || paytable === null || winWeights === null) {
        throw new ApiValidationError(`Invalid game element at index ${index}`);
      }

      return {
        id,
        element_name: ensureString(item.element_name, "element_name", `Element ${id}`),
        element_icon: toAbsoluteMediaUrl(ensureString(item.element_icon, "element_icon", "")),
        paytable,
        win_weights: winWeights,
      };
    });
}

function parseIconResponse(payload: unknown, field: "icon" | "music"): string {
  const data = ensureRecord(payload, field);
  const raw = ensureString(data[field], field, "");
  return toAbsoluteMediaUrl(raw);
}

function parseTopWinners(payload: unknown): TopWinnerEntry[] {
  if (!Array.isArray(payload)) return [];

  return payload
    .filter(isRecord)
    .map((item, index) => ({
      mrs__player_id__player_name:
        ensureString(item.mrs__player_id__player_name, "mrs__player_id__player_name", `Player ${index + 1}`),
      last_balance: toNumber(item.last_balance) ?? toStringValue(item.last_balance) ?? 0,
      element__element_name: toStringValue(item.element__element_name) ?? undefined,
    }));
}

function parseRankToday(payload: unknown): RankTodayResponse {
  if (!isRecord(payload)) {
    throw new ApiValidationError("Invalid rank today response");
  }

  const directNames = toArray(payload.mrs__player_id__player_name).map((name) =>
    toStringValue(name) ?? "Unknown"
  );
  const directPics = toArray(payload.mrs__player_id__player_pic).map((pic) =>
    toStringValue(pic) ?? ""
  );
  const directBalances = toArray(payload.last_balance).map((balance) => {
    const num = toNumber(balance);
    return num ?? toStringValue(balance) ?? null;
  });

  if (directNames.length || directBalances.length) {
    return {
      mrs__player_id__player_name: directNames,
      mrs__player_id__player_pic: directPics,
      last_balance: directBalances,
      time: ensureString(payload.time, "time", "--:--:--"),
    };
  }

  const dataRows = toArray(payload.data).filter(isRecord);
  const names = dataRows.map((row) => toStringValue(row.player_name) ?? "Unknown");
  const pics = dataRows.map((row) => toStringValue(row.player_pic) ?? "");
  const balances = dataRows.map((row) => {
    const num = toNumber(row.last_balance);
    return num ?? toStringValue(row.last_balance) ?? null;
  });

  return {
    mrs__player_id__player_name: names,
    mrs__player_id__player_pic: pics,
    last_balance: balances,
    time: ensureString(payload.time, "time", "--:--:--"),
  };
}

function parseRankYesterday(payload: unknown): RankYesterdayResponse {
  if (Array.isArray(payload)) {
    const rows = payload.filter(isRecord);
    return {
      mrs__player_id__player_name: rows.map(
        (row) => toStringValue(row.player_name) ?? "Unknown"
      ),
      mrs__player_id__player_pic: rows.map((row) => toStringValue(row.player_pic) ?? ""),
      last_balance: rows.map((row) => {
        const num = toNumber(row.last_balance);
        return num ?? toStringValue(row.last_balance) ?? null;
      }),
    };
  }

  if (!isRecord(payload)) {
    throw new ApiValidationError("Invalid rank yesterday response");
  }

  return {
    mrs__player_id__player_name: toArray(payload.mrs__player_id__player_name).map(
      (name) => toStringValue(name) ?? "Unknown"
    ),
    mrs__player_id__player_pic: toArray(payload.mrs__player_id__player_pic).map(
      (pic) => toStringValue(pic) ?? ""
    ),
    last_balance: toArray(payload.last_balance).map((balance) => {
      const num = toNumber(balance);
      return num ?? toStringValue(balance) ?? null;
    }),
  };
}

function parseTodayWin(payload: unknown): TodayWinResponse {
  const data = ensureRecord(payload, "today_win_response");
  const todayWin = ensureRecord(data.today_win, "today_win");
  return {
    today_win: {
      total_balance: toNumber(todayWin.total_balance),
    },
  };
}

function parseSessionEndTime(payload: unknown): SessionEndTimeResponse {
  const data = ensureRecord(payload, "session_end_time");
  return {
    started_at: ensureString(data.started_at, "started_at", ""),
    next_run_time: ensureString(data.next_run_time, "next_run_time", ""),
  };
}

function parsePlayerPosition(payload: unknown): PlayerPositionResponse {
  const data = ensureRecord(payload, "player_position");
  return {
    player_positon: ensureString(data.player_positon, "player_positon", "--"),
  };
}

export const fetchGameElements = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<GameElement[]> => {
  const payload = await getWithRetry<unknown>("/game/game/elements", {
    params: withDefaultContext(overrides),
  });
  return parseGameElements(payload);
};

export const getGameIcon = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<IconResponse> => {
  const payload = await getWithRetry<unknown>("/game/icon/during/gaming", {
    params: withDefaultContext(overrides),
  });
  return { icon: parseIconResponse(payload, "icon") };
};

export const getGameMusic = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<MusicResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/music", {
    params: withDefaultContext(overrides),
  });
  return { music: parseIconResponse(payload, "music") };
};

export const getCoinIcon = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<IconResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/coin", {
    params: withDefaultContext(overrides),
  });
  return { icon: parseIconResponse(payload, "icon") };
};

export const getTopWinners = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<TopWinnerEntry[]> => {
  const payload = await getWithRetry<unknown>("/game/top/winers", {
    params: withDefaultContext(overrides),
  });
  return parseTopWinners(payload);
};

export const getPlayerPosition = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<PlayerPositionResponse> => {
  const payload = await getWithRetry<unknown>("/game/position/", {
    params: withDefaultContext(overrides),
  });
  return parsePlayerPosition(payload);
};

export const getPrizeDistribution = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<PrizeDistributionResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/prize/distribution", {
    params: withDefaultContext(overrides),
  });
  return ensureRecord(payload, "prize_distribution");
};

export const getGameRule = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<GameRuleResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/rule", {
    params: withDefaultContext(overrides),
  });
  return ensureRecord(payload, "game_rule");
};

export const getRankToday = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<RankTodayResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/rank/today", {
    params: withDefaultContext(overrides),
  });
  return parseRankToday(payload);
};

export const getRankYesterday = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<RankYesterdayResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/rank/yesterday", {
    params: withDefaultContext(overrides),
  });
  return parseRankYesterday(payload);
};

export const getTodayWin = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<TodayWinResponse> => {
  const payload = await getWithRetry<unknown>("/game/today/win", {
    params: withDefaultContext(overrides),
  });
  return parseTodayWin(payload);
};

export const getGameSessionEndTime = async (
  regisation = DEFAULT_CONTEXT.regisation
): Promise<SessionEndTimeResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/session/end/time", {
    params: { regisation },
  });
  return parseSessionEndTime(payload);
};

export const getAllGameData = async (
  overrides?: Partial<typeof DEFAULT_CONTEXT>
): Promise<AllGameDataResponse> => {
  const payload = await getWithRetry<unknown>("/game/game/all-data/", {
    params: withDefaultContext(overrides),
  });
  return ensureRecord(payload, "all_game_data");
};

export const __testables = {
  parseRankToday,
  parseRankYesterday,
  parseTopWinners,
  parseTodayWin,
  parseGameElements,
};
