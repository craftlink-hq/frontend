import { PortfolioProps } from "@/utils/profile";
import Image from "next/image";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import AnimatedDiv from "@/components/AnimatedDiv";
import EditPortfolio from "./EditModals/EditPortfolio";
import BottomSheetModal from "../BottomModal";

const Portfolio = ({ portfolio }: { portfolio: PortfolioProps[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioProps>();

  useEffect(() => {
    if (portfolioData) {
      portfolio.push(portfolioData);
      setPortfolioData(undefined);
    }
  }, [portfolio, portfolioData]);

  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-[#F2E8CF0A] rounded-lg h-full gap-y-8 max-w-full  flex-col">
      <div className="flex justify-between">
        <h3 className="text-2xl">Portfolio</h3>
        <div className=" flex items-center gap-x-2">
          <span className="relative h-[32px] w-[32px] rounded-full bg-[#262208]">
            <Image
              src={"/link.png"}
              alt="pen"
              fill
              className="object-contain p-2"
            />
          </span>
          <button
            className="hidden bg-[#262208] rounded-full md:flex  text-sm items-center px-[10px] py-[6px] gap-x-2"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add Portfolio{" "}
            <span className="bg-[#F2E8CF0A]  rounded-full w-[18px] h-[18px] text-lg flex justify-center items-center">
              +
            </span>{" "}
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="bg-[#262208]  rounded-full h-[32px] w-[32px] text-xl flex text-[#FCFBF7] md:hidden justify-center items-center"
          >
            +
          </button>{" "}
        </div>
      </div>
      <div className="min-w-screen flex overflow-x-scroll gap-x-4">
        {portfolio.length === 0 ? (
          <div>
            <h4 className="text-xl font-bold text-[#F9F1E2] mb-4">
              <span className="underline decoration-yellow decoration-2 underline-offset-4">
                No Portfolio Projects Yet
              </span>
            </h4>

            {/* Description */}
            <p className="text-[#B5B4AD] text-base leading-relaxed mb-8 max-w-md font-merriweather">
              Showcase your best work to attract potential clients. Your
              portfolio helps build trust and demonstrates your expertise.
            </p>

            {/* CTA Button */}
            <button className="bg-yellow text-[#1A1203] font-bold py-3 px-8 rounded uppercase text-sm hover:bg-yellow/90 transition-colors font-merriweather">
              CREATE PORTFOLIO
            </button>
          </div>
        ) : (
          portfolio.map((project) => (
            <div
              key={project.imgSrc[0]}
              className="bg-[#F2E8CF0A] rounded-lg flex-shrink-0 w-full md:w-[35%] h-[400px] flex flex-col items-start px-4 py-2 md:p-2 gap-y-4"
            >
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                <Image
                  src={project.imgSrc[0]}
                  alt="Project image"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
              <h3 className="font-bold text-lg md:text-xl px-2 text-[#F9F1E2]">
                {project.title}
              </h3>
              <p className="text-[#B5B4AD] px-2 text-sm line-clamp-2">
                {project.desc}
              </p>
              <div className="flex justify-between w-full  ">
                <div>
                  Duration:{" "}
                  <span className="font-bold">{project.duration}</span>
                </div>
                <div className="flex gap-x-2">
                  <span className="relative h-[32px] w-[32px] rounded-full bg-[#F2E8CF0A]">
                    <Image
                      src={"/trash.png"}
                      alt="pen"
                      fill
                      className="object-contain p-2"
                    />
                  </span>
                  <span className="relative h-[32px] w-[32px] rounded-full bg-[#F2E8CF0A]">
                    <Image
                      src={"/edit-2.png"}
                      alt="pen"
                      fill
                      className="object-contain p-2"
                    />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {isModalOpen && (
        <Modal
          closeFn={() => setIsModalOpen(false)}
          className="hidden md:flex"
        >
          <AnimatedDiv
            initialX="100%"
            animateX={0}
            exitX={"100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-screen md:w-[60vw] lg:w-[40vw] h-[90vh] rounded-xl p-2 md:p-4 relative  "
          >
            <div className="h-[90%] overflow-y-scroll">
              <EditPortfolio
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={setPortfolioData}
              />
            </div>
          </AnimatedDiv>
          <BottomSheetModal
            closeFn={() => setIsModalOpen(false)}
            className="md:hidden"
          >
            <EditPortfolio
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={setPortfolioData}
            />
          </BottomSheetModal>
        </Modal>
      )}
    </div>
  );
};

export default Portfolio;
