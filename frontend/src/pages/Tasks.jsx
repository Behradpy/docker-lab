import { useEffect, useMemo, useState } from "react";
import { createTask, getTasks, toggleTaskDone } from "../api/client.js";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const nav = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") nav("/login", { replace: true });
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter((t) => (t.title || "").toLowerCase().includes(query));
  }, [q, tasks]);

  async function addTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setError("");
    try {
      const created = await createTask({ title: trimmed, due: due || null });
      setTasks((prev) => [created, ...prev]);
      setTitle("");
      setDue("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleDone(t) {
    setError("");
    try {
      const updated = await toggleTaskDone(t.id, !t.done);
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">Your tasks</h1>
          <p className="sub">These are tasks for your account.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="toolbar">
        <input
          className="input search"
          placeholder="Search tasks..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <form className="row" onSubmit={addTask}>
          <input
            className="input"
            style={{ width: 220 }}
            placeholder="New task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            style={{ width: 170 }}
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <button className="btn btnPrimary" type="submit">
            Add
          </button>
        </form>
      </div>

      {loading ? (
        <div className="helper" style={{ marginTop: 14 }}>Loading...</div>
      ) : (
        <div className="grid">
          {filtered.map((t) => (
            <div className="task" key={t.id}>
              <div className="taskTop">
                <div>
                  <div
                    className="taskTitle"
                    style={{ textDecoration: t.done ? "line-through" : "none" }}
                  >
                    {t.title}
                  </div>
                  <div className="meta">Due: {t.due || "No due date"}</div>
                </div>

                <span className={`badge ${t.done ? "badgeDone" : ""}`}>
                  {t.done ? "Done" : "Open"}
                </span>
              </div>

              <button className="btn" onClick={() => toggleDone(t)}>
                Toggle done
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

