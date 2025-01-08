import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { encryptData, decryptData } from "../shared/services/encryption";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor to encrypt data before sending
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const internalConfig = config as InternalAxiosRequestConfig<any>;
  if (internalConfig.data) {
    // Encrypt the request data
    internalConfig.data = encryptData(internalConfig.data);
  }
  return internalConfig;
});

// Response interceptor to decrypt received data
api.interceptors.response.use((response: AxiosResponse) => {
  if (response.data) {
    // Decrypt the response data
    response.data = decryptData(response.data);
  }
  return response;
});

export default api;
