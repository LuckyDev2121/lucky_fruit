import { useEffect, useState } from "react";

import { MusicPlayer, SoundPlayer } from "./components/GameMusic";
import LoadingScreen from "./components/LoadingScrean";
import LuckyFruitGame from "./components/LuckyFruitGame";
import { GAME_ASSETS, getAssetUrl } from "./config/gameConfig";
import { useGameDetails } from "./hooks/useGameDetails";
import { useGameResults } from "./hooks/useGameResults";
import { usePlayerDetails } from "./hooks/usePlayerDetails";
import { useGame } from "./hooks/useGameHook";

async function preloadGameAssets(setProgress: (value: number) => void) {
  const assets = Object.values(GAME_ASSETS).map((fileName) =>
    getAssetUrl(fileName),
  );

  if (assets.length === 0) {
    setProgress(100);
    return;
  }

  let loaded = 0;

  await Promise.all(
    assets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => {
            loaded += 1;
            setProgress(Math.round((loaded / assets.length) * 100));
            resolve();
          };
        }),
    ),
  );
}

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isSoundPlaying, setIsSoundPlaying] = useState(true);
  const [isOpenResultMenu, setIsOpenResultMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAssetsLoading, setIsAssetsLoading] = useState(true);
  const [roundId, setRoundId] = useState<number | null>(null);
  const { isLoading: isGameDetailsLoading } = useGameDetails();
  const { isLoading: isGameResultsLoading } = useGameResults();
  const { isLoading: isPlayerLoading } = usePlayerDetails();
  const openResultMenu = () => setIsOpenResultMenu(true);
  const closeResultMenu = () => setIsOpenResultMenu(false);
  const { roundData } = useGame()
  useEffect(() => {
    preloadGameAssets(setProgress).then(() => {
      setIsAssetsLoading(false);
    });
  }, []);

  useEffect(() => {
    const start = async () => {
      try {
        const res = roundData;

        console.log("CREATE ROUND:", res);

        if (!res?.status) {
          setRoundId(0);
          return;
        }

        // ✅ new round started
        setRoundId(res.data.round_no);
      } catch (err) {
        console.error(err);
      }
    };
    start();
  }, [roundData]);


  const isLoading =
    isAssetsLoading ||
    isGameDetailsLoading ||
    isGameResultsLoading ||
    isPlayerLoading;

  if (isLoading) {
    const dataReadyCount = [
      !isGameDetailsLoading,
      !isGameResultsLoading,
      !isPlayerLoading,
    ].filter(Boolean).length;
    const dataProgress = Math.round((dataReadyCount / 3) * 100);
    const loadingProgress = Math.round((progress + dataProgress) / 2);
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    < div className=" relative flex min-h-[100dvh] w-full items-end justify-center overflow-hidden " >
      <MusicPlayer isMusicPlaying={isMusicPlaying} />
      <SoundPlayer isSoundPlaying={isSoundPlaying} isOpenResultMenu={isOpenResultMenu} />
      <LuckyFruitGame
        TodaysRoundId={roundId}
        onOpenResultMenu={openResultMenu}
        onCloseResultMenu={closeResultMenu}
        isMusicPlaying={isMusicPlaying}
        isSoundPlaying={isSoundPlaying}
        onToggleMusic={() => setIsMusicPlaying((prev) => !prev)}
        onToggleSound={() => setIsSoundPlaying((prev) => !prev)}
      />
    </div >
  );
}

export default App;
