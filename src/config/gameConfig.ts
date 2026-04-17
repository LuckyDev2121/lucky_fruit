type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "unavailable"
  | "failed";

export const GAME_ID = 5;

export type RuntimeConfig = {
  backendOrigin: string;
  apiBaseUrl: string;
};

type RuntimeConfigPayload = {
  base_url?: string;
  api_base_url?: string;
  backend_origin?: string;
  backend_url?: string;
  data?: RuntimeConfigPayload;
};

function getRuntimeOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://funint.site";
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeOrigin(value: string): string {
  return stripTrailingSlash(value);
}

function normalizeApiBaseUrl(value: string): string {
  return stripTrailingSlash(value);
}

function deriveRuntimeConfig(baseValue?: string, apiValue?: string): RuntimeConfig {
  const fallbackOrigin = normalizeOrigin(
    import.meta.env.VITE_BACKEND_ORIGIN ||
      (import.meta.env.DEV ? "https://funint.site" : getRuntimeOrigin()) ||
      "https://funint.site",
  );

  if (apiValue) {
    const normalizedApiBaseUrl = normalizeApiBaseUrl(apiValue);
    const backendOrigin = normalizedApiBaseUrl.endsWith("/api")
      ? normalizedApiBaseUrl.slice(0, -4)
      : fallbackOrigin;

    return {
      backendOrigin,
      apiBaseUrl: normalizedApiBaseUrl,
    };
  }

  if (baseValue) {
    const normalizedBaseUrl = normalizeOrigin(baseValue);

    return {
      backendOrigin: normalizedBaseUrl,
      apiBaseUrl: `${normalizedBaseUrl}/api`,
    };
  }

  return {
    backendOrigin: fallbackOrigin,
    apiBaseUrl: normalizeApiBaseUrl(
      import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.DEV ? "/api" : `${fallbackOrigin}/api`),
    ),
  };
}

function extractRuntimeConfigPayload(
  payload: RuntimeConfigPayload | null | undefined,
): RuntimeConfigPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.base_url || payload.api_base_url || payload.backend_origin || payload.backend_url) {
    return payload;
  }

  if (payload.data && typeof payload.data === "object") {
    return extractRuntimeConfigPayload(payload.data);
  }

  return null;
}

const RUNTIME_ORIGIN = getRuntimeOrigin();
export const APP_ORIGIN = RUNTIME_ORIGIN;

let runtimeConfig = deriveRuntimeConfig();
let runtimeConfigPromise: Promise<void> | null = null;

function applyRuntimeConfig(baseValue?: string, apiValue?: string) {
  runtimeConfig = deriveRuntimeConfig(baseValue, apiValue);
}

function getWindowRuntimeConfig(): RuntimeConfigPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const windowConfig = (
    window as Window & {
      APP_CONFIG?: RuntimeConfigPayload;
      __APP_CONFIG__?: RuntimeConfigPayload;
    }
  );

  return windowConfig.APP_CONFIG || windowConfig.__APP_CONFIG__ || null;
}

// export async function fetchRuntimeConfigFromApi() {
//   const requestUrls = Array.from(
//     new Set(
//       [
//         `${getApiBaseUrl()}/app-config`,
//         `${getBackendOrigin()}/api/app-config`,
//         `${APP_ORIGIN}/api/app-config`,
//       ].map((url) => stripTrailingSlash(url)),
//     ),
//   );

//   for (const requestUrl of requestUrls) {
//     try {
//       const response = await fetch(requestUrl, {
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         continue;
//       }

//       const payload = (await response.json()) as RuntimeConfigPayload;
//       const configPayload = extractRuntimeConfigPayload(payload);

//       if (!configPayload) {
//         continue;
//       }

//       applyRuntimeConfig(
//         configPayload.base_url || configPayload.backend_origin || configPayload.backend_url,
//         configPayload.api_base_url,
//       );
//       return;
//     } catch {
//       // Ignore failed runtime config probes and keep the fallback config.
//     }
//   }
// }

export async function initializeRuntimeConfig() {
  if (runtimeConfigPromise) {
    return runtimeConfigPromise;
  }

  runtimeConfigPromise = (async () => {
    const windowConfig = extractRuntimeConfigPayload(getWindowRuntimeConfig());

    if (windowConfig) {
      applyRuntimeConfig(
        windowConfig.base_url || windowConfig.backend_origin || windowConfig.backend_url,
        windowConfig.api_base_url,
      );
      return;
    }

    // await fetchRuntimeConfigFromApi();
  })();

  await runtimeConfigPromise;
}

export function getBackendOrigin(): string {
  return runtimeConfig.backendOrigin;
}

export function getApiBaseUrl(): string {
  return runtimeConfig.apiBaseUrl;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${getApiBaseUrl()}/${normalizedPath}`;
}

export function getRealtimeHost(): string {
  return import.meta.env.VITE_REVERB_HOST || new URL(getBackendOrigin()).hostname;
}

export function getRealtimeScheme(): string {
  return (
    import.meta.env.VITE_REVERB_SCHEME ||
    new URL(getBackendOrigin()).protocol.replace(":", "")
  );
}

export function getUseTls(): boolean {
  return getRealtimeScheme() === "https";
}

export function getRealtimePort(): number {
  return Number(import.meta.env.VITE_REVERB_PORT || (getUseTls() ? 443 : 8080));
}

export function getAssetBaseUrl(): string {
  return `${getBackendOrigin()}/core/storage/app/public/`;
}

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
    return `${getBackendOrigin()}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${getAssetBaseUrl()}${normalizedPath}`;
}

export function getMusicBaseUrl(): string {
  return `${getBackendOrigin()}/core/storage/app/public/sound/`;
}

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
    return `${getBackendOrigin()}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${getMusicBaseUrl()}${normalizedPath}`;
}

export const REVERB_KEY =
  import.meta.env.VITE_REVERB_APP_KEY || "k6dbocgucm0at6gwak3y";
export const REALTIME_CHANNEL =
  import.meta.env.VITE_REVERB_CHANNEL || "game-channel";
export const REALTIME_EVENT = import.meta.env.VITE_REVERB_EVENT || "game.updated";
export const FALLBACK_REFRESH_MS = 5_000;

export const GAME_MUSIC = {
  music: "fruit-music.mp3",
  sound: "fruit-sound.mp3",
};

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
  gamelogo: "game-logo.svg",
  hand: "hand.svg",
} as const;
