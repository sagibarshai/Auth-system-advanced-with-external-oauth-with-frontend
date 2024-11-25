import axios from "axios";
import { config } from "../../config";

export const backendAxiosInstance = axios.create({
  baseURL: config.BACKEND.BASE_URL,
  withCredentials: true,
});
