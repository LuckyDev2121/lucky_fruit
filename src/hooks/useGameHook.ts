import { useCallback, useEffect, useState } from "react";
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
const refreshGameData = useCallback(async () => {
    const [gameDetail, player, gameResults] = await Promise.all([
      fetchGameDetail(),
      fetchPlayerInfo(),
      fetchGameResults(),
    ]);

    setGameDetails(gameDetail);
    setPlayerInfo(player);
    setResults(gameResults);
  }, []);


useEffect(() => {
  void refreshGameData();

  const channel = echo.channel(REALTIME_CHANNEL);
  const eventName = `.${REALTIME_EVENT}`;

    channel.listen(eventName, async () => {
      await refreshGameData();
    });

    return () => {
    channel.stopListening(eventName);
    echo.leaveChannel(REALTIME_CHANNEL);
  };
}, [refreshGameData]);

// ================= ACTIONS =================
const handleCreateRound = useCallback(async () => {
    const data = await createRound();
    setRoundData(data);
    return data;
  }, []);

  const handleMakeResult = useCallback(async () => {
    const data = await makeGameResult();
    setMakeResult(data);
    return data;
  }, []);

  
//================= RETURN =================

return{
    betAmounts: gameDetails?.bet_amounts ?? [],
    options: gameDetails?.options ?? [],
    gameDetails,
    playerInfo,
    results,
    roundData,
    makeResult,
    refreshGameData,
    createRound: handleCreateRound,
    makeGameResult: handleMakeResult,
}
}
