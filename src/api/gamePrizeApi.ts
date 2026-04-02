import axios from "axios";

export interface PrizeResponse {
  Prize: string;
}

const BASE_URL = "https://funint.site/api"; // Change this to your actual backend URL

export const getGamePrize = async (): Promise<PrizeResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/prize/distribution`,
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
    console.error("Error fetching prize:", error);
    throw error;
  }
};