type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "unavailable"
  | "failed";

export const GAME_ID = 5;

function getRuntimeOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://funint.site";
}

const RUNTIME_ORIGIN = getRuntimeOrigin();
export const APP_ORIGIN = RUNTIME_ORIGIN;
export const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN || "https://funint.site";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api" : `${BACKEND_ORIGIN}/api`);




export const GAME_DETAILS_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/game-details/${GAME_ID}`;

export const REVERB_KEY =
  import.meta.env.VITE_REVERB_APP_KEY || "k6dbocgucm0at6gwak3y";
export const REALTIME_HOST =
  import.meta.env.VITE_REVERB_HOST || new URL(RUNTIME_ORIGIN).hostname;
export const REALTIME_CHANNEL =
  import.meta.env.VITE_REVERB_CHANNEL || "game-channel";
export const REALTIME_EVENT = import.meta.env.VITE_REVERB_EVENT || "game.updated";
export const REALTIME_SCHEME =
  import.meta.env.VITE_REVERB_SCHEME || new URL(RUNTIME_ORIGIN).protocol.replace(":", "");
export const USE_TLS = REALTIME_SCHEME === "https";
export const REALTIME_PORT = Number(
  import.meta.env.VITE_REVERB_PORT || (USE_TLS ? 443 : 8080),
);
export const FALLBACK_REFRESH_MS = 5_000;

export const ASSET_BASE_URL = `${BACKEND_ORIGIN}/core/storage/app/public/`;

export function getAssetUrl(path: string): string {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const storagePrefix = "core/storage/app/public/";
  const storagePathIndex = normalizedPath.indexOf(storagePrefix);

  if (storagePathIndex >= 0) {
    return `${BACKEND_ORIGIN}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${ASSET_BASE_URL}${normalizedPath}`;
}

export const MUSIC_BASE_URL = `${BACKEND_ORIGIN}/core/storage/app/public/sound/`;

export function getMusicUrl(path: string): string {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const storagePrefix = "core/storage/app/public/sound/";
  const storagePathIndex = normalizedPath.indexOf(storagePrefix);

  if (storagePathIndex >= 0) {
    return `${BACKEND_ORIGIN}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${MUSIC_BASE_URL}${normalizedPath}`;
}

export const GAME_MUSIC ={
  music: "fruit-music.mp3",
  sound: "fruit-sound.mp3",
}

export const CONNECTION_LABELS: Record<ConnectionState, string> = {
  connecting: "Connecting",
  connected: "Live",
  reconnecting: "Reconnecting",
  disconnected: "Disconnected",
  unavailable: "Unavailable",
  failed: "Failed",
};

export const GAME_ASSETS = {
  betAmount1M: "bet-amount-1M.svg",
  betAmount10k: "bet-amount-10k.svg",
  betAmount100: "bet-amount-100.svg",
  betAmount100k: "bet-amount-100k.svg",
  betAmount1000: "bet-amount-1000.svg",
  fruitAvocado: "fruit-avocado.svg",
  fruitBgFrame: "fruit-bg-frame.svg",
  fruitCheri: "fruit-cheri.svg",
  fruitContainerFrame: "fruit-container-frame.svg",
  fruitGameName: "fruit-game-name.svg",
  fruitGraps: "fruit-graps.svg",
  fruitLemon: "fruit-lemon.svg",
  fruitOrange: "fruit-orange.svg",
  fruitStroberry: "fruit-stroberry.svg",
  fruitTomato: "fruit-tomato.svg",
  fruitWatermalon: "fruit-watermalon.svg",
  timeCountingBoard: "time-Counting-board.svg",
  diamondIcon: "diamond-icon.svg",
  resultfirstposition: "result-1st-postion.svg",
  resultsecondposition: "result-2nd-postion.svg",
  resultthirdposition: "result-3rd-postion.svg",
  rotatedInstances: "Rotated-Instances.svg",
  selectround: "select-round.svg",
  resultboardbg: "result-board-bg.svg",
  newtag: "new-tag.svg",
} as const;
