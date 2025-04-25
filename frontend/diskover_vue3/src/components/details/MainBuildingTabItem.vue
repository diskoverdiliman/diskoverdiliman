<template>
  <!-- Tab item for displaying main building of the current location -->
  <v-card color="secondary">
    <!-- Display outer building if current location has an outer building -->
    <v-list v-if="building">
      <v-list-item :to="`/map/details/${building.id}`" link>
        <v-list-item-content>
          <v-list-item-title>{{ building.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- Else display indicator that no outer building found -->
    <v-container v-else>
      <span class="body-2">No Building Found</span>
    </v-container>
  </v-card>
</template>

<script setup>
defineProps({
  building: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
</style>