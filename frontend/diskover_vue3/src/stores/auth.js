import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: localStorage.getItem('jwt'),
    user: JSON.parse(localStorage.getItem('user')),
    invalidLogInAttempt: false
  }),
  actions: {
    setToken(newToken) {
      localStorage.setItem('jwt', newToken);
      this.jwt = newToken;
    },
    deleteToken() {
      localStorage.removeItem('jwt');
      this.jwt = null;
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
        password: password
      }).then(response => {
        this.setToken(response.data.access); // Save the JWT token
        this.setUser(username); // Update the user state
        this.setInvalidLogInAttempt(false);
        console.log("Successfully authenticated token: You are now logged in\n", response);
      }).catch(error => {
        console.log("Invalid username and password for authentication, you remain logged out\n", error);
        this.setInvalidLogInAttempt(true);
        throw error; // Rethrow the error to handle it in the calling component
      });
    },
    logOut() {
      this.deleteToken(); // Clear the JWT token
      this.deleteUser();  // Clear the user data
      console.log("Successfully deleted token: You are now logged out\n");
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.jwt
  }
});