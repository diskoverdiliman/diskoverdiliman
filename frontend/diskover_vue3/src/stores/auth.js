import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: localStorage.getItem('jwt'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: JSON.parse(localStorage.getItem('user')),
    invalidLogInAttempt: false,
  }),
  actions: {
    setToken(newToken) {
      localStorage.setItem('jwt', newToken);
      this.jwt = newToken;
    },
    setRefreshToken(newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
      this.refreshToken = newRefreshToken;
    },
    deleteToken() {
      localStorage.removeItem('jwt');
      this.jwt = null;
    },
    deleteRefreshToken() {
      localStorage.removeItem('refreshToken');
      this.refreshToken = null;
    },
    setUser(newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      this.user = newUser;
    },
    deleteUser() {
      localStorage.removeItem('user');
      this.user = null;
    },
    setInvalidLogInAttempt(newInvalid) {
      this.invalidLogInAttempt = newInvalid;
    },
    verifyToken() {
      return new Promise((resolve) => {
        if (this.jwt) {
          console.log('Token is valid:', this.jwt);
          resolve();
        } else {
          console.warn('No token found, proceeding as guest.');
          this.deleteToken();
          this.deleteUser();
          resolve();
        }
      });
    },
    logIn({ username, password }) {
      console.log("Axios Base URL:", axios.defaults.baseURL);
      return axios.post(`/token/`, {
        username: username,
        password: password,
      }).then(response => {
        this.setToken(response.data.access); // Save the access token
        this.setRefreshToken(response.data.refresh); // Save the refresh token
        this.setUser({ name: username }); // Update the user state with the username
        console.log("User set in authStore:", this.user); // Debugging
        this.invalidLogInAttempt = false;
        console.log("Successfully authenticated token: You are now logged in\n", response);
      }).catch(error => {
        console.log("Invalid username and password for authentication, you remain logged out\n", error);
        this.invalidLogInAttempt = true;
        throw error;
      });
    },
    logOut() {
      this.deleteToken();
      this.deleteRefreshToken();
      this.deleteUser();
      console.log("Successfully deleted token: You are now logged out\n");
    },
    refreshAccessToken() {
      if (!this.refreshToken) {
        console.warn("No refresh token available. User is logged out.");
        return Promise.reject("No refresh token available.");
      }

      console.log("Refreshing token...");
      return axios.post(`/token/refresh/`, {
        refresh: this.refreshToken,
      }).then(response => {
        this.setToken(response.data.access); // Update the access token
        console.log("Access token refreshed successfully.");
      }).catch(error => {
        console.error("Error refreshing token:", error.response?.data || error.message);
        this.logOut(); // Log out if the refresh token is invalid
        throw error; // Rethrow the error to handle it in the interceptor
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.jwt
  }
});

// Add Axios interceptor to refresh token automatically
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  // Skip adding Authorization header for public endpoints
  const publicEndpoints = ['/categories', '/tags'];
  if (publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    return config; // Allow the request to proceed without a token
  }

  if (!authStore.jwt) {
    console.warn("No access token available. Request will not be sent.");
    return Promise.reject("No access token available.");
  }

  config.headers.Authorization = `Bearer ${authStore.jwt}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401 && authStore.refreshToken) {
      console.warn("401 Unauthorized detected. Attempting to refresh token...");
      try {
        await authStore.refreshAccessToken(); // Refresh the token
        console.log("Retrying original request with new token...");
        error.config.headers.Authorization = `Bearer ${authStore.jwt}`; // Update the token
        return axios(error.config); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out user.");
        return Promise.reject(refreshError); // Reject if refresh fails
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);