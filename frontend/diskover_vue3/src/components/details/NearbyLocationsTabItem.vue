<template>
  <!-- Tab item for displaying nearby locations to the current location -->
  <v-card color="secondary">
    <!-- Only display if nearby locations are found -->
    <v-list v-if="nearbyLocations && nearbyLocations.length">
      <!-- Add hyperlinks to nearby locations that navigate to their details page -->
      <v-list-item
        v-for="near in nearbyLocations"
        :key="near.id"
        :to="`/map/details/${near.id}`"
        link
      >
        <v-list-item-title>{{ near.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- Display indicator if no nearby locations are found -->
    <v-container v-else>
      <span class="body-2">No nearby locations found</span>
    </v-container>
  </v-card>
</template>

<script setup>
defineProps({
  nearbyLocations: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
</style>