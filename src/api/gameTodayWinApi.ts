import axios from "axios";

export interface TodayWinResponse {
  TodayWin: string;
}

const BASE_URL = "https://funint.site"; // Change this to your actual backend URL

export const getGameTodayWin = async (): Promise<TodayWinResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/today/win`,
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
    console.error("Error fetching today's win:", error);
    throw error;
  }
};