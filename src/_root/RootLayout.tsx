import BottomBar from "@/components/shared/BottomBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <section className="w-full h-screen overflow-hidden md:flex">
      <Topbar />
      <LeftSidebar />
      <div className="pb-40 md:pb-0 overflow-auto  flex-1 h-full">
        <Outlet />
      </div>
      <BottomBar />
    </section>
  );
};

export default RootLayout;
