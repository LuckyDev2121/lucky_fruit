import { createOrSyncUser, type PlatformUserInput  } from "../api/api";

declare global {
  interface Window {
    __VOICE_PLATFORM_USER__?: unknown;
    voicePlatformUser?: unknown;
    gameUserIntegration?: {
      syncUser: (payload: unknown) => Promise<void>;
      getPendingUser: () => PlatformUserInput  | null;
    };
  }
}

type ExternalUserShape = {
  id?: unknown;
  userId?: unknown;
  username?: unknown;
  name?: unknown;
  avater?: unknown;
  avatar?: unknown;
  balance?: unknown;
};

const USER_SYNC_EVENT = "voice-platform-user";
export const USER_SYNCED_EVENT = "game-user-synced";

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeUserPayload(input: unknown): PlatformUserInput  | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const raw = input as ExternalUserShape;
  const username = asNonEmptyString(raw.username) ?? asNonEmptyString(raw.name);
  const avater = asNonEmptyString(raw.avater) ?? asNonEmptyString(raw.avatar);

  if (!username || !avater) {
    return null;
  }

  return {
    username,
    avater,
  };
}

function getUserFromQueryParams(): PlatformUserInput  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const username = asNonEmptyString(params.get("username")) ?? asNonEmptyString(params.get("name"));
  const avater = asNonEmptyString(params.get("avater")) ?? asNonEmptyString(params.get("avatar"));

  if (!username || !avater) {
    return null;
  }

  return {
    username,
    avater,
  };
}

let pendingUser: PlatformUserInput  | null = null;
let lastSyncedKey = "";

function buildSyncKey(payload: PlatformUserInput ): string {
  return JSON.stringify({
    username: payload.username,
    avater: payload.avater,
  });
}

export function getPendingPlatformUser(): PlatformUserInput  | null {
  return pendingUser;
}

export function setPendingPlatformUser(input: unknown): PlatformUserInput  | null {
  const normalized = normalizeUserPayload(input);

  if (!normalized) {
    return null;
  }

  pendingUser = normalized;
  return pendingUser;
}

export async function syncPendingPlatformUser(): Promise<void> {
  if (!pendingUser) {
    return;
  }

  const nextKey = buildSyncKey(pendingUser);
  if (nextKey === lastSyncedKey) {
    return;
  }

  await createOrSyncUser(pendingUser);
  lastSyncedKey = nextKey;
  window.dispatchEvent(new CustomEvent(USER_SYNCED_EVENT, { detail: pendingUser }));
}

export function setupUserIntegration() {
  if (typeof window === "undefined") {
    return;
  }

  const globalUser =
    setPendingPlatformUser(window.__VOICE_PLATFORM_USER__) ??
    setPendingPlatformUser(window.voicePlatformUser) ??
    getUserFromQueryParams();

  if (globalUser) {
    pendingUser = globalUser;
  }

  window.addEventListener("message", (event: MessageEvent) => {
    const data = event.data;
    const payload =
      data && typeof data === "object" && "type" in data && data.type === USER_SYNC_EVENT
        ? (data as { payload?: unknown }).payload
        : data;

    setPendingPlatformUser(payload);
  });

  window.addEventListener(USER_SYNC_EVENT, (event: Event) => {
    const customEvent = event as CustomEvent<unknown>;
    setPendingPlatformUser(customEvent.detail);
  });

  window.gameUserIntegration = {
    syncUser: async (payload: unknown) => {
      const normalized = setPendingPlatformUser(payload);

      if (!normalized) {
        throw new Error("User payload must include username and avater");
      }

      await syncPendingPlatformUser();
    },
    getPendingUser: () => pendingUser,
  };
}
