import axios from "axios";

export interface RankYesterdayResponse {
  RankYesterday: string;
}

const BASE_URL = "https://funint.site/api"; // Change this to your actual backend URL

export const getGameRankYesterday = async (): Promise<RankYesterdayResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/rank/yesterday`,
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
    console.error("Error fetching yesterday's rank:", error);
    throw error;
  }
};