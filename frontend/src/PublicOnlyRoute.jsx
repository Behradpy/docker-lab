import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth.js";

export default function PublicOnlyRoute({ children }) {
  if (isLoggedIn()) return <Navigate to="/tasks" replace />;
  return children;
}

