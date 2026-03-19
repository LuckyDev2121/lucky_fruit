import axios from "axios";

export interface CoinResponse {
  icon:string;
}

const BASE_URL = "https://funint.site";

export const getCoinIcon = async (): Promise<CoinResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/game/coin`,
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
    console.error("Error fetching coin icon:", error);
    throw error;
  }
};