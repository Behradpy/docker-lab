const TOKEN_KEY = "taskstore_token";
const USER_KEY = "taskstore_user";

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // اگر بک‌اند 401 داد یعنی توکن معتبر نیست
  if (res.status === 401) {
    clearSession();
    throw new Error("UNAUTHORIZED");
  }

  // سعی می‌کنیم json بخونیم (اگر نباشه، متن می‌گیریم)
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// -------- Auth --------
export async function register(email, password) {
  // مطابق curl شما: POST /auth/register
  return request("/auth/register", { method: "POST", body: { email, password } });
}

export async function login(email, password) {
  // اگر بک‌اندت مسیرش فرق داشت اینجا عوضش کن
  return request("/auth/login", { method: "POST", body: { email, password } });
}

// -------- Tasks --------
// این‌ها فرض رایج هستند. اگر endpoint ها فرق داشتند، فقط همینجا اصلاح کن.
export async function getTasks() {
  return request("/tasks");
}

export async function createTask({ title, due }) {
  return request("/tasks", { method: "POST", body: { title, due } });
}

export async function toggleTaskDone(id, done) {
  return request(`/tasks/${id}`, { method: "PATCH", body: { done } });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}

