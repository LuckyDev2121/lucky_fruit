import axios from "axios";
import {
  GAME_DETAILS_API_URL,
  PLAYER_API_URL,
  GAME_RESULTS_API_URL,
  PLACE_BET_API_URL,
  CREAT_ROUND_API_URL,
  MAKE_RESULT_API_URL,
  SOUND_SETTING_API_URL,
  SOUND_SETTING_GAME_API_URL,
  RANKING_TODAY_API_URL,
} from "../config/gameConfig";
type GameOption = {
  id: number;
  name: string;
  logo: string;
};

type BetAmount = {
  id: number;
  amount: string;
  icon: string;
};

type HowToPlay = {
  rules?: string;
};

export type GameDetailsData = {
  id?: number;
  name?: string;
  how_to_play?: HowToPlay;
  options?: GameOption[];
  bet_amounts?: BetAmount[];
  [key: string]: unknown;
};

type GameDetails = {
  status?: boolean;
  data?: GameDetailsData;
  message?: string;
};

export const fetchGameDetail = async (): Promise<GameDetailsData> => {
  const response = await axios.get<GameDetails>(GAME_DETAILS_API_URL);

  if (!response.data.status) {
    throw new Error(response.data.message || "API returned false status");
  }

  return response.data.data as GameDetailsData;
};


export type PlayerDetailsData = {
  id?: number;
  username?: string;
  avater?: string;
  balance?: string;
};

type PlayerDetails = {
  status?: boolean;
  data?: PlayerDetailsData;
  message?: string;
};

export const fetchPlayerInfo = async (): Promise<PlayerDetailsData> => {
  const response = await axios.get<PlayerDetails>(PLAYER_API_URL);

  if (!response.data.status) {
    throw new Error(response.data.message || "API returned false status");
  }

  return response.data.data as PlayerDetailsData;
};




type GameResultItem = {
  option_id: number;
  option_name: string;
};

export type GameResults = {
  status?: boolean;
  data?: GameResultItem[];
  message?: string;
};

export const fetchGameResults = async (): Promise<GameResults> => {
  const response = await axios.get<GameResults>(GAME_RESULTS_API_URL);

  if (!response.data.status) {
    throw new Error(response.data.message || "API returned false status");
  }

  return response.data;
};

export type PlaceBet = {
  status?: boolean;
  message?: string;
};

export const placeBet = async (betId: number, amount: number): Promise<PlaceBet> => {
  const response = await axios.post<PlaceBet>(PLACE_BET_API_URL, {
    game_id: 5,
    option_id: betId,
    amount: amount,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to place bet");
  }

  return response.data;
};
  
type Winners = {
  id: number;
  username: string;
  balance: number;
  avater: string;
}
export type ResultData = {
  round_id: number;
  round_no: number;
  winning_option_id: number;
  winners: Winners[];
};

export type MakeResultResponse = {
  status: boolean;
  message: string;
  data: ResultData;
};

export const makeGameResult = async (): Promise<ResultData> => {
  const response = await axios.post<MakeResultResponse>(MAKE_RESULT_API_URL, {
    game_id: 5,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to make game result");
  }

  return response.data.data;
};


export type CreateRoundResponse =
  {
      status?: boolean;
      message?: string;
      data: {
        game_id: number;
        round_no: number;
        status: number;
        created_at: string;
        id: number;
      };
    };

export const createRound = async (): Promise<CreateRoundResponse> => {
    const response = await axios.post<CreateRoundResponse>(CREAT_ROUND_API_URL, {
    game_id: 5,
  });
  return response.data;
}

type SoundSettingResponse = {
  status?: boolean;
  data?: number;
  message?: string;
};

export const fetchSoundSetting = async (): Promise<boolean> => {
  const response = await axios.get<SoundSettingResponse>(SOUND_SETTING_GAME_API_URL);

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to load sound setting");
  }

  return response.data.data === 1;
};

type SaveSoundSettingResponse = {
  status?: boolean;
  message?: string;
};

export const saveSoundSetting = async (
  playerId: number,
  isMusicOn: boolean,
): Promise<SaveSoundSettingResponse> => {
  const response = await axios.post<SaveSoundSettingResponse>(SOUND_SETTING_API_URL, {
    game_id: 5,
    player_id: playerId,
    status: isMusicOn ? 1 : 0,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to save sound setting");
  }

  return response.data;
};

export type RankingTodayItem = {
  player_id: number;
  total_win: string;
  player?: {
    id: number;
    username: string;
    avater: string;
  };
};

type RankingTodayResponse = {
  status?: boolean;
  data?: RankingTodayItem[];
  message?: string;
};

export const fetchRankingToday = async (): Promise<RankingTodayItem[]> => {
  const response = await axios.get<RankingTodayResponse>(RANKING_TODAY_API_URL);

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to load ranking today");
  }
  return response.data.data ?? [];
};