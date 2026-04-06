import { useEffect, useState } from "react";
import { echo } from "./echo";
import { fetchGameDetail,
    fetchPlayerInfo,
    fetchGameResults,
    createRound,
    // placeBet,
    makeGameResult,
    type GameDetailsData,
    type PlayerDetailsData,
    type GameResults,
    type CreateRoundResponse,
    // type PlaceBet,
    type ResultData
 } from "../api/api";
import {
  REALTIME_CHANNEL,
  REALTIME_EVENT,
  getAssetUrl,
} from "../config/gameConfig";

//==================== TYPES =================
export function resolveAssetUrl(path: string): string {
  return getAssetUrl(path);
}
//====================MAIN HOOK =================
export function useGame() {

    const [gameDetails, setGameDetails] = useState<GameDetailsData | null>(null);
    const [playerInfo, setPlayerInfo] = useState<PlayerDetailsData | null>(null);
    const [results, setResults] = useState<GameResults | null>(null);   
    const [roundData, setRoundData] = useState<CreateRoundResponse | null>(null);
    const [makeResult, setMakeResult] = useState<ResultData | null>(null);
    // const [placeBetAmount, setPlaceBetAmount]= useState<PlaceBet | null>(null);


//================= REAL-TIME SOCKET =================
useEffect(() => {
  const channel = echo.channel(REALTIME_CHANNEL);

    channel.listen(REALTIME_EVENT, async () => {
        const gameDetail = await fetchGameDetail();
        const playerInfo = await fetchPlayerInfo();
        const gameResults = await fetchGameResults();
        const createRoundData = await createRound();
        // const placeBetData = await placeBet();
        const makeRusultData = await makeGameResult();
        setResults(gameResults);
        setPlayerInfo(playerInfo);
        setGameDetails(gameDetail);
        setRoundData(createRoundData);
        setMakeResult(makeRusultData)
        // setPlaceBetAmount(placeBetData)
    });

    return () => {
    echo.leaveChannel("game-channel");
  };
}, []);

// ================= ACTIONS =================


//================= RETURN =================

return{
    betAmounts: gameDetails?.bet_amounts ?? [],
    options: gameDetails?.options ?? [],
    gameDetails,
    playerInfo,
    results,
    roundData,
    makeResult,
    // placeBetAmount,
}
}