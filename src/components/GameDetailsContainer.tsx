import { useEffect, useRef, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getGameDetails, type GameDetails } from "../api/gameApi";
import {
  GAME_DETAILS_CHANNEL,
  GAME_DETAILS_EVENT,
  GAME_DETAILS_ID,
  PUSHER_APP_KEY,
  PUSHER_FORCE_TLS,
  PUSHER_HOST,
  PUSHER_WS_PORT,
  PUSHER_WSS_PORT,
} from "../config/gameConfig";
import { div } from "framer-motion/client";

type SocketStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "missing-config";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getUpdatedGameName(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const eventName =
    typeof payload.event === "string"
      ? payload.event
      : typeof payload.type === "string"
        ? payload.type
        : null;

  const rawData = isRecord(payload.data) ? payload.data : payload;
  const game = isRecord(rawData.game) ? rawData.game : null;
  const name = game && typeof game.name === "string" ? game.name : null;

  if (!name) return null;
  if (eventName && eventName !== "game.updated") return null;

  return name;
}

export default function GameDetailsContainer() {
  const isRealtimeConfigured = PUSHER_APP_KEY.trim() !== "";
  const [game, setGame] = useState<GameDetails | null>(null);
  const [error, setError] = useState<string | null>(
    isRealtimeConfigured
      ? null
      : "Missing VITE_PUSHER_APP_KEY. Realtime is not configured yet."
  );
  const [socketStatus, setSocketStatus] = useState<SocketStatus>(
    isRealtimeConfigured ? "connecting" : "missing-config"
  );
  const hasLoggedConfigError = useRef(false);

  useEffect(() => {
    let active = true;

    const loadGameDetails = async () => {
      try {
        const details = await getGameDetails(GAME_DETAILS_ID);
        if (!active) return;
        setGame(details);
        console.log("[game.details] initial game name:", details.name);
      } catch (loadError) {
        if (!active) return;
        setError("Failed to load game details");
        console.error("[game.details] failed to fetch game details", loadError);
      }
    };

    loadGameDetails();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.Pusher = Pusher;

    if (!isRealtimeConfigured) {
      if (!hasLoggedConfigError.current) {
        console.error(
          "[game.updated] missing VITE_PUSHER_APP_KEY. Add your broadcast credentials to .env before testing realtime."
        );
        hasLoggedConfigError.current = true;
      }

      return;
    }

    const echo = new Echo({
      broadcaster: "pusher",
      key: PUSHER_APP_KEY,
      client: new Pusher(PUSHER_APP_KEY, {
        cluster: "",
        wsHost: PUSHER_HOST,
        wsPort: PUSHER_WS_PORT,
        wssPort: PUSHER_WSS_PORT,
        forceTLS: PUSHER_FORCE_TLS,
        enabledTransports: ["ws", "wss"],
      }),
    });

    const pusherConnection = echo.connector.pusher.connection;

    const handleConnected = () => {
      setSocketStatus("connected");
      setError(null);
      console.log(
        `[game.updated] connected to channel "${GAME_DETAILS_CHANNEL}" on ${PUSHER_HOST}`
      );
    };

    const handleDisconnected = () => {
      setSocketStatus("disconnected");
      console.log("[game.updated] realtime disconnected");
    };

    const handleError = (connectionError: unknown) => {
      setError("Realtime connection error");
      console.error("[game.updated] connection error", connectionError);
    };

    pusherConnection.bind("connected", handleConnected);
    pusherConnection.bind("disconnected", handleDisconnected);
    pusherConnection.bind("error", handleError);

    echo.channel(GAME_DETAILS_CHANNEL).listen(`.${GAME_DETAILS_EVENT}`, (payload: unknown) => {
      const updatedName = getUpdatedGameName(payload);

      if (!updatedName) {
        console.log("[game.updated] event received, but no game name found:", payload);
        return;
      }

      setGame((current) => ({
        id: current?.id ?? GAME_DETAILS_ID,
        name: updatedName,
      }));
      console.log("[game.updated] changed game name:", updatedName);
    });

    return () => {
      echo.leave(GAME_DETAILS_CHANNEL);
      pusherConnection.unbind("connected", handleConnected);
      pusherConnection.unbind("disconnected", handleDisconnected);
      pusherConnection.unbind("error", handleError);
      echo.disconnect();
    };
  }, [isRealtimeConfigured]);

  return (
    <div>
      {/* <div className="absolute left-4 top-4 z-[80] w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/30 bg-black/70 p-4 text-white shadow-xl backdrop-blur-sm"> */}
      {/* <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
        Game Container
      </p>
      <h1 className="mt-2 text-xl font-semibold">
        {game?.name ?? "Loading game name..."}
      </h1>
      <p className="mt-1 text-sm text-white/75">Game ID: {GAME_DETAILS_ID}</p>
      <p className="mt-1 text-sm text-white/75">
        WebSocket: {socketStatus}
      </p>
      <p className="mt-1 text-xs text-white/60">
        Channel: {GAME_DETAILS_CHANNEL} | Event: {GAME_DETAILS_EVENT}
      </p>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <p className="mt-3 text-xs text-white/60">
        Open the browser console to see every `game.updated` name change logged.
      </p> */}
    </div>
  );
}
