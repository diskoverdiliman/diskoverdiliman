<template>
  <v-app>
    <Background>
      <NavBar/>
      <v-container class="full-vwidth full-vheight no-padding">
        <router-view></router-view>
      </v-container>
      <GpsMapHidden mapId="hidden-map"/>
    </Background>
  </v-app>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMainStore } from '@/stores/index';
import NavBar from '@/components/ui/NavBar.vue';
import Background from '@/components/ui/Background.vue';
import GpsMapHidden from '@/components/map/GpsMapHidden.vue';

const authStore = useAuthStore();
const mainStore = useMainStore();
const route = useRoute();

onMounted(() => {
  authStore.verifyToken()
    .then(() => {
      if (authStore.isLoggedIn) {
        return Promise.all([
          mainStore.$http.get("/categorys"),
          mainStore.$http.get("/tags")
        ]);
      }
    })
    .then(responses => {
      if (responses && responses.length === 2) {
        const [categoriesResponse, tagsResponse] = responses;
        mainStore.setCategories(categoriesResponse.data);
        mainStore.setTags(tagsResponse.data);
      }
    })
    .catch(error => {
      console.error("Unexpected error:", error);
    });
});

watch(route, () => {
  authStore.verifyToken()
    .then(() => console.log("Route changed, token verified."))
    .catch(() => console.warn("No token found, continuing as guest."));
});

const isLoggedIn = computed(() => authStore.isLoggedIn);
</script>

<style scoped>
@import '@/assets/stylesheets/style.css';

.full-vwidth {
  width: 100%;
}

.full-vheight {
  height: calc(100vh - 64px); /* Adjust the height to fill the screen under the navbar */
}

.no-padding {
  padding: 0;
}
</style>