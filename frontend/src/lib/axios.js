import axios from "axios";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
