/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, createContext, useEffect } from "react";
import { IContextType, IUser } from "@/types";
import { getCurrentAccount } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";

const INITAIL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};
const INITAIL_STATE = {
  user: INITAIL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};
const authContext = createContext<IContextType>(INITAIL_STATE);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser>(INITAIL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error Comes From checkAuthUser()", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    ) {
      navigate("/sign-in");
    }
    checkAuthUser();
  }, []);
  return (
    <authContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsAuthenticated,
        isAuthenticated,
        checkAuthUser,
      }}
    >
      {isLoading ? <Loader miniLoader={false} /> : children}
    </authContext.Provider>
  );
};

export const UseAuthContext = () => useContext(authContext);
