import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth.js";

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}

