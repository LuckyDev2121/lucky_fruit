import cherryIcon from "../assets/fruits/cherry.svg";
import grapesIcon from "../assets/fruits/grapes.svg";
import kiwiIcon from "../assets/fruits/kiwi.svg";
import lemonIcon from "../assets/fruits/lemon.svg";
import orangeIcon from "../assets/fruits/orange.svg";
import strawberryIcon from "../assets/fruits/strawberry.svg";
import tomatoIcon from "../assets/fruits/tomato.svg";
import watermelonIcon from "../assets/fruits/watermelon.svg";

export interface GameElement {
  id: number;
  element_name: string;
  element_icon: string;
  paytable: number;
  win_weights: number;
}

const fallbackGameElements: GameElement[] = [
  { id: 33, element_name: "Kiwi", element_icon: kiwiIcon, paytable: 5, win_weights: 0 },
  { id: 32, element_name: "Orange", element_icon: orangeIcon, paytable: 5, win_weights: 0 },
  { id: 31, element_name: "Lemon", element_icon: lemonIcon, paytable: 5, win_weights: 0 },
  { id: 30, element_name: "Cherry", element_icon: cherryIcon, paytable: 10, win_weights: 0 },
  { id: 29, element_name: "Strawberry", element_icon: strawberryIcon, paytable: 15, win_weights: 0 },
  { id: 28, element_name: "Grapes", element_icon: grapesIcon, paytable: 25, win_weights: 0 },
  { id: 27, element_name: "Watermelon", element_icon: watermelonIcon, paytable: 40, win_weights: 0 },
  { id: 26, element_name: "Tomato", element_icon: tomatoIcon, paytable: 5, win_weights: 0 },
];

function normalizeElements(elements: GameElement[]) {
  return elements.map((element) => ({
    ...element,
    element_icon: element.element_icon.startsWith("http")
      ? element.element_icon
      : `https://funint.site/${element.element_icon.replace(/^\/+/, "")}`,
  }));
}

export async function getGameElements() {
  const shouldUseLiveApi =
    import.meta.env.PROD || import.meta.env.VITE_USE_LIVE_GAME_ELEMENTS === "true";

  if (!shouldUseLiveApi) {
    return fallbackGameElements;
  }

  try {
    const response = await fetch("/game/game/elements");
    console.log("Successful", response);

    if (!response.ok) {
      throw new Error(`Failed to fetch elements: ${response.status}`);
    }
    const data = (await response.json()) as GameElement[];
    return normalizeElements(data);
  } catch (error) {
    console.warn("Using fallback game elements because the live API is unavailable.", error);
    return fallbackGameElements;
  }
}
