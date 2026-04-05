import { useEffect, useRef } from "react";
import { getMusicUrl, GAME_MUSIC } from "../config/gameConfig";
type MusicPlayerProps = {
    isMusicPlaying: boolean;
}

type SoundPlayerProps = {
    isSoundPlaying: boolean;
}

function useAudioPlayback(
    audioRef: React.RefObject<HTMLAudioElement | null>,
    shouldPlay: boolean,
) {
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        if (shouldPlay) {
            void audio.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
            });
        } else {
            audio.pause();
        }
    }, [audioRef, shouldPlay]);

    useEffect(() => {
        if (!shouldPlay) return;

        const tryPlay = () => {
            const audio = audioRef.current;

            if (!audio) return;

            void audio.play().catch(() => {
                // Keep silent here. Some browsers may still reject until media is ready.
            });
        };

        window.addEventListener("pointerdown", tryPlay, { once: true });
        window.addEventListener("keydown", tryPlay, { once: true });

        return () => {
            window.removeEventListener("pointerdown", tryPlay);
            window.removeEventListener("keydown", tryPlay);
        };
    }, [audioRef, shouldPlay]);
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isMusicPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useAudioPlayback(audioRef, isMusicPlaying);

    return (
        <>
            <audio ref={audioRef} src={getMusicUrl(GAME_MUSIC.music)} loop preload="auto" />
        </>
    );
};

export const SoundPlayer: React.FC<SoundPlayerProps> = ({ isSoundPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useAudioPlayback(audioRef, isSoundPlaying);

    return (
        <>
            <audio ref={audioRef} src={getMusicUrl(GAME_MUSIC.sound)} loop preload="auto" />
        </>
    );
};
