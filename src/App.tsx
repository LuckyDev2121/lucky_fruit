import LuckyFruitGame from "./components/LuckyFruitGame"
import MusicPlayer from "./components/GameMusic"
import { useState, useEffect } from "react"
import LoadingScreen from "./components/LoadingScrean"

async function preloadGameAssets(setProgress: (value: number) => void) {
  const assets = [
    "/src/assets/PlayBoard/playboard.svg",
    "/src/assets/PlayBoard/fruitboard.svg",
    "/src/assets/fruits/cherry.svg",
    "/src/assets/fruits/grapes.svg",
  ];

  let loaded = 0;

  await Promise.all(
    assets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => {
            loaded++;
            setProgress(Math.round((loaded / assets.length) * 100));
            resolve();
          };
        })
    )
  );
}

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
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
      <LuckyFruitGame
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={() => setIsMusicPlaying(prev => !prev)}
      />
    </div>
  )
}

export default App
