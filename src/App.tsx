import LuckyFruitGame from "./components/LuckyFruitGame"
import MusicPlayer from "./components/GameMusic"
import { useState } from "react"
function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  return (
    <div className=" relative mr-auto flex content-center justify-center h-full w-full ">
      <MusicPlayer isMusicPlaying={isMusicPlaying} />
      <LuckyFruitGame
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={() => setIsMusicPlaying(prev => !prev)}
      />
    </div>
  )
}

export default App
