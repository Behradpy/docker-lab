import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, setSession } from "../api/client.js";

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await register(email, password);
      setSession(data);
      nav("/tasks", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h1 className="h1">Create your account</h1>
      <p className="sub">Sign up to start tracking tasks.</p>

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
          <button className="btn btnPrimary" type="submit">Create account</button>
          <Link className="btn" to="/login">Back to login</Link>
        </div>
      </form>
    </section>
  );
}

