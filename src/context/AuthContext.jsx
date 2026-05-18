import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
   try {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      return { ...savedUser, loginAt: Date.now() }; 
    }
    return null;
  } catch {
    return null;
  }
  }); 

  const register = async (name, email, password) => {
    const response = await API.post("/auth/register", { name, email, password });
    const registeredUser = response.data.user;

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };
  

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    
    const loggedInUser = {
      ...res.data.user,
      loginAt: Date.now(), 
    };
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  
  };

  return (
    <AuthContext.Provider value={{ user, register,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

