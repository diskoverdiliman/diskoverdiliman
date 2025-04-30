import axios from "axios";
import { useAuthStore } from "@/stores/auth";

axios.defaults.baseURL = process.env.VITE_APP_API_URL;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    // Check if the error has a response object
    if (error.response) {
      if (error.response.status === 401 && authStore.refreshToken) {
        try {
          // Attempt to refresh the token
          await authStore.refreshAccessToken();

          // Retry the original request with the new token
          error.config.headers.Authorization = `Bearer ${authStore.jwt}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // If refreshing fails, log out and reject the original error
          authStore.logOut();
          return Promise.reject(error);
        }
      }
    } else {
      console.error('Network or CORS error occurred:', error);
    }

    return Promise.reject(error); // Reject the error if it's not a 401 or refresh fails
  }
);

export default {
  install: (app) => {
    app.config.globalProperties.$http = axios;
  },
};
