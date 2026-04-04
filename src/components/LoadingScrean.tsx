export default function LoadingScreen({ progress }: { progress: number }) {
    return (
        <div className="bg-[#A91FE6] h-svh w-full">
            <div className="absolute inset-0 z-[200] flex-col flex left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[70%] rounded-[40px] border-blue-950 items-center justify-center bg-[#210131]/40 px-6">
                <div className="text-[50px] font-bold text-white/70">Loading... {progress}%</div>
                <div className="h-3 w-full bg-gray-300 rounded">
                    <div
                        className="h-3 bg-green-500 rounded"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div >
    );
}
