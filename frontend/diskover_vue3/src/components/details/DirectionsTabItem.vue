<template>
  <!-- Tab item for displaying the current location direction/instructions -->
  <v-card color="secondary">
    <!-- only show the list of directions if directions exist -->
    <v-list v-if="instructions && instructions.length">
      <!-- add activation of direction in Big Map upon clicking it -->
      <v-list-item
        v-for="(inst, index) in instructions"
        :class="bgClass(index)"
        :key="index"
        @click="toggleActivation(index)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ inst.text }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>{{ inst.distance }} m</v-list-item-action-text>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <!-- In case no directions found, display indicator -->
    <v-container v-else>
      <span class="body-2">Currently no directions available</span>
    </v-container>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import { useDetailsStore } from "@/stores/details"; // Use Pinia store
import { inject } from "vue";

export default {
  name: "DirectionsTabItem",
  setup() {
    const detailsStore = useDetailsStore(); // Access the Pinia store
    const eventBus = inject("eventBus"); // Inject the event bus
    const activeInst = ref(-1); // Track the active instruction

    // Computed property for instructions from the Pinia store
    const instructions = computed(() => detailsStore.instructions);

    // Method to determine the background class for each instruction
    const bgClass = (index) => {
      return activeInst.value === index ? "accent-bg" : "secondary-bg";
    };

    // Method to toggle the activation of an instruction
    const toggleActivation = (index) => {
      if (activeInst.value === index) {
        activeInst.value = -1;
        eventBus.emit("clear-circles"); // Clear all circles in the Big Map
      } else {
        activeInst.value = index;
        eventBus.emit("clear-circles"); // Clear all circles
        eventBus.emit("add-circle", index); // Add a circle at the routeCoordinate[index]
      }
    };

    return {
      instructions,
      activeInst,
      bgClass,
      toggleActivation,
    };
  },
};
</script>

<style scoped>
.v-list {
  background-color: var(--v-secondary-base) !important;
}
</style>
