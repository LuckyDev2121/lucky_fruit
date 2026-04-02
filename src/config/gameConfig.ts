export const GAME_REGISTRATION_ID = 5;
export const GAME_MODE_ID = 4;
export const GAME_PLAYER_ID = 261101;
export const GAME_WS_BASE_URL = "wss://funint.site/api/";
export const GAME_DETAILS_ID = 5;
export const GAME_DETAILS_CHANNEL =
  import.meta.env.VITE_GAME_DETAILS_CHANNEL ?? "game-channel";
export const GAME_DETAILS_EVENT =
  import.meta.env.VITE_GAME_DETAILS_EVENT ?? "game.updated";
export const PUSHER_APP_KEY =
  import.meta.env.VITE_PUSHER_APP_KEY ?? "k6dbocgucm0at6gwak3y";
export const PUSHER_HOST = import.meta.env.VITE_PUSHER_HOST ?? "funint.site";
export const PUSHER_WS_PORT = Number(import.meta.env.VITE_PUSHER_WS_PORT ?? 8080);
export const PUSHER_WSS_PORT = Number(import.meta.env.VITE_PUSHER_WSS_PORT ?? 443);
export const PUSHER_FORCE_TLS =
  import.meta.env.VITE_PUSHER_FORCE_TLS !== "false";
