import { useEffect, useRef, useState } from "react";
import { getGameMusic, type MusicResponse } from "../api/gameMusicApi";

type MusicPlayerProps = {
    isMusicPlaying: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isMusicPlaying }) => {
    const [data, setData] = useState<MusicResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const res = await getGameMusic();
                setData(res);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchMusic();
    }, []);


    const musicUrl = data?.music
        ? `https://Funint.site${data.music}`
        : null;

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
            {/* hidden audio element */}
            {musicUrl && (
                <audio ref={audioRef} src={musicUrl} loop />
            )}

            {/* optional error display */}
            {error && (
                <p className="absolute bottom-2 left-2 text-red-500 text-xs">
                    {error}
                </p>
            )}
        </>
    );
};

export default MusicPlayer;