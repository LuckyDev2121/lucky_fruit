import { motion } from "framer-motion";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";


const points = [
    { top: "125px", left: "90px" },
    { top: "125px", left: "185px" },
    { top: "125px", left: "280px" },
    { top: "220px", left: "280px" },
    { top: "315px", left: "280px" },
    { top: "315px", left: "185px" },
    { top: "315px", left: "90px" },
    { top: "220px", left: "90px" },
    { top: "125px", left: "90px" },
];

export default function MovingImage() {
    return (
        <motion.img
            src={getAssetUrl(GAME_ASSETS.hand)}
            className="w-16 h-16 absolute z-50"
            animate={{
                top: points.map(p => p.top),
                left: points.map(p => p.left),
            }}
            transition={{
                duration: 6,
                ease: "easeInOut",
                times: points.map((_, i) => i / (points.length - 1)),
                repeat: Infinity,
            }}
        />
    );
}