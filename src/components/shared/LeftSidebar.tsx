/* eslint-disable react-hooks/exhaustive-deps */
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { sidebarLinks } from "@/constants";
import { UseAuthContext } from "@/context/AuthContext";
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import logo from "../../../public/assets/images/logo.svg";
import logout from "../../../public/assets/icons/logout.svg";
import profile from "../../../public/assets/images/icons8-test-account-96.png";
import { INavLink } from "@/types";
const LeftSidebar = () => {
  const { user } = UseAuthContext();
  const { mutate: signOut, isSuccess } = useSignOutMutation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className="leftsidebar overflow-y-hidden hover:overflow-y-auto">
      <Link to="/" className="mb-10">
        <img src={logo} alt="logo" />
      </Link>
      <Link
        to={`/profile/${user.id}`}
        className="mb-10 flex gap-4 items-center"
      >
        <img
          src={user.imageUrl || profile}
          alt="profile"
          className="w-[70px] h-[70px] rounded-full"
        />
        <div>
          <p className="text-xl capitalize font-bold">
            {user.name || "User Account"}
          </p>
          <p className="text-sm text-light-3">@{user.username || "username"}</p>
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-1">
        <ul>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={`side-link-${link.label}`}
                className={`leftsidebar-link  group ${
                  isActive && "bg-primary-600"
                }`}
              >
                <NavLink to={link.route} className={"flex items-center gap-4"}>
                  <img
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                    src={link.imgURL}
                    alt={link.label}
                  />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => signOut()}
          className="shad-button_ghost mb-4 font-semibold"
        >
          <img src={logout} alt="logout" />
          <span className="hover:text-primary-600 transition">Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
