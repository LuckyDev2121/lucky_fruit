import { useRef, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  REVERB_KEY,
  REALTIME_HOST,
  REALTIME_PORT,
  USE_TLS,
  CREAT_ROUND_API_URL,
  GAME_ID,
} from "../config/gameConfig";

/* ================= TYPES ================= */

type CreateRoundResponse =
  | {
      status: false;
      message: string;
    }
  | {
      status: true;
      message: string;
      data: {
        game_id: number;
        round_no: number;
        status: number;
        id: number;
      };
    };

type RealtimeEvent = {
  type: string;
  payload: unknown;
};

/* ================= SETUP ECHO ================= */

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "pusher",
  key: REVERB_KEY,
  wsHost: REALTIME_HOST,
  wsPort: REALTIME_PORT,
  wssPort: REALTIME_PORT,
  forceTLS: USE_TLS,
  enabledTransports: ["ws", "wss"],
});

/* ================= API ================= */

export async function createRound(): Promise<CreateRoundResponse> {
  const res = await fetch(CREAT_ROUND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      game_id: GAME_ID,
    }),
  });

  return res.json();
}

/* ================= HOOK ================= */

export function useCreateRound(
  onEvent?: (event: RealtimeEvent) => void
) {
  const [snapshot, setSnapshot] = useState<unknown>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
const subscribedRef = useRef(false);
 useEffect(() => {
  if (subscribedRef.current) return;
  subscribedRef.current = true;

  const channel = echo.channel(REALTIME_CHANNEL);

  setIsConnected(true);

  channel.listen(REALTIME_EVENT, (data: unknown) => {
    setSnapshot(data);

    onEvent?.({
      type: REALTIME_EVENT,
      payload: data,
    });
  });

  return () => {
    echo.leave(REALTIME_CHANNEL);
    setIsConnected(false);
    subscribedRef.current = false;
  };
}, []); // ✅ IMPORTANT: empty deps
  return {
    snapshot,
    isConnected,
    createRound, // expose API
  };
}