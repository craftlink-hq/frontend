import MarketplaceHeader from "./FilterHeader";

interface Header {
  isActive: (path: string) => boolean;
}

const MarketHeader = ({ isActive }: Header) => {

  return (
    <div className="relative bg-header">
      <div className="">
        <MarketplaceHeader isActive={isActive} />
      </div>
    </div>
  );
};

export default MarketHeader;