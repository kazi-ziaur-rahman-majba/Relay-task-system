import { axiosInstance } from "../axios-instance";

const authUtils = {
    getAccessToken: () => {
        try {
            return localStorage.getItem("accessToken") || "";
        } catch {
            return "";
        }
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authUtils.getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["ngrok-skip-browser-warning"] = "true";
        }

        return config;
    },
    (error) => Promise.reject(error)
);
