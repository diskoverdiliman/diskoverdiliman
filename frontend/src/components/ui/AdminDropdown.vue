<template>
  <!-- DESKTOP VERSIONS -->
  <v-menu
    v-if="isLoggedIn && mdAndUp"
    v-model="menuVisible"
    attach="#nav-bar"
    bottom
    left
    offset-y
    min-width="300px"
    z-index="1005"
  >
    <template v-slot:activator="{ props }">
      <v-btn flat class="text-white" v-bind="props">
        <span>Logged in as {{ loggedInUser.name }}</span>
      </v-btn>
    </template>
    <v-list id="nav-admin-dropdown">
      <!-- create location link -->
      <v-list-item :to="{name: 'location_crud_form', params: {mode: 'create'}}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Create new location</v-list-item-title>
      </v-list-item>
      <!-- upload images link -->
      <v-list-item :to="{name: 'upload_images_form'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Upload new images</v-list-item-title>
      </v-list-item>
      <!-- delete images link -->
      <v-list-item :to="{name: 'delete_images_form'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Delete images</v-list-item-title>
      </v-list-item>
      <!-- browse categories link -->
      <v-list-item :to="{name: 'categorytable'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Browse categories</v-list-item-title>
      </v-list-item>
      <!-- browse tags link -->
      <v-list-item :to="{name: 'tagtable'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Browse tags</v-list-item-title>
      </v-list-item>
      <!-- Log out link -->
      <v-list-item @click="logout" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-menu
    v-else-if="!isLoggedIn && mdAndUp"
    v-model="menuVisible"
    attach="#nav-bar"
    bottom
    left
    offset-y
    min-width="300px"
    z-index="1005"
  >
    <template v-slot:activator="{ props }">
      <v-btn flat class="text-white" v-bind="props">
        <span>Anonymous User</span>
      </v-btn>
    </template>
    <v-list id="nav-admin-dropdown">
      <!-- Log in link -->
      <v-list-item :to="{name: 'login'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Log in</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- MOBILE VERSIONS -->
  <v-menu
    v-else-if="isLoggedIn && !mdAndUp"
    v-model="menuVisible"
    attach="#nav-bar"
    min-width="300px"
    offset-x
    right
    z-index="1005"
  >
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" active-class="primary-text list-active" id="nav-admin-button">
        <v-list-item-title class="text-white">
          <span>Logged in as {{ loggedInUser.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-list id="nav-admin-dropdown">
      <!-- create location link -->
      <v-list-item :to="{name: 'location_crud_form', params: {mode: 'create'}}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Create new location</v-list-item-title>
      </v-list-item>
      <!-- upload images link -->
      <v-list-item :to="{name: 'upload_images_form'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Upload new images</v-list-item-title>
      </v-list-item>
      <!-- delete images link -->
      <v-list-item :to="{name: 'delete_images_form'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Delete images</v-list-item-title>
      </v-list-item>
      <!-- browse categories link -->
      <v-list-item :to="{name: 'categorytable'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Browse categories</v-list-item-title>
      </v-list-item>
      <!-- browse tags link -->
      <v-list-item :to="{name: 'tagtable'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Browse tags</v-list-item-title>
      </v-list-item>
      <!-- Log out link -->
      <v-list-item @click="logout" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Log out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-menu
    v-else
    v-model="menuVisible"
    attach="#nav-bar"
    offset-x
    right
    min-width="300px"
    z-index="1005"
  >
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" active-class="primary-text list-active">
        <v-list-item-title class="text-white">
          <span>Anonymous User</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-list id="nav-admin-dropdown">
      <!-- Log in link -->
      <v-list-item :to="{name: 'login'}" active-class="primary-text list-active">
        <v-list-item-title class="text-white">Log in</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';

const { mdAndUp } = useDisplay();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const loggedInUser = computed(() => authStore.user);
const menuVisible = ref(false);

const logout = () => {
  authStore.logOut(); // Call the logOut action from the auth store
  window.location.href = '/login'; // Redirect to the login page (optional)
};
</script>

<style scoped>
@import "@/assets/stylesheets/style.css";

* {
  font-family: roboto, sans-serif;
}

#nav-admin-dropdown {
  background-color: #7b1113 !important;
  overflow: visible !important;
}

.v-list-item {
  background-color: #7b1113 !important;
}

.v-list-item:hover {
  background-color: var(--v-primary-lighten1) !important;
}

.list-active {
  color: white !important;
  background-color: var(--v-primary-lighten1) !important;
}

.text-white {
  color: white !important;
}
</style>