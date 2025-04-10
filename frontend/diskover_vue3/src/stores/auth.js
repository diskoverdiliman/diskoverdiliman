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
      return axios.post(`/token/refresh/`, {
        refresh: this.refreshToken,
      }).then(response => {
        this.setToken(response.data.access); // Update the access token
      }).catch(error => {
        console.error('Error refreshing token:', error);
        this.logOut(); // Log out if the refresh token is invalid
      });
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
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (error.response.status === 401 && authStore.refreshToken) {
      // Attempt to refresh the token
      await authStore.refreshAccessToken();

      // Retry the original request with the new token
      error.config.headers.Authorization = `Bearer ${authStore.jwt}`;
      return axios(error.config);
    }

    return Promise.reject(error);
  }
);