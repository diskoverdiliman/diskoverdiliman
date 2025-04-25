<template>
  <!-- Homepage of diskover shown at default https://diskover.up.edu.ph -->
  <div class="homepage-container">
    <!-- BIG Homepage photo with parallax effects -->
    <v-parallax :src="bgImage" height="100vh" class="bg-image"></v-parallax>

    <!-- Content overlay -->
    <div class="content-overlay">
      <!-- Title Section -->
      <v-container class="pa-0 mt-10">
        <v-row align="center" justify="center" class="column">
          <v-col cols="12" class="text-center">
            <h1 class="display-3 font-weight-light mb-3 diskover-title text-white">DISKOVER ++</h1>
            <p class="caption text-white">
              Diskover++ is a project from students of the Department of Computer Science in UP Diliman. <br />
              Please help us by reporting broken links or providing comments and suggestions through this form. We need your feedback to help us improve the site.
            </p>
          </v-col>
        </v-row>

      </v-container>

      <!-- Quick Home page links and widgets -->
      <v-container fluid>
        <v-card class="pull-up full-width mt-10" color="rgba(123, 17, 19, 0.5)">
          <div class="text-center pt-4">
            <h1 class="display-1 text-white">Where would you like to go?</h1>
          </div>
          <v-container fluid>
            <v-row v-bind="homeLayout" fill-height>
              <!-- Search widget -->
              <v-col cols="12" md="4">
                <InfoCard>
                  <template #title color="#7b1113">
                    <h2 class="title text-white">Use our search bar</h2>
                  </template>
                  <template #content>
                    <SearchBar />
                  </template>
                </InfoCard>
              </v-col>
              <!-- Map widget -->
              <v-col cols="12" md="4">
                <router-link to="/map" class="no-underline">
                  <InfoCard ripple>
                    <template #title>
                      <h2 class="title text-white">Use the map</h2>
                    </template>
                    <template #content>
                      <v-img
                        :src="miniMapImage"
                        height="200px"
                        class="full-width"
                        cover
                      />
                    </template>
                  </InfoCard>
                </router-link>
              </v-col>
              <!-- Category Cards widget -->
              <v-col cols="12" md="4">
                <InfoCard>
                  <template #title>
                    <h2 class="title text-white">Select a category</h2>
                  </template>
                  <template #content>
                    <v-row wrap class="pa-3">
                      <v-col
                        v-for="(item, i) in categories"
                        :key="i"
                        cols="6"
                        sm="4"
                        md="6"
                      >
                        <CategoryCard :category="item" />
                      </v-col>
                    </v-row>
                  </template>
                </InfoCard>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useMainStore } from '@/stores/index.js';
import bgImage from '@/assets/backgrounds/bgimg.jpg';
import miniMapImage from '@/assets/images/mini_map.png';
import SearchBar from '@/components/search/SearchBar.vue'; // Import the SearchBar component
import InfoCard from '@/components/ui/InfoCard.vue'; // Import the InfoCard component
import CategoryCard from '@/components/home/CategoryCard.vue'; // Import the CategoryCard component

const { mdAndUp } = useDisplay();
const mainStore = useMainStore();

const categories = computed(() => {
  return mainStore.categories;
});

const homeLayout = computed(() => {
  return {
    column: !mdAndUp.value,
    row: mdAndUp.value,
  };
});
</script>

<style scoped>
@import '@/assets/stylesheets/style.css';

/* Full-page container */
.homepage-container {
  position: relative;
  width: 100%;
  min-height: 100vh; /* Use min-height instead of height to allow content to grow */
  overflow: visible; /* Allow content to overflow */
}

/* Background image */
.bg-image {
  position: fixed; /* Fix the background image to the viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Content overlay */
.content-overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh; /* Use min-height to allow content to grow */
  display: flex;
  flex-direction: column;
}

/* Title styling */
.diskover-title {
  text-shadow: 0px 1px 3px #000000;
}

.no-underline {
  text-decoration: none;
}

.text-center {
  text-align: center;
}

.fill-width {
  width: 100%;
}

.full-width {
  width: 100%;
}
</style>
