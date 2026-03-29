import axios from "axios";

export interface RankTodayResponse {
  RankToday: string;
}

const BASE_URL = "https://Funint.site"; // Change this to your actual backend URL

export const getGameRankToday = async (): Promise<RankTodayResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/game/rank/today`,
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
    console.error("Error fetching today's rank:", error);
    throw error;
  }
};