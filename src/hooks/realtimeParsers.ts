import { toAbsoluteMediaUrl } from "../api/gameApi";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export type WinListItem = {
  id?: number;
  element__element_name?: string;
  element__element_icon?: string;
  created_at?: string;
  mrs__player_id__player_name?: string;
  last_balance?: number;
};

export type GameRealtimeState = {
  connectionStatus: ConnectionStatus;
  countdownSeconds: number | null;
  latestResultFruit: string | null;
  latestResultIcon: string | null;
  playerBalance: number | null;
  winList: WinListItem[];
  jackpotAmount: number | null;
  lastError: string | null;
  reconnectAttempts: number;
};

export type RealtimeMessage = {
  type?: string;
  data?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeFruitName(name: string): string {
  const value = name.trim().toLowerCase();
  if (value === "apple") return "Strawberry";
  if (value === "nine") return "Grape";
  if (value === "seven") return "Watermelon";
  if (value === "bar") return "Tomato";
  return name;
}

function parseWinList(list: unknown): WinListItem[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter(isRecord)
    .map((item) => ({
      id: toNumber(item.id) ?? undefined,
      element__element_name:
        typeof item.element__element_name === "string"
          ? item.element__element_name
          : undefined,
      element__element_icon:
        typeof item.element__element_icon === "string"
          ? item.element__element_icon
          : undefined,
      created_at: typeof item.created_at === "string" ? item.created_at : undefined,
      mrs__player_id__player_name:
        typeof item.mrs__player_id__player_name === "string"
          ? item.mrs__player_id__player_name
          : undefined,
      last_balance: toNumber(item.last_balance) ?? undefined,
    }));
}

export function reduceGameMessage(
  prev: GameRealtimeState,
  payload: RealtimeMessage
): GameRealtimeState {
  const { type, data } = payload;
  if (!type) return prev;

  if (type === "error" && isRecord(data)) {
    const message = typeof data.error === "string" ? data.error : "Realtime error";
    return { ...prev, lastError: message };
  }

  if (type === "initial_data" && isRecord(data)) {
    const countdown = isRecord(data.countdown)
      ? toNumber(data.countdown.seconds_remaining)
      : null;
    const winList = parseWinList(data.win_list);
    const jackpotAmount = toNumber(data.jackpot_amount);

    return {
      ...prev,
      countdownSeconds: countdown ?? prev.countdownSeconds,
      winList: winList.length ? winList : prev.winList,
      jackpotAmount: jackpotAmount ?? prev.jackpotAmount,
      lastError: null,
    };
  }

  if (type === "countdown" && isRecord(data)) {
    const seconds = toNumber(data.seconds_remaining);
    if (seconds === null) return prev;
    return { ...prev, countdownSeconds: seconds, lastError: null };
  }

  if (type === "game_result" && isRecord(data)) {
    const winElement = isRecord(data.win_element) ? data.win_element : null;
    const rawName =
      winElement && typeof winElement.name === "string" ? winElement.name : "";
    const normalizedName = rawName ? normalizeFruitName(rawName) : null;
    const rawIcon =
      winElement && typeof winElement.icon === "string" ? winElement.icon : null;

    return {
      ...prev,
      latestResultFruit: normalizedName,
      latestResultIcon: rawIcon ? toAbsoluteMediaUrl(rawIcon) : null,
      lastError: null,
    };
  }

  if (type === "win_list") {
    const winList = parseWinList(data);
    if (!winList.length) return prev;
    return { ...prev, winList, lastError: null };
  }

  if (type === "jackpot" && isRecord(data)) {
    const jackpotAmount = toNumber(data.jackpot_amount) ?? toNumber(data.amount);
    if (jackpotAmount === null) return prev;
    return { ...prev, jackpotAmount, lastError: null };
  }

  return prev;
}

export function reducePlayerMessage(
  prev: GameRealtimeState,
  payload: RealtimeMessage
): GameRealtimeState {
  const { type, data } = payload;
  if (!type || !isRecord(data)) return prev;

  if (type === "error") {
    const message = typeof data.error === "string" ? data.error : "Realtime error";
    return { ...prev, lastError: message };
  }

  if (type === "player_balance" || type === "personal_result") {
    const nextBalance =
      toNumber(data.current_balance) ?? toNumber(data.new_balance) ?? null;
    if (nextBalance === null) return prev;
    return { ...prev, playerBalance: nextBalance, lastError: null };
  }

  return prev;
}
