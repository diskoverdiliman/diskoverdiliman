<template>
  <v-dialog v-model="myVisible" max-width="600px" persistent> <!-- Set max-width and persistent -->
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const myVisible = computed({
  get() {
    return props.isVisible;
  },
  set(value) {
    emit('update:isVisible', value);
  }
});
</script>

<style scoped>
.v-dialog {
  max-height: 50vh; /* Adjust the height as needed */
}
</style>