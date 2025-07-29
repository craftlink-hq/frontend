import MobileHeader from "../MobileHeader";
import MarketplaceHeader from "./FilterHeader";

interface Header {
  toggleFilter: () => void;
  isActive: (path: string) => boolean;
}

const MarketHeader = ({ toggleFilter, isActive }: Header) => {

  return (
    <div className="relative bg-header">
      <div className="">
        <MarketplaceHeader isActive={isActive} />
      </div>
    </div>
  );
};

export default MarketHeader;