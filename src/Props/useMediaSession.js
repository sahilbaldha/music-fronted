import { useEffect, useContext } from "react";
import { Context } from "../store/FlowContext";

export function useMediaSession() {
    const { audioRef, handleNext, handlePrev, fottersong } = useContext(Context);

    useEffect(() => {
        const el = audioRef?.current;

        if (!("mediaSession" in navigator) || !fottersong || !el) return;

        const validImage = fottersong.song_image?.startsWith("http") || fottersong.song_image?.startsWith("/");

        const artwork = validImage
            ? [
                { src: fottersong.song_image, sizes: "96x96", type: "image/png" },
                { src: fottersong.song_image, sizes: "128x128", type: "image/png" },
                { src: fottersong.song_image, sizes: "256x256", type: "image/png" },
                { src: fottersong.song_image, sizes: "512x512", type: "image/png" },
            ]
            : [
                {
                    src: "/dholida.png",
                    sizes: "512x512",
                    type: "image/png",
                },
            ];

        navigator.mediaSession.metadata = new MediaMetadata({
            title: fottersong.song_title || "Unknown Title",
            artist: fottersong.singer || "Unknown Artist",
            artwork,
        });

        navigator.mediaSession.playbackState = el.paused ? "paused" : "playing";

        navigator.mediaSession.setActionHandler("play", async () => {
            if (el.readyState >= 2) {
                try {
                    await el.play();
                } catch (err) {
                    console.error("Play failed:", err);
                }
            }
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            el.pause();
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            if (handlePrev) handlePrev();
        });

        navigator.mediaSession.setActionHandler("nexttrack", () => {
            if (handleNext) handleNext();
        });

        if (el.readyState >= 1 && !isNaN(el.duration)) {
            navigator.mediaSession.setPositionState({
                duration: el.duration,
                position: el.currentTime,
                playbackRate: el.playbackRate,
            });
        }
    }, [fottersong, audioRef, handlePrev, handleNext]);
}
