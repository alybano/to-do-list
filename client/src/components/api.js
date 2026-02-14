// client/src/api.js
import axios from "axios";

// Base URL from Vite env
const API_URL = import.meta.env.VITE_API_URL;

// Debug log to confirm what value is being used
console.log("API URL:", API_URL);

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ensures cookies (sessions) are sent
});
