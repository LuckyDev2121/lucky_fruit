import axios from "axios";
import { buildApiUrl } from "../config/gameConfig";

export type IntroResponse = {
  status: boolean;
  user_id?: number;
};

export const checkIntroIntegration = async (
  userId: number,
  token: number
): Promise<IntroResponse> => {
  const response = await axios.post(buildApiUrl("intro-integration"), {
    userid: userId,
    token: token,
  });

  return response.data;
};