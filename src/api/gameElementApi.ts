import axios from "axios";

export interface GameElement {
  id: number;
  element_name: string;
  element_icon: string;
  paytable: number;
  win_weights: number;
}

function normalizeElements(elements: GameElement[]): GameElement[] {
  return elements.map((element) => ({
    ...element,
    element_icon: element.element_icon.startsWith("http")
      ? element.element_icon
      : `https://funint.site/${element.element_icon.replace(/^\/+/, "")}`,
  }));
}

export const fetchGameElements = async (): Promise<GameElement[]> => {
  try {
    const response = await axios({
      url: "https://funint.site/api/game/elements",
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

    return normalizeElements(response.data as GameElement[]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching game elements:", error.response?.data || error.message);
    } else {
      console.error("Error fetching game elements:", error);
    }

    return [];
  }
};
