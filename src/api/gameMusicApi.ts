import axios from "axios";

export interface MusicResponse {
  music: string;
}

const BASE_URL = "http://localhost:5000"; // Change this to your actual backend URL

export const getGameMusic = async (): Promise<MusicResponse> => {
  try {
    const response = await axios({
        url: `${BASE_URL}/game/game/music`,
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