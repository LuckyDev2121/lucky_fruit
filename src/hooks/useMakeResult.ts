import { useEffect, useState } from "react";
/* ================= CONFIG ================= */

import { MAKE_RESULT_API_URL } from "../config/gameConfig";

/* ================= TYPES ================= */

type ResultData = {
  round_id: number;
  round_no: number;
  winning_option_id: number;
  winner_user_ids: number[];
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: ResultData;
};

/* ================= API ================= */

async function makeGameResult(): Promise<ResultData> {
  const res = await fetch(MAKE_RESULT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ game_id: 5 }),
  });

  if (!res.ok) throw new Error("Request failed");

  const json = (await res.json()) as ApiResponse;

  if (!json.status) throw new Error(json.message);

  return json.data;
}

/* ================= HOOK ================= */

export function useMakeGameResult() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  /* ================= TIMER ================= */

  useEffect(() => {
    const handleRoundEnd = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const data = await makeGameResult();
      setResult(data);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  handleRoundEnd(); // Start first round immediately
  }, [isProcessing]);

  /* ================= ROUND ================= */

  

  return {
    isProcessing,
    result,
  };
}