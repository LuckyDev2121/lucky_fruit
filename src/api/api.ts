import axios from "axios";
import {
  GAME_ID,
  buildApiUrl,
} from "../config/gameConfig";
import { getUserId } from "../utils/user";
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
  const response = await axios.get<GameDetails>(buildApiUrl(`game-details/${GAME_ID}`));

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
  const userId = getUserId();
  const response = await axios.get<PlayerDetails>(buildApiUrl(`player/${userId}`));

  if (!response.data.status) {
    throw new Error(response.data.message || "API returned false status");
  }

  return response.data.data as PlayerDetailsData;
};

type GameResultItem = {
  option_id: number;
  option_name: string;
  is_jackpot:number;
};

export type GameResults = {
  status?: boolean;
  data?: GameResultItem[];
  message?: string;
};

export const fetchGameResults = async (): Promise<GameResults> => {
  const response = await axios.get<GameResults>(buildApiUrl(`game/${GAME_ID}/results`));

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
  const userId = getUserId();
  const response = await axios.post<PlaceBet>(buildApiUrl("place-bet"), {
    game_id: GAME_ID,
    option_id: betId,
    amount: amount,
    user_id: userId,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to place bet");
  }

  return response.data;
};
  
type Winners = {
  id: number;
  username: string;
  avater: string;
  win_amount: number;
}
export type ResultData = {
  round_id: number;
  round_no: number;
  winning_option_id: number[]; // ✅ ALWAYS ARRAY NOW
  winners: Winners[];
  jackpot_avatar?: string;
};

export type MakeResultResponse = {
  status: boolean;
  message: string;
  jackpot_avatar?:string;
  data?: ResultData;
  remaining_seconds?: number;
  
};

export const makeGameResult = async (roundId: number): Promise<ResultData> => {
    const response = await axios.post<MakeResultResponse>(buildApiUrl("round-result"), {
      game_id: GAME_ID,
      round_no: roundId,
    });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to make game result");
  }
  if (!response.data.data) {
    throw new Error(response.data.message || "Failed to make game result");
  }

  const raw = response.data.data;

  const normalizedWinningIds = Array.isArray(raw.winning_option_id)
    ? raw.winning_option_id.map(Number)
    : [raw.winning_option_id];

     return {
    round_id: raw.round_id,
    round_no: raw.round_no,
    winning_option_id: normalizedWinningIds,
    winners: raw.winners,
    jackpot_avatar: response.data.jackpot_avatar, // ✅ merge here
  };
};


export type CreateRoundResponse = {
  game_id: number;
  round_no: number;
  remaining_seconds: number;
  stage: string;
};


export const createRound = async (): Promise<CreateRoundResponse> => {
    const response = await axios.get<CreateRoundResponse>(buildApiUrl(`game-round/${GAME_ID}`));
  
  if (!response.data) {
    throw new Error(response.data || "Failed to load sound setting");
  }

  return response.data;
}

type SoundSettingResponse = {
  status?: boolean;
  data?: number;
  message?: string;
};

export const fetchSoundSetting = async (): Promise<boolean> => {
  const userId = getUserId();

  const response = await axios.get<SoundSettingResponse>(
    buildApiUrl(`sound-setting/${GAME_ID}/${userId}`)
  );

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
  const response = await axios.post<SaveSoundSettingResponse>(buildApiUrl("sound-setting"), {
    game_id: GAME_ID,
    player_id: playerId,
    status: isMusicOn ? 1 : 0,
  });

 if (!response.data.status) {
    throw new Error(response.data.message || "Failed to save music setting");
  }

  return response.data;
};

type MusicSettingResponse = {
  status?: boolean;
  data?: number;
  message?: string;
};

export const fetchMusicSetting = async (): Promise<boolean> => {
   const userId = getUserId();
  const response = await axios.get<MusicSettingResponse>(buildApiUrl(`music-setting/${GAME_ID}/${userId}`));

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to load music setting");
  }

  return response.data.data === 1;
};

type SaveMusicSettingResponse = {
  status?: boolean;
  message?: string;
};

export const saveMusicSetting = async (
  playerId: number,
  isMusicOn: boolean,
): Promise<SaveMusicSettingResponse> => {
  const response = await axios.post<SaveMusicSettingResponse>(buildApiUrl("music-setting"), {
    game_id: GAME_ID,
    player_id: playerId,
    status: isMusicOn ? 1 : 0,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to save music setting");
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
  const response = await axios.get<RankingTodayResponse>(buildApiUrl(`ranking-today/${GAME_ID}`));

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to load ranking today");
  }
  return response.data.data ?? [];
};

export type WinTodayResponse={
  status?:boolean;
  user_id?:number;
  win?:number;
}
export const fetchWinToday = async (): Promise<WinTodayResponse> => {
  const userId = getUserId();

  const response = await axios.get<WinTodayResponse>(
    buildApiUrl(`win-today/${userId}`)
  );

  return response.data;
};

type RoundData={
  id:number,
  game_id:number,
  round_no:number,
  winning_option_id:number[] ;
  status:number,
  created_at:string,
}
export type PlayerLogData={
  id?:number;
  round_id?:number;
  player_id?:number;
  game_id?:number;
  option_id?:number;
  amount?:string;
  status?:number;
  created_at?:string;
  round_data?:RoundData;
}
type PlayerLogResponse={
  status?:boolean;
  message?:string;
  data?:PlayerLogData[];
}

export const fetchPlayerLog = async (): Promise<PlayerLogData[]> => {
  const userId = getUserId();

  const response = await axios.get<PlayerLogResponse>(
    buildApiUrl(`player-log/${userId}`)
  );

  return response.data.data ?? [];
};

export type RechargeUrlResponse={
  status?:boolean;
  message?:string;
  url?:string;
}
export const fetchRechargeUrl = async (): Promise<RechargeUrlResponse> => {
  const response = await axios.get<RechargeUrlResponse>(buildApiUrl("company/wallet/1"));

  if (!response.data.status) {
    throw new Error(response.data.message || "API returned false status");
  }

  return response.data;
};

