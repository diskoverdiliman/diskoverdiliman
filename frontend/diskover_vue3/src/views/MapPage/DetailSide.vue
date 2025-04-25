<template>
  <v-container class="pb-4">
    <!-- Thumbnail/Cover Image -->
    <v-col cols="12">
      <v-card :image="thumbnailUrl" height="200">
        <v-card-title class="d-block semi-dark-bg">
          <div class="headline text-white text-center">{{ locationName }}</div>
        </v-card-title>
      </v-card>
    </v-col>

    <!-- Category -->
    <v-col class="mt-2 title text-center">
      Category:
      <RouterLink :to="{ path: '/map/search', query: { category } }">{{ category }}</RouterLink>
    </v-col>

    <!-- Tags -->
    <v-col class="mt-2 title text-left">
      Tags:
      <span v-if="!tags.length">None</span>
      <div v-else>
        <RouterLink
          v-for="(tag, i) in tags"
          :key="i"
          :to="{ path: '/map/search', query: { tag } }"
        >
          <v-chip color="primary" class="ma-1" label dark>{{ tag }}</v-chip>
        </RouterLink>
      </div>
    </v-col>

    <!-- Primary Tabs -->
    <v-col class="mt-3">
      <v-tabs v-model="primaryTabIndex" grow center-active>
        <v-tab
          v-for="(tab, i) in tabList1"
          :key="i"
          :value="i"
        >
          <v-icon>{{ tab.icon }}</v-icon>
          {{ tab.label }}
        </v-tab>
      </v-tabs>

      <v-window v-model="primaryTabIndex">
        <v-window-item v-for="(tab, i) in tabList1" :key="i" :value="i">
          <component :is="tab.component" />
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Subareas -->
    <v-col v-if="hasSubareas" class="my-3">
      <v-expansion-panels v-model="subareaTabIndex" multiple>
        <v-expansion-panel
          v-for="(subs, category, i) in subareas"
          :key="i"
        >
          <v-expansion-panel-title>{{ category }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <SubareaTabItem :subareas="subs" :label="category" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>

    <!-- Main Building -->
    <v-col v-if="hasMainBuilding" class="mt-2">
      <v-tabs grow center-active>
        <v-tab>
          <v-icon>location_city</v-icon>
          Main Building
        </v-tab>
      </v-tabs>
      <v-window>
        <v-window-item>
          <MainBuildingTabItem :building="mainBuilding" />
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Nearby Locations -->
    <v-col class="mt-2">
      <v-tabs grow center-active>
        <v-tab>
          <v-icon>directions_walk</v-icon>
          Nearby Locations
        </v-tab>
      </v-tabs>
      <v-window>
        <v-window-item>
          <NearbyLocationsTabItem :nearbyLocations="nearbyLocations" />
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Admin Buttons -->
    <v-col v-if="isLoggedIn" class="mt-4">
      <v-row justify="space-around">
        <v-btn color="blue" :to="{ name: 'location_crud_form', params: { mode: 'update', id: locationId } }">
          Update Info
        </v-btn>
        <v-btn color="blue" :to="{ name: 'location_images_form', params: { id: locationId } }">
          Update Images
        </v-btn>
      </v-row>
      <v-btn class="mt-2" color="error" :to="{ name: 'location_crud_form', params: { mode: 'delete', id: locationId } }">
        Delete
      </v-btn>
    </v-col>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDetailsStore } from '@/stores/details';
import { useAuthStore } from '@/stores/auth';
import DirectionsTabItem from '@/components/details/DirectionsTabItem.vue';
import ImagesTabItem from '@/components/details/ImagesTabItem.vue';
import DescriptionTabItem from '@/components/details/DescriptionTabItem.vue';
import SubareaTabItem from '@/components/details/SubareaTabItem.vue';
import MainBuildingTabItem from '@/components/details/MainBuildingTabItem.vue';
import NearbyLocationsTabItem from '@/components/details/NearbyLocationsTabItem.vue';

const route = useRoute();
const detailsStore = useDetailsStore();
const authStore = useAuthStore();

const locationId = computed(() => Number(route.params.id));
const locationName = ref('');
const category = ref('');
const tags = ref([]);
const imageUrls = ref([]);
const description = ref('');
const subareas = ref([]);
const mainBuilding = ref(null);
const nearbyLocations = ref([]);

const primaryTabIndex = ref(0);
const subareaTabIndex = ref([]);

const tabList1 = [
  { label: 'Directions', icon: 'mdi-directions', component: DirectionsTabItem },
  { label: 'Images', icon: 'mdi-collections', component: ImagesTabItem },
  { label: 'Description', icon: 'mdi-file-document', component: DescriptionTabItem },
];

const thumbnailUrl = computed(() => {
  return imageUrls.value.length
    ? `${import.meta.env.VITE_BACKEND_STATIC_PATH}images/locations/${imageUrls.value[0]}`
    : '/assets/no-thumbnail.jpg';
});

const hasSubareas = computed(() => {
  return Object.values(subareas.value).some(val => val && val.length);
});

const hasMainBuilding = computed(() => mainBuilding.value !== null);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const fetchLocationData = async () => {
  try {
    const res = await fetch(`/api/locations/${locationId.value}`);
    const data = await res.json();
    locationName.value = data.name;
    category.value = data.category;
    tags.value = data.tags;
    imageUrls.value = data.img_urls;
    description.value = data.description;
    subareas.value = data.subareas;
    mainBuilding.value = data.main_building;
    nearbyLocations.value = data.nearby_locations;
    detailsStore.setEndCoords([data.lat, data.lng]);
    detailsStore.setMarkerIcon(data.marker_icon);
  } catch (err) {
    console.error('Error fetching location:', err);
    detailsStore.setEndCoords([]);
  }
};

watch(() => route.params.id, () => {
  fetchLocationData();
  primaryTabIndex.value = 0;
  subareaTabIndex.value = [];
});

fetchLocationData();
</script>

<style scoped>
.semi-dark-bg {
  background-color: rgba(0, 0, 0, 0.7);
}

#subarea-panels .v-expansion-panel-title {
  background-color: var(--v-primary-base);
  color: white;
}
</style>
