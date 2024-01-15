import { Outlet } from "react-router-dom";
import sideImage from "../../public/assets/images/side-img.svg";

const AuthLayout = () => {
  return (
    <>
      <section className="flex flex-1 items-center justify-center py-16 my-16">
        <Outlet />
      </section>
      <img
        src={sideImage}
        alt="side-Image"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </>
  );
};

export default AuthLayout;
