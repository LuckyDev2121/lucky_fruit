import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  getRealtimeHost,
  getRealtimePort,
  getUseTls,
  REVERB_KEY,
} from "../config/gameConfig";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

let echoInstance: Echo<"reverb"> | null = null;

function createEcho() {
  const useTls = getUseTls();
  const host = getRealtimeHost();
  const port = getRealtimePort();

  return new Echo({
    broadcaster: "reverb",
    key: REVERB_KEY,
    wsHost: host,
    httpHost: host,
    wsPort: port,
    httpPort: port,
    wssPort: port,
    httpsPort: port,
    forceTLS: useTls,
    enabledTransports: useTls ? ["wss"] : ["ws"],
    disableStats: true,
    cluster: "",
    namespace: false,
  });
}

export function getEcho() {
  if (!echoInstance) {
    echoInstance = createEcho();
  }

  return echoInstance;
}

export function resetEcho() {
  if (!echoInstance) {
    return;
  }

  echoInstance.disconnect();
  echoInstance = null;
}
