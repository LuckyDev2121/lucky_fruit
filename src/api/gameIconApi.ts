// src/api/gameIcon.ts
import axios from "axios";

export interface GameIconResponse {
  icon: string;
}

const BASE_URL = "https://Funint.site"; // Change this to your actual backend URL

export const getGameIcon = async (): Promise<GameIconResponse> => {
  const response = await axios.post(
    `${BASE_URL}/game/icon/during/gaming`,
    {
      regisation: 5,
      mode: null,
      player_id: 261101,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Normalize URL so <img> works
  const iconUrl = response.data.icon.startsWith("http")
    ? response.data.icon
    : `${BASE_URL}${response.data.icon.startsWith("/") ? response.data.icon : `/${response.data.icon}`}`;

  return { icon: iconUrl };
};