<template>
  <!-- Home page category card with huge icon picture and link to filtered search -->
  <v-hover v-slot:default="{ isHovering }">
    <v-card
      ripple
      color="#7b1113" 
      :to="{ path: '/map/search', query: { category: category.name } }"
      :class="`elevation-${isHovering ? 12 : 2}`"
      class="category-card"
    >
      <!-- Category Name -->
      <div class="body-2 text-center text-white pa-3">{{ category.name }}</div>
      <!-- Category Icon -->
      <v-img
        :src="imageUrl"
        :alt="category.name"
        height="100%"
        width="100%"
        class="full-width"
    />
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageUrl: this.defaultUrl, // Start with the default URL
    };
  },
  computed: {
    defaultUrl() {
      return `${this.$backendStaticPath}images/categories/defaultCategoryImage.jpg`;
    },
    expectedImgUrl() {
      let imgName = this.category.name || "defaultCategoryImage";
      return `${this.$backendStaticPath}images/categories/${imgName}.jpg`;
    },
  },
  watch: {
    'category.name': {
      immediate: true,
      handler() {
        this.loadImage();
      },
    },
  },
  methods: {
    loadImage() {
      const img = new Image();
      img.src = this.expectedImgUrl;

      img.onload = () => {
        this.imageUrl = this.expectedImgUrl; // Update to the actual image URL if it loads successfully
      };

      img.onerror = () => {
        this.imageUrl = this.defaultUrl; // Fallback to the default URL if the image fails to load
      };
    },
  },
  mounted() {
    this.loadImage(); // Load the image when the component is mounted
  },
};
</script>

<style scoped>
.text-white {
  color: white !important;
}

.text-black {
  color: black !important;
}

.category-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
