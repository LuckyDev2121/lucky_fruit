import { useState } from "react";
/* ================= CONFIG ================= */

import { PLACE_BET_API_URL } from "../config/gameConfig";

/* ================= TYPES ================= */

type ApiResponse = {
  status: boolean;
  message: string;
};

/* ================= API ================= */

async function placeBet(betId: number, amount: number): Promise<string> {
  const res = await fetch(PLACE_BET_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
    "game_id": 5,
    "option_id": betId,
    "amount": amount
}),
  });

  if (!res.ok) throw new Error("Request failed");

  const json = (await res.json()) as ApiResponse;

  if (!json.status) throw new Error(json.message);

  return json.message;
}

/* ================= HOOK ================= */
export function usePlaceBet() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const place = async (betId: number, amount: number) => {
    setIsProcessing(true);

    try {
      const data = await placeBet(betId, amount);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return { place, isProcessing, result };
}
// export function usePlaceBet(betId: number, amount: number) {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [result, setResult] = useState<string | null>(null);

//   /* ================= TIMER ================= */

//   useEffect(() => {
//     if (!betId || !amount) return;

//     const handleRoundEnd = async () => {
//     if (isProcessing) return;

//     setIsProcessing(true);

//     try {
//       const data = await placeBet(betId, amount);
//       setResult(data);
//     } catch (err) {
//       console.error("API error:", err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };
//   handleRoundEnd(); // Start first round immediately
//   }, [isProcessing, betId, amount]);

//   /* ================= ROUND ================= */

  

//   return {
//     isProcessing,
//     result,
//   };
// }