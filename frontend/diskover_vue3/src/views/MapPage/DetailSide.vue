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

    <!-- Transport Mode Buttons -->
    <v-col class="mt-3">
      <v-row justify="center">
        <v-btn small @click="switchToDriving" :color="transportMode === 'driving' ? 'primary' : 'grey'">Drive</v-btn>
        <v-btn small @click="switchToWalking" :color="transportMode === 'foot' ? 'primary' : 'grey'">Walk</v-btn>
      </v-row>
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
        <v-window-item
          v-for="(tab, i) in tabList1"
          :key="i"
          :value="i"
        >
          <component
            :is="tab.component"
            v-bind="tab.props"
            :imageUrls="imageUrls"
            :description="description"
          />
        </v-window-item>
      </v-window>
    </v-col>

    <!-- Subareas -->
    <v-col v-if="hasSubareas" class="my-3">
      <v-expansion-panels v-model="subareaTabIndex" multiple>
        <v-expansion-panel
          v-for="(subs, category, i) in subareas"
          :key="i"
          color="#7b1113"
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
      <v-row class="mb-2">
        <v-btn color="blue" :to="{ name: 'location_crud_form', params: { mode: 'update', id: locationId } }">
          Update Info
        </v-btn>
      </v-row>
      <v-row class="mb-2">
        <v-btn color="blue" :to="{ name: 'location_images_form', params: { id: locationId } }">
          Update Images
        </v-btn>
      </v-row>
      <v-row class="mb-2">
        <v-btn color="error" :to="{ name: 'location_crud_form', params: { mode: 'delete', id: locationId } }">
          Delete
        </v-btn>
    </v-row>
    </v-col>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDetailsStore } from '@/stores/details';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios'; // Import axios
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

const thumbnailUrl = computed(() => {
  if (imageUrls.value.length > 0 && imageUrls.value[0]) {
    const backendStaticPath = import.meta.env.VITE_APP_STATIC_URL;
    return `${backendStaticPath}images/locations/${imageUrls.value[0]}`;
  }
  return '/assets/no-thumbnail.jpg'; // Adjust the fallback path as needed
});

const tabList1 = computed(() => [
  {
    label: 'Directions',
    icon: 'mdi-directions',
    component: DirectionsTabItem,
    props: {},
  },
  {
    label: 'Images',
    icon: 'mdi-image',
    component: ImagesTabItem,
    props: { imageUrls: imageUrls.value },
  },
  {
    label: 'Description',
    icon: 'mdi-file-document',
    component: DescriptionTabItem,
    props: { description: description.value },
  },
]);

const hasSubareas = computed(() => {
  return Object.values(subareas.value).some(val => val && val.length);
});

const hasMainBuilding = computed(() => mainBuilding.value !== null);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const fetchLocationData = async () => {
  try {
    const response = await axios.get(`/locations/${locationId.value}`); // Use axios for the GET request
    const data = response.data;
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
    detailsStore.setEndCoords([]);
  }
};

const transportMode = ref('driving'); // Default to driving

const switchToDriving = () => {
  transportMode.value = 'driving';
  updateRouting();
};

const switchToWalking = () => {
  transportMode.value = 'foot';
  updateRouting();
};

const updateRouting = () => {
  const detailsStore = useDetailsStore();
  detailsStore.setTransportMode(transportMode.value);
};

// Watch for changes in transport mode and update routing
watch(transportMode, updateRouting);

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
