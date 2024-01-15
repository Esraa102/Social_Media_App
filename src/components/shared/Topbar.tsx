/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { UseAuthContext } from "@/context/AuthContext";
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
const Topbar = () => {
  const { user } = UseAuthContext();
  const { mutate: signOut, isSuccess } = useSignOutMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <div className="topbar">
      <Link to="/">
        <img
          src={"/public/assets/icons/favicon.ico"}
          alt="logo"
          className="sm:w-[40px] sm:h-[40px] w-[30px] h-[30px]"
        />
      </Link>
      <div className="flex items-center gap-5">
        <button onClick={() => signOut()}>
          <img
            src={"/public/assets/icons/logout.svg"}
            alt="logout icon"
            className="w-[25px] h-[25px]"
          />
        </button>
        <Link to={`/profile/${user.id}`}>
          <img
            src={user.imageUrl || "/public/assets/images/icons8-post-96.png"}
            alt="profile"
            className="rounded-full w-[40px] h-[40px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
