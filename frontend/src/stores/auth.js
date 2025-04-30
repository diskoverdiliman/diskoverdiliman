import axios from 'axios';
import { defineStore } from 'pinia';

let refreshTimer = null; // Timer for silent refresh

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
        this.startSilentRefresh(); // Start the silent refresh timer
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
      this.stopSilentRefresh(); // Stop the silent refresh timer
    },
    refreshAccessToken() {
      return axios.post(`/token/refresh/`, {
        refresh: this.refreshToken,
      }).then(response => {
        this.setToken(response.data.access); // Update the access token
        this.startSilentRefresh(); // Restart the silent refresh timer
      }).catch(error => {
        console.error('Error refreshing token:', error);

        // Log out if the refresh token is invalid or the request fails
        if (error.response && error.response.status === 401) {
          console.warn('Refresh token is invalid or expired. Logging out...');
          this.logOut(); // Log the user out
        }

        throw error; // Rethrow the error to stop further retries
      });
    },
    startSilentRefresh() {
      // Clear any existing timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      // Set a timer to refresh the token 5 minutes before it expires
      const refreshInterval = 55 * 60 * 1000; // 55 minutes (assuming 1-hour token lifetime)
      refreshTimer = setTimeout(() => {
        this.refreshAccessToken().catch(() => {
          console.warn('Silent refresh failed. Logging out...');
          this.logOut();
        });
      }, refreshInterval);
    },
    stopSilentRefresh() {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.jwt
  }
});

// Add Axios interceptor to refresh token automatically
axios.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  const token = authStore.jwt;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    // Check if the error is due to an expired access token
    if (error.response && error.response.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true; // Prevent infinite retries

      try {
        await authStore.refreshAccessToken(); // Attempt to refresh the token
        error.config.headers.Authorization = `Bearer ${authStore.jwt}`; // Update the token in the request
        return axios(error.config); // Retry the original request
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        return Promise.reject(refreshError); // Reject the request if refreshing fails
      }
    }

    return Promise.reject(error);
  }
);