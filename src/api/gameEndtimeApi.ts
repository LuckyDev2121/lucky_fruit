import axios from "axios";

export interface EndtimeResponse {
  Endtime: string;
}

const BASE_URL = "https://funint.site"; // Change this to your actual backend URL

export const getGameEndtime = async (): Promise<EndtimeResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/game/session/end/time`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            regisation: 5,
        },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching game end time:", error);
    throw error;
  }
};