import { GetAxiosTypes, PostAxiosTypes } from "shared/types/generic";
import axios, { AxiosRequestConfig } from "axios";

const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosServices.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject((error.response && error.response.data) || "Wrong Services")
);

export default axiosServices;

const options = {
  headers: {
    "content-type": "application/json",
  },
};

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });
  return res.data;
};

export const getAxios = async ({ url }: GetAxiosTypes) => {
  return axios.get<any>(url);
};

export const postAxios = async ({ url, values }: PostAxiosTypes) => {
  return axios.post(url, values, options);
};

export const putAxios = async ({ url, values }: PostAxiosTypes) => {
  return axios.put(url, values, options);
};
