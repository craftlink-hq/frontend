import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col bg-[url('/bg.png')] min-h-screen w-screen bg-opacity-20">
      <div className="flex flex-col z-20 bg-[#333333]  w-screen bg-opacity-[94%] h-full ">
        <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] ">
          <Header />
        </div>
        <div className="bg-[url('/gradient.png')] z-30 min-h-screen w-screen bg-contain bg-center pt-24 bg-repeat">
          <div className="h-full w-screen">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
