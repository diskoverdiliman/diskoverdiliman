<template>
  <v-dialog v-model="myVisible" max-width="750px" max-height="750px" persistent> <!-- Set max-width and persistent -->
    <v-card><v-card-actions>
        <v-btn color="blue darken-1" text @click="emit('close')">Close</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-card-text>
        <slot></slot>
      </v-card-text>
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
</style>