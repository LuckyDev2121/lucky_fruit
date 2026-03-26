import axios from "axios";

export interface TopWinnersResponse {
  TopWinners: string;
}

const BASE_URL = "http://localhost:5000"; // Change this to your actual backend URL

export const getGameTopWinners = async (): Promise<TopWinnersResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/top/winers`,
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
    console.error("Error fetching music:", error);
    throw error;
  }
};