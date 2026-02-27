import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000"
});

API.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  if (role) {
    config.headers.role = role;
    config.headers["x-role"] = role;
  }
  if (userId) {
    config.headers.user_id = userId;
    config.headers["x-user-id"] = userId;
  }

  return config;
});

export default API;
