import { useEffect, useMemo, useState } from "react";
import { getGameDetails, type GameDetails } from "../api/gameApi";
import { GAME_DETAILS_ID, GAME_DETAILS_WS_URL } from "../config/gameConfig";

type SocketStatus = "connecting" | "connected" | "disconnected";

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
  const [game, setGame] = useState<GameDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("connecting");

  const websocketUrl = useMemo(() => GAME_DETAILS_WS_URL, []);

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
    setSocketStatus("connecting");
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      setSocketStatus("connected");
      setError(null);
      console.log("[game.updated] websocket connected:", websocketUrl);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as unknown;
        const updatedName = getUpdatedGameName(payload);

        if (!updatedName) return;

        setGame((current) => ({
          id: current?.id ?? GAME_DETAILS_ID,
          name: updatedName,
        }));
        console.log("[game.updated] changed game name:", updatedName);
      } catch (messageError) {
        console.error("[game.updated] invalid websocket payload", messageError);
      }
    };

    socket.onerror = () => {
      setError("Realtime connection error");
      console.error("[game.updated] websocket error");
    };

    socket.onclose = () => {
      setSocketStatus("disconnected");
      console.log("[game.updated] websocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [websocketUrl]);

  return (
    <div className="absolute left-4 top-4 z-[80] w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/30 bg-black/70 p-4 text-white shadow-xl backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
        Game Container
      </p>
      <h1 className="mt-2 text-xl font-semibold">
        {game?.name ?? "Loading game name..."}
      </h1>
      <p className="mt-1 text-sm text-white/75">Game ID: {GAME_DETAILS_ID}</p>
      <p className="mt-1 text-sm text-white/75">
        WebSocket: {socketStatus}
      </p>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <p className="mt-3 text-xs text-white/60">
        Open the browser console to see every `game.updated` name change logged.
      </p>
    </div>
  );
}
