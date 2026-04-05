import { useEffect, useState } from "react";

import { MusicPlayer, SoundPlayer } from "./components/GameMusic";
import LoadingScreen from "./components/LoadingScrean";
import LuckyFruitGame from "./components/LuckyFruitGame";
import { GAME_ASSETS, getAssetUrl } from "./config/gameConfig";

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
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    preloadGameAssets(setProgress).then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={progress} />;
  }
  return (
    <div className=" relative flex min-h-[100dvh] w-full items-end justify-center overflow-hidden ">
      <MusicPlayer isMusicPlaying={isMusicPlaying} />
      <SoundPlayer isSoundPlaying={isSoundPlaying} />
      <LuckyFruitGame
        isMusicPlaying={isMusicPlaying}
        isSoundPlaying={isSoundPlaying}
        onToggleMusic={() => setIsMusicPlaying((prev) => !prev)}
        onToggleSound={() => setIsSoundPlaying((prev) => !prev)}
      />

    </div>
  );
}

export default App;
