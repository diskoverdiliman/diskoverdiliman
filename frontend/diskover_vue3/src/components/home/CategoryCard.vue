<template>
  <!-- Home page category card with huge icon picture and link to filtered search -->
  <v-hover v-slot:default="{ isHovering }">
    <v-card
      ripple
      color="primary"
      :to="{ path: '/map/search', query: { category: category.name } }"
      :class="`elevation-${isHovering ? 12 : 2}`"
    >
      <!-- Category Name -->
      <div class="text-white body-2 text-xs-center pa-1">{{ category.name }}</div>
      <!-- Category Icon -->
      <v-img :src="defaultUrl">
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
    }
  }
};
</script>

<style scoped>
</style>
