import { useEffect, useRef } from "react";
import { getMusicUrl, GAME_MUSIC } from "../config/gameConfig";
type MusicPlayerProps = {
    isMusicPlaying: boolean;
}

type SoundPlayerProps = {
    isSoundPlaying: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isMusicPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isMusicPlaying) {
            audioRef.current.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isMusicPlaying]);

    return (
        <>
            <audio ref={audioRef} src={getMusicUrl(GAME_MUSIC.music)} loop />
        </>
    );
};

export const SoundPlayer: React.FC<SoundPlayerProps> = ({ isSoundPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isSoundPlaying) {
            audioRef.current.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isSoundPlaying]);

    return (
        <>
            <audio ref={audioRef} src={getMusicUrl(GAME_MUSIC.sound)} loop />
        </>
    );
};
