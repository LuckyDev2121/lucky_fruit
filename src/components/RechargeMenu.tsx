type RechargeMenuProps = {
    onCloseRechargeModal: () => void;
};

export default function RechargeMenu({ onCloseRechargeModal }: RechargeMenuProps) {
    return (
        <div className="h-[146px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <span className="absolute flex left-[94px] top-[30px] text-[15px] font-bold">Are you want to Recharge now?</span>
            <div className="absolute top-[79px] h-fit w-full justify-center flex gap-[20px]">
                <button className="w-[157px] h-[31px] rounded-[6px] border-[1px] border-[#b87036] bg-gradient-to-t from-[#b87036] from-1% via-90% via-[#FDD03c] to-95% to-[#fdf3ba] text-[#A04800] font-bold [font-family:Poppins,sans-serif]"
                    onClick={() => console.log("Confirm clicked")}>
                    Confirm
                </button>
                <button className="w-[157px] h-[31px] rounded-[6px] border-[#891ac1] bg-gradient-to-t from-[#891ac1] from-1% via-90% via-[#d494f4] to-99% to-[#fdf3ba] text-[#27598e] font-bold [font-family:Poppins,sans-serif]"
                    onClick={onCloseRechargeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}
