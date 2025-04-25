<template>
  <!-- Tab Item for displaying the images of the current location -->
  <div class="mb-3">
    <v-card color="#7b1113">
      <v-container>
        <v-row justify="start" align="start">
          <v-col v-for="(url, i) in fullImageUrls" :key="url" cols="4">
            <v-hover v-slot="{ isHovering }">
              <v-card
                :class="`elevation-${isHovering ? 12 : 2}`"
                @click="openCarouselModalAt(i)"
                tile
              >
                <v-img :src="url" :aspect-ratio="1" />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <div v-if="!fullImageUrls || !fullImageUrls.length" class="body-2">
          No images found for this location
        </div>
        <div v-else class="body-2">Click an image for a bigger view</div>
      </v-card-text>
    </v-card>

    <!-- Carousel Modal for showing a bigger view of the images -->
    <CenterModal :isVisible="isCarouselVisible" @close="setCarouselModal(false)">
      <v-card class="pa-4" max-width="1200px" max-height="90vh">
        <v-carousel :cycle="false" v-model="carouselIndex" height="80vh">
          <v-carousel-item v-for="(url, i) in fullImageUrls" :key="i">
            <v-img :src="url" height="100%" contain />
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </CenterModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CenterModal from '@/components/ui/CenterModal.vue';

// Props
const props = defineProps({
  imageUrls: {
    type: Array,
    default: () => [],
  },
});

// Modal visibility and current index in carousel
const isCarouselVisible = ref(false);
const carouselIndex = ref(0);

// Resolve full URLs for image paths
const fullImageUrls = computed(() =>
  props.imageUrls.map((url) => {
    const backendStaticPath = import.meta.env.VITE_BACKEND_STATIC_PATH || 'http://localhost:8000/static/';
    return `${backendStaticPath}images/locations/${url}`;
  })
);

// Modal open/close logic
const setCarouselModal = (value) => {
  isCarouselVisible.value = value;
};

const openCarouselModalAt = (index) => {
  carouselIndex.value = index;
  setCarouselModal(true);
};
</script>

<style scoped>
</style>