import { useCallback, useEffect, useState } from "react";

import { MusicPlayer, SoundPlayer } from "./components/GameMusic";
import LoadingScreen from "./components/LoadingScrean";
import LuckyFruitGame from "./components/LuckyFruitGame";
import { GAME_ASSETS, getAssetUrl } from "./config/gameConfig";
import {
  fetchGameDetail,
  fetchGameResults,
  fetchPlayerInfo,
  fetchSoundSetting,
} from "./api/api";
import { useGame } from "./hooks/useGameHook";

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = img.onerror = () => resolve();
  });
}

async function preloadGameAssets(setProgress: (value: number) => void) {
  const logoSrc = getAssetUrl(GAME_ASSETS.gamelogo);
  await preloadImage(logoSrc);
  setProgress(20);

  const assets = Object.values(GAME_ASSETS)
    .filter((fileName) => fileName !== GAME_ASSETS.gamelogo)
    .map((fileName) => getAssetUrl(fileName));

  if (assets.length === 0) {
    setProgress(100);
    return;
  }

  let loaded = 0;

  await Promise.all(
    assets.map(
      (src) =>
        new Promise<void>((resolve) => {
          preloadImage(src).then(() => {
            loaded += 1;
            setProgress(20 + Math.round((loaded / assets.length) * 80));
            resolve();
          });
        }),
    ),
  );
}

function App() {
  const [isSoundPlaying, setIsSoundPlaying] = useState(true);
  const [isOpenResultMenu, setIsOpenResultMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [roundId, setRoundId] = useState<number | null>(null);
  const [isRoundRunning, setIsRoundRunning] = useState(false);
  const openResultMenu = () => setIsOpenResultMenu(true);
  const closeResultMenu = () => setIsOpenResultMenu(false);
  const { createRound, isMusicEnabled, setMusicEnabled, makeGameResult } = useGame();

  const attemptStartRound = useCallback(async () => {
    try {
      const res = await createRound();

      // console.log("CREATE ROUND:", res);

      if (!res?.status || !res.data) {
        return false;
      }

      setRoundId(res.data.round_no);
      setIsRoundRunning(true);
      makeGameResult();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [createRound]);

  const handleRoundFinished = useCallback(() => {
    setRoundId(null);
    console.log("====================round Id");
    setIsRoundRunning(false);
    void attemptStartRound();
  }, [attemptStartRound]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        await preloadGameAssets(setProgress);
        if (cancelled) {
          return;
        }

        setProgress(85);

        const [, , , , res] = await Promise.all([
          fetchGameDetail(),
          fetchPlayerInfo(),
          fetchGameResults(),
          fetchSoundSetting(),
          createRound(),
        ]);
        if (cancelled) {
          return;
        }

        // console.log("CREATE ROUND:", res);

        if (!res?.status || !res.data) {
          setRoundId(null);
          setIsRoundRunning(false);
        } else {
          setRoundId(res.data.round_no);
          setIsRoundRunning(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setProgress(100);
          setIsBootLoading(false);
          makeGameResult()
          console.log("===================makeGameResult");
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [createRound]);

  useEffect(() => {
    if (isBootLoading || isRoundRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      void attemptStartRound();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attemptStartRound, isBootLoading, isRoundRunning]);

  if (isBootLoading) {

    return <LoadingScreen progress={progress} />;
  }

  return (
    <div className="relative flex min-h-[100dvh] w-full items-end justify-center overflow-hidden">
      <MusicPlayer isMusicPlaying={isMusicEnabled} />
      <SoundPlayer
        isSoundPlaying={isSoundPlaying}
        isOpenResultMenu={isOpenResultMenu}
      />
      <LuckyFruitGame
        TodaysRoundId={roundId}
        isRoundRunning={isRoundRunning}
        onRoundFinished={handleRoundFinished}
        onOpenResultMenu={openResultMenu}
        onCloseResultMenu={closeResultMenu}
        isMusicPlaying={isMusicEnabled}
        isSoundPlaying={isSoundPlaying}
        onToggleMusic={() => {
          void setMusicEnabled(!isMusicEnabled);
        }}
        onToggleSound={() => setIsSoundPlaying((prev) => !prev)}
      />
    </div>
  );
}

export default App;
