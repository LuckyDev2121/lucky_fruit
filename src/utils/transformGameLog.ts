type DetailItem = {
  option_id: number;
  bet_amount: number;
};

export type TransformedRound = {
  round_id: number;
  winning_option_id: number[];
  status: number;
  detail: DetailItem[];
};

type RoundData={
  id:number,
  game_id:number,
  round_no:number,
  winning_option_id:number[],
  status:number,
  created_at:string,
};

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
};

function parseWinningIds(input: unknown): number[] {
  if (!input) return [];

  if (typeof input === "string") {
    try {
      return JSON.parse(input).map(Number);
    } catch {
      return [];
    }
  }

  if (Array.isArray(input)) {
    return input.map(Number);
  }

  return [];
}

export const transformGameLog = (
  data: PlayerLogData[]
): TransformedRound[] => {
  const result: Record<
    number,
    {
      round_id: number;
      winning_option_id: number[];
      status: number;
      detail: Record<number, number>;
    }
  > = {};

  data.forEach((item) => {
    // skip invalid (because optional fields)
    if (
      item.round_id === undefined ||
      item.option_id === undefined ||
      item.amount === undefined
    )
      return;

    const roundId = item.round_id;

    // create round group
    if (!result[roundId]) {
      result[roundId] = {
        round_id: roundId,
        winning_option_id: parseWinningIds(item.round_data?.winning_option_id),
        status: item.round_data?.status ?? 0,
        detail: {
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
        },
      };
    }

    // add amount
    const optionId = item.option_id;
    const amount = Number(item.amount);

    if (result[roundId].detail[optionId] !== undefined) {
      result[roundId].detail[optionId] += amount;
    }
  });

  // convert to final array
  return Object.values(result)
    .map((round) => ({
      round_id: round.round_id,
      winning_option_id: round.winning_option_id,
      status: round.status,
      detail: Object.entries(round.detail).map(([key, value]) => ({
        option_id: Number(key),
        bet_amount: value,
      })),
    }))
    .sort((a, b) => b.round_id - a.round_id); // latest first
};