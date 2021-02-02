import axios from "axios";

export function loginUser(data) {
  const serverData = axios
    .post("/api/users/login", data)
    .then((response) => response.data);

  return {
    type: "LOGIN",
    payload: serverData,
  };
}

export function registerUser(data) {
  const serverData = axios
    .post("/api/users/register", data)
    .then((response) => response.data);

  return {
    type: "REGISTER",
    payload: serverData,
  };
}

export function auth() {
  const serverData = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return {
    type: "AUTH",
    payload: serverData,
  };
}
