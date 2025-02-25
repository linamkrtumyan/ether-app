import { FC } from "react";
import { Background, Footer, WalletInfo } from "../components";

const Layout: FC = () => {
  return (
    <div className="relative w-full h-screen">
      <Background />
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black bg-opacity-40 shadow-lg rounded-lg">
        <WalletInfo />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
