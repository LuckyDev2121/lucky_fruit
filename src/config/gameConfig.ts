export const GAME_REGISTRATION_ID = 5;
export const GAME_MODE_ID = 4;
export const GAME_PLAYER_ID = 261101;
export const GAME_WS_BASE_URL = "wss://funint.site/api/";
export const GAME_DETAILS_ID = 5;
export const GAME_DETAILS_WS_URL =
  import.meta.env.VITE_GAME_DETAILS_WS_URL ??
  `wss://funint.site/api/ws/game/${GAME_DETAILS_ID}/${GAME_MODE_ID}/`;
