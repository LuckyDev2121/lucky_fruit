import LuckyFruitGame from "./components/LuckyFruitGame"
import MusicPlayer from "./components/GameMusic"
import { useState } from "react"
function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

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
