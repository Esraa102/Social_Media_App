import { bottombarLinks } from "@/constants";

import { NavLink, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <div className="bottom-bar">
      <ul className="flex items-center justify-between gap-1">
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={`bottom-link-${link.label}`}
              className={` text-sm md:text-[16px]
            p-2 hover:bg-primary-600 transition rounded-md w-[80px] group ${
              isActive && "bg-primary-600"
            }`}
            >
              <NavLink
                to={link.route}
                className={"flex flex-col gap-1 items-center"}
              >
                <img
                  className={`group-hover:invert-white ${
                    isActive && "invert-white w-[20px] sm:w-[30px]"
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
    </div>
  );
};

export default BottomBar;
