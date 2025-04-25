<template>
  <!-- Tab Item for displaying the images of the current location -->
  <div class="mb-3">
    <v-card color="secondary">
      <v-container>
        <v-row justify="start" align="start">
          <v-col v-for="(url, i) in fullImageUrls" :key="url" cols="4">
            <v-hover>
              <template #default="{ isHovering }">
                <!-- toggle image card to openCarouselModal on click -->
                <v-card
                  :class="`elevation-${isHovering ? 12 : 2}`"
                  @click="openCarouselModalAt(i)"
                  tile
                >
                  <v-img :src="url" :aspect-ratio="1"></v-img>
                </v-card>
              </template>
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
    <CenterModal width="550px" :isVisible="isCarouselVisible" @close="setCarouselModal(false)">
      <v-card>
        <v-carousel :cycle="false" v-model="carouselIndex">
          <v-carousel-item v-for="(url, i) in fullImageUrls" :key="i">
            <v-img :src="url" height="100%" position="center top"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </CenterModal>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "ImagesTabItem",
  props: {
    imageUrls: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // Reactive state for modal visibility and carousel index
    const isCarouselVisible = ref(false);
    const carouselIndex = ref(0);

    // Computed property for full image URLs
    const fullImageUrls = computed(() =>
      props.imageUrls.map((url) => `${getVueApp().config.globalProperties.$backendStaticPath}images/locations/${url}`)
    );

    // Methods
    const setCarouselModal = (value) => {
      isCarouselVisible.value = value;
    };

    const openCarouselModalAt = (index) => {
      isCarouselVisible.value = true;
      carouselIndex.value = index;
    };

    return {
      isCarouselVisible,
      carouselIndex,
      fullImageUrls,
      setCarouselModal,
      openCarouselModalAt,
    };
  },
});
</script>

<style scoped>
</style>
