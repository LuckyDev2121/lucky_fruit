import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

export default function LoadingScreen({ progress }: { progress: number }) {
    return (
        <div className="bg-[#A91FE6] h-svh w-full">
            <div className="absolute inset-0 z-[200] flex-col flex left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[200px] rounded-[40px] border-blue-950 items-center justify-center px-6">
                <div className="w-[100px] h-[100px] ">
                    <img src={getAssetUrl(GAME_ASSETS.gamelogo)} alt="Loading" />
                </div>
                <div className="h-[16px] w-full bg-gray-300/50 rounded-full">
                    <div
                        className="h-[16px] bg-gradient-to-t from-[#3d019e] to-[#8032fd] rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div >
    );
}
