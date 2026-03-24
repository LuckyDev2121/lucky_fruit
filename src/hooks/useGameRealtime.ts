import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GAME_MODE_ID,
  GAME_PLAYER_ID,
  GAME_REGISTRATION_ID,
  GAME_WS_BASE_URL,
} from "../config/gameConfig";
import {
  reduceGameMessage,
  reducePlayerMessage,
  type GameRealtimeState,
  type RealtimeMessage,
} from "./realtimeParsers";

const INITIAL_STATE: GameRealtimeState = {
  connectionStatus: "connecting",
  countdownSeconds: null,
  latestResultFruit: null,
  latestResultIcon: null,
  playerBalance: null,
  winList: [],
  jackpotAmount: null,
  lastError: null,
  reconnectAttempts: 0,
};

export function useGameRealtime() {
  const [state, setState] = useState<GameRealtimeState>(INITIAL_STATE);

  const gameSocketRef = useRef<WebSocket | null>(null);
  const playerSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  const gameUrl = useMemo(
    () => `${GAME_WS_BASE_URL}/ws/game/${GAME_REGISTRATION_ID}/${GAME_MODE_ID}/`,
    []
  );
  const playerUrl = useMemo(
    () => `${GAME_WS_BASE_URL}/ws/player/${GAME_PLAYER_ID}/`,
    []
  );

  const clearSockets = useCallback(() => {
    gameSocketRef.current?.close();
    playerSocketRef.current?.close();
    gameSocketRef.current = null;
    playerSocketRef.current = null;
  }, []);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connectRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    let mounted = true;

    const sendGameRequest = (action: string, socket: WebSocket) => {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ action }));
    };

    const sendBalanceRequest = (socket: WebSocket) => {
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          action: "get_player_balance",
          player_id: String(GAME_PLAYER_ID),
        })
      );
    };

    const connect = () => {
      if (!mounted) return;

      clearReconnectTimer();
      clearSockets();

      setState((prev) => ({
        ...prev,
        connectionStatus: "connecting",
      }));

      const gameSocket = new WebSocket(gameUrl);
      const playerSocket = new WebSocket(playerUrl);
      gameSocketRef.current = gameSocket;
      playerSocketRef.current = playerSocket;

      gameSocket.onopen = () => {
        if (!mounted) return;

        console.log("=====gameSocket:====Connected!");
        setState((prev) => ({
          ...prev,
          connectionStatus: "connected",
          reconnectAttempts: 0,
          lastError: null,
        }));
        sendGameRequest("get_countdown", gameSocket);
        sendGameRequest("get_win_list", gameSocket);
        sendGameRequest("get_jackpot", gameSocket);
      };

      playerSocket.onopen = () => {
        console.log("=====playerSocket:====Connected!");
        sendBalanceRequest(playerSocket);
      };

      gameSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealtimeMessage;
          setState((prev) => reduceGameMessage(prev, message));
        } catch {
          setState((prev) => ({ ...prev, lastError: "Invalid realtime payload" }));
        }
      };

      playerSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealtimeMessage;
          setState((prev) => reducePlayerMessage(prev, message));
        } catch {
          setState((prev) => ({ ...prev, lastError: "Invalid realtime payload" }));
        }
      };

      const scheduleReconnect = () => {
        if (!mounted || reconnectTimerRef.current !== null) return;

        setState((prev) => ({
          ...prev,
          connectionStatus: "disconnected",
          reconnectAttempts: prev.reconnectAttempts + 1,
          lastError: prev.lastError ?? "Connection lost. Reconnecting...",
        }));

        reconnectTimerRef.current = window.setTimeout(() => {
          reconnectTimerRef.current = null;
          connect();
        }, 3000);
      };

      gameSocket.onclose = () =>{
        console.log("=====gameSocket:====Disconnected. Reconnecting in 3 seconds...");
        scheduleReconnect();
      }
      playerSocket.onclose = () =>{
        console.log("=====playerSocket:====Disconnected. Reconnecting in 3 seconds...");
        scheduleReconnect();
      }
      gameSocket.onerror = (error) => {
        console.log("=====gameSocket:====Error:", error);
        gameSocket.close();
      };
      playerSocket.onerror = (error) => {
        console.log("=====playerSocket:====Error:", error);
        playerSocket.close();
      };
    };

    connectRef.current = connect;
    connect();

    return () => {
      mounted = false;
      clearReconnectTimer();
      clearSockets();
    };
  }, [clearReconnectTimer, clearSockets, gameUrl, playerUrl]);

  const retryConnection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastError: null,
    }));
    connectRef.current();
  }, []);

  return {
    ...state,
    retryConnection,
  };
}
