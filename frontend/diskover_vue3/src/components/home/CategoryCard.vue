<template>
  <!-- Home page category card with huge icon picture and link to filtered search -->
  <v-hover v-slot:default="{ isHovering }">
    <v-card
      ripple
      color="primary"
      :to="{ path: '/map/search', query: { category: category } }"
      :class="`elevation-${isHovering ? 12 : 2}`"
    >
      <!-- Category Name -->
      <div class="text-white body-2 text-xs-center pa-1">{{ category }}</div>
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
    // the category name to display
    category: String
  },
  computed: {
    // image url of the icon to be shown; derived from backendStaticPath and the category name
    imgUrl() {
      let imgName = this.category || "defaultCategoryImage";
      return `${this.$backendStaticPath}images/categories/${imgName}.jpg`;
    },
    // the image url of the default icon to use in case no icon found for that category
    defaultUrl() {
      return `${
        this.$backendStaticPath
      }images/categories/defaultCategoryImage.jpg`;
    }
  }
};
</script>

<style scoped>
</style>
