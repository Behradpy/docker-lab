import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, setSession } from "../api/client.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      setSession(data);
      nav("/tasks", { replace: true });
    } catch (err) {
      setError(err.message === "UNAUTHORIZED" ? "Please login again." : err.message);
    }
  }

  return (
    <section className="card">
      <h1 className="h1">Welcome back</h1>
      <p className="sub">Login to manage your tasks.</p>

      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Email
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <div className="alert">{error}</div>}

        <div className="row" style={{ marginTop: 6 }}>
          <button className="btn btnPrimary" type="submit">Sign in</button>
          <Link className="btn" to="/signup">Create account</Link>
        </div>
      </form>
    </section>
  );
}

