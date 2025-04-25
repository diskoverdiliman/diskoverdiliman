<template>
  <!-- Tab item for displaying the inside rooms or outer building of the current location -->
  <v-card color="secondary">
    <!-- Display rooms if current location has inside rooms -->
    <v-list v-if="subareas && subareas.length">
      <v-list-item
        v-for="sub in subareas"
        :key="sub.id"
        :to="`/map/details/${sub.id}`"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ sub.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!-- Display indicator if no subareas are found -->
    <v-container v-else>
      <span class="body-2">No {{ label }} Found</span>
    </v-container>
  </v-card>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "subareas",
  },
  subareas: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
</style>