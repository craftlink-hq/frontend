import Image from "next/image";

const TokenBalance = () => {
  return (
    <div className="space-y-2">
      {/* Token Balance Card */}
      <div className="bg-[#F2E8CF0A] rounded-xl p-4 border border-[#FCFBF726] text-[#F9F1E2] font-merriweather">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-[#D8D6CF] mb-1">Token Balance</h3>
            <p className="text-xs text-[#B5B4AD]">
              Your earnings, withdraw when you&apos;re ready.
            </p>
          </div>

        </div>

        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-yellow mb-1">
              1000 <span className="text-sm font-normal">USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Craftcoin Balance Card */}
      <div className="bg-[#F2E8CF0A] rounded-xl p-6 border border-[#FCFBF726] text-[#F9F1E2] font-merriweather">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm text-[#D8D6CF]">Craftcoin Balance</h3>
          <button className="text-[#D8D6CF] hover:text-[#F9F1E2]">
            <Image src="/info.png" alt="info" width={16} height={16} />
          </button>
        </div>
        <p className="text-xs text-[#B5B4AD] mb-4">
          Spend your CraftCoin to boost your profile to clients
        </p>

        <div className="border-t border-[#FCFBF726] pt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-[#D8D6CF]">Available</span>
          </div>
          <div className="text-xl font-bold text-yellow mb-4">
            500 <span className="text-sm font-normal">CFT</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <button className="bg-yellow text-[#1A1203] font-bold px-4 py-2 rounded-md text-sm uppercase hover:bg-yellow/90 transition-colors">
            Claim CraftCoin
          </button>
          <button className="bg-[#262208] text-[#FCF8E3] font-bold px-4 py-2 rounded-md text-sm uppercase hover:bg-[#262208]/80 transition-colors">
            Buy CraftCoin
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenBalance;
