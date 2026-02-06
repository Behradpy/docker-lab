import { getToken, clearSession } from "./api/client.js";

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  clearSession();
}

