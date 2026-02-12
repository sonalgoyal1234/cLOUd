import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");

  if (user?._id) {
    config.headers["x-user-id"] = user._id;
  }

  return config;
});

export default api;
