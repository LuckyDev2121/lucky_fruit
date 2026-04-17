import { useEffect, useRef, useState } from "react";
import { getMusicUrl, GAME_MUSIC } from "../config/gameConfig";

type MusicPlayerProps = {
    isMusicPlaying: boolean;
}

type SoundPlayerProps = {
    isSoundPlaying: boolean;
    isOpenResultMenu: boolean;
}

let hasInteracted = false;

function useInteractionVersion() {
    const [interactionVersion, setInteractionVersion] = useState(0);

    useEffect(() => {
        if (hasInteracted) {
            setInteractionVersion(1);
            return;
        }

        const markInteracted = () => {
            hasInteracted = true;
            setInteractionVersion((current) => current + 1);
        };

        window.addEventListener("pointerdown", markInteracted, { once: true });
        window.addEventListener("keydown", markInteracted, { once: true });

        return () => {
            window.removeEventListener("pointerdown", markInteracted);
            window.removeEventListener("keydown", markInteracted);
        };
    }, []);

    return interactionVersion;
}

function useAudioPlayback(
    audioRef: React.RefObject<HTMLAudioElement | null>,
    shouldPlay: boolean,
) {
    const interactionVersion = useInteractionVersion();

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
    }, [audioRef, interactionVersion, shouldPlay]);

    useEffect(() => {
        if (!shouldPlay) return;

        const tryPlay = () => {
            const audio = audioRef.current;

            if (!audio) return;

            void audio.play().catch(() => {
            });
        };

        window.addEventListener("pointerdown", tryPlay, { once: true });
        window.addEventListener("keydown", tryPlay, { once: true });

        return () => {
            window.removeEventListener("pointerdown", tryPlay);
            window.removeEventListener("keydown", tryPlay);
        };
    }, [audioRef, interactionVersion, shouldPlay]);
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

export const SoundPlayer: React.FC<SoundPlayerProps> = ({
    isSoundPlaying,
    isOpenResultMenu,
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const interactionVersion = useInteractionVersion();

    useEffect(() => {
        if (!isSoundPlaying) return;
        if (!isOpenResultMenu) return;

        const audio = audioRef.current;
        if (!audio) return;

        //  restart sound every time result opens
        audio.currentTime = 0;

        audio.play().catch((err) => {
            console.warn("Sound blocked:", err);
        });
    }, [interactionVersion, isOpenResultMenu, isSoundPlaying]);

    return (
        <audio
            ref={audioRef}
            src={getMusicUrl(GAME_MUSIC.sound)}
            preload="auto"
            playsInline
        />
    );
};
