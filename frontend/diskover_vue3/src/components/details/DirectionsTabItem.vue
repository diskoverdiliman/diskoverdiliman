<template>
  <v-card color="#7b1113">
    <!-- Only show the list of directions if directions exist -->
    <v-list v-if="instructions && instructions.length">
      <v-list-item
        v-for="(inst, index) in instructions"
        :key="index"
        :class="bgClass(index)"
        @click="toggleActivation(index)"
      >
        <v-list-item-title class="direction-text">{{ inst.text }}</v-list-item-title>
        <v-list-item-subtitle class="direction-text">{{ inst.distance }} m</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <!-- In case no directions are found, display an indicator -->
    <v-container v-else>
      <span class="body-2">Currently no directions available</span>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useDetailsStore } from '@/stores/details';

const detailsStore = useDetailsStore();
const eventBus = inject('eventBus');

const activeInst = ref(-1);
const instructions = computed(() => detailsStore.instructions);

const bgClass = (index) => {
  return activeInst.value === index ? 'accent-bg' : 'secondary-bg';
};

const toggleActivation = (index) => {
  if (activeInst.value === index) {
    activeInst.value = -1;
    eventBus?.emit('clear-circles');
  } else {
    activeInst.value = index;
    eventBus?.emit('clear-circles');
    eventBus?.emit('add-circle', index);
  }
};
</script>

<style scoped>
.v-list {
  background-color: var(--v-secondary-base) !important;
}

.direction-text {
  color: white !important; /* Ensure the text color is white */
}
</style>