<template>
  <!-- Tab item for displaying the current location description -->
  <v-card color="secondary">
    <v-container>
      <span class="body-1">{{ description }}</span>
    </v-container>
  </v-card>
</template>

<script setup>
import { toRef } from 'vue';

const props = defineProps({
  description: {
    type: String,
    default: 'No description found.',
  },
});

const description = toRef(props, 'description');
</script>

<style scoped>
</style>