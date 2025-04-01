<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 login-bg" max-width="500">
      <v-card-text>
        <div v-if="!isLoggedIn" class="d-flex flex-column align-center">
          <h1 class="mb-4 font-weight-light">Log in to your superuser account</h1>
          <v-text-field
            v-model="username"
            label="Username"
            :error-messages="invalidLogInAttempt ? 'username does not match with password' : null"
            class="mb-4 w-100"
          />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :error-messages="invalidLogInAttempt ? 'password does not match with username' : null"
            class="mb-4 w-100"
          />
          <v-btn color="primary" @click="attemptLogIn" class="text-white">Log In</v-btn>
        </div>
        <div v-else class="d-flex flex-column align-center">
          <div class="mb-4">
            Currently logged in as 
            <span class="primary--text font-weight-bold">{{ loggedInUser }}</span>
          </div>
          <div class="mb-4">Logout?</div>
          <div class="d-flex">
            <v-btn color="blue" @click="logOut" class="text-white mr-2">Yes</v-btn>
            <v-btn color="red" @click="backPage" class="text-white">No</v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const attemptLogIn = async () => {
  try {
    await authStore.logIn({ username: username.value, password: password.value });
    // Redirect to the home page after successful login
    window.location.href = '/';
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const logOut = () => {
  authStore.logOut();
};

const backPage = () => {
  window.history.back();
};

const isLoggedIn = computed(() => authStore.isLoggedIn);
const invalidLogInAttempt = computed(() => authStore.invalidLogInAttempt);
const loggedInUser = computed(() => authStore.user);
</script>

<style scoped>
@import "@/assets/stylesheets/style.css";

* {
  font-family: roboto, sans-serif;
}

.login-bg {
  background-color: white !important;
}

.text-white {
  color: white !important;
}

/* .v-btn {
  background-color: blue !important;
} */

.v-btn:hover {
  filter: brightness(1.2);
}

.fill-height {
  height: calc(100vh - 64px); /* Adjust the height to fill the screen under the navbar */
}

.v-card-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
