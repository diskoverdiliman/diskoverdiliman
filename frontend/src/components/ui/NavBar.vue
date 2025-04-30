<template>
  <!-- Basic Navbar with important links -->
  <v-toolbar color="#7b1113" app id="nav-bar">
    <!-- Left Side -->
    <v-toolbar-items>
      <!-- Homepage link -->
      <v-btn to="/" class="text-white" flat>Diskover++</v-btn>
      <!-- Button for displaying GPS configuration modals -->
      <v-btn class="text-white" flat @click="openGpsModal">Configure GPS</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>

    <!-- Right Side -->
    <!-- Desktop Version -->
    <v-toolbar-items v-if="mdAndUp">
      <!-- Map link -->
      <v-btn to="/map" flat class="text-white" @click="showFullMap">
        <span class="text-white">MAP</span>
      </v-btn>
      <!-- FAQs link -->
      <v-btn to="/faq" flat class="text-white">
        <span class="text-white">HELP</span>
      </v-btn>
      <AdminDropdown/>
    </v-toolbar-items>

    <!-- Mobile Version -->
    <v-toolbar-items v-else>
      <v-menu
        attach="#nav-bar"
        bottom
        left
        offset-y
        min-width="300px"
        z-index="1003"
        :close-on-content-click="false"
      >
        <v-btn icon dark slot="activator" id="nav-dropdown-activator">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-list id="nav-dropdown">
          <!-- Map link -->
          <v-list-item to="/map" active-class="primary-text list-active">
              <v-list-item-title class="text-white" @click="showFullMap">MAP</v-list-item-title>
          </v-list-item>
          <!-- FAQs link -->
          <v-list-item to="/faq" active-class="primary-text list-active">
              <v-list-item-title class="text-white">HELP</v-list-item-title>
          </v-list-item>
          <AdminDropdown/>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useMapStore } from '@/stores/map'; // Import the map store
import AdminDropdown from '@/components/ui/AdminDropdown.vue';

const { mdAndUp } = useDisplay();
const authStore = useAuthStore();
const mapStore = useMapStore(); // Use the map store
const eventBus = inject('eventBus'); // Inject the eventBus

const isLoggedIn = computed(() => authStore.isLoggedIn);
const loggedInUser = computed(() => authStore.user);

const showFullMap = () => {
  mapStore.setSideDrawer(false); // Use mapStore to set side drawer
};

const openGpsModal = () => {
  console.log("Emitting open-gps-bottom-modal event"); // Add a console log to verify the event emission
  eventBus.emit("open-gps-bottom-modal");
};
</script>

<style scoped>
@import "@/assets/stylesheets/style.css";

* {
  font-family: roboto, sans-serif;
}

#nav-dropdown {
  background-color: var(--v-primary-base) !important;
  overflow: visible !important;
}

.list-active {
  color: white !important;
  background-color: var(--v-primary-lighten1) !important;
}

#nav-bar {
  z-index: 1001 !important;
  padding-left: 0px !important;
  background-color: #7b1113 !important; /* Set the background color to maroon */
}
</style>
