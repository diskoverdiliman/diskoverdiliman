<template>
  <!-- Home page category card with huge icon picture and link to filtered search -->
  <v-hover v-slot:default="{ isHovering }">
    <v-card
      ripple
      :color="category.route_color || 'primary'"
      :to="{ path: '/map/search', query: { category: category.name } }"
      :class="`elevation-${isHovering ? 12 : 2}`"
      class="category-card"
    >
      <!-- Category Name -->
      <div :class="textColorClass" class="body-2 text-center pa-3">{{ category.name }}</div>
      <!-- Category Icon -->
      <v-img :src="defaultUrl" class="category-icon">
        <v-img :src="imgUrl" />
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    // The category object to display
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Image URL of the icon to be shown; derived from backendStaticPath and the category name
    imgUrl() {
      let imgName = this.category.name || "defaultCategoryImage";
      return `${this.$backendStaticPath}images/categories/${imgName}.jpg`;
    },
    // The image URL of the default icon to use in case no icon is found for that category
    defaultUrl() {
      return `${this.$backendStaticPath}images/categories/defaultCategoryImage.jpg`;
    },
    // Compute the text color class based on the route_color luminance
    textColorClass() {
      const color = this.category.route_color || "#000000"; // Default to black if no color is provided
      return this.isLightColor(color) ? "text-black" : "text-white";
    }
  },
  methods: {
    // Determine if a color is light or dark based on its luminance
    isLightColor(color) {
      // Convert hex color to RGB
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return true if the color is light (luminance > 0.5)
      return luminance > 0.5;
    }
  }
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
  height: 100%;
}
</style>
