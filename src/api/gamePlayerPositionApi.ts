import axios from "axios";

export interface PlayerPositionResponse {
  PlayerPosition: string;
}

const BASE_URL = "https://Funint.site"; // Change this to your actual backend URL

export const getGamePlayerPosition = async (): Promise<PlayerPositionResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/position/`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            regisation: 5,
            mode: null,
            player_id: 261101,
        },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching player position:", error);
    throw error;
  }
};