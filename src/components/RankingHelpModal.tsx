type RankingHelpModalProps = {
    onCloseRankingHelpModal: () => void;
};

export default function RankingHelpModal({
    onCloseRankingHelpModal,
}: RankingHelpModalProps) {
    return (
        <div className="relative h-[120px] w-[300px] bg-slate-800 rounded-[20px]">
            <span className="absolute w-[200px] top-[23px] text-center text-[15px] text-white left-1/2 -translate-x-1/2 font-bold">
                Ranked by diamonds spent
            </span>
            <button
                className="absolute w-[191px] h-[30px]  top-[65px] left-1/2  transform -translate-x-1/2 text-white border-[1px] border-[#6D1F92] bg-gradient-to-t from-[#6D1F92] to-[#B935F8] font-bold rounded-full"
                onClick={onCloseRankingHelpModal}
            >
                Confirm
            </button>
        </div>
    )
}
