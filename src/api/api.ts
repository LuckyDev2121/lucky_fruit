import { GAME_API_URL } from "../config/gameConfig";

type GameDetailsData = {
  id?: number;
  name?: string;
  [key: string]: unknown;
};

type GameDetails = {
  status?: boolean;
  data?: GameDetailsData;
  message?: string;
};

export async function fetchGameName(): Promise<GameDetailsData> {
  const response = await fetch(GAME_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  const result = (await response.json()) as GameDetails;

  if (!result.status || !result.data) {
    throw new Error(result.message || "Game data was not returned.");
  }

  return result.data;
}
