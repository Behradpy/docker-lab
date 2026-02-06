import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Tasks from "./pages/Tasks.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import { isLoggedIn, logout } from "./auth.js";

export default function App() {
  const logged = isLoggedIn();

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <span>✅ TaskStore</span>
          <span className="pill">web-based task manager</span>
        </div>

        <nav className="nav">
          {!logged ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/tasks">Tasks</Link>
              <button
                className="btn btnDanger"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to={logged ? "/tasks" : "/login"} replace />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

