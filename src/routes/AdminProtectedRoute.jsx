import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function  AdminProtectedRoute({children}){
  const {user}=useAuth()

  if(!user) return <Navigate to="/login"/>
  if(user.role!=="admin") return <Navigate to="/" replace/>

  return children

}