<template>
  <div>
    <div id="map" ref="mapContainer" :style="{ height: height }"></div>
  </div>
</template>

<script>
import MapMixin from "@/mixins/MapMixin";
import { inject, onMounted } from "vue";

export default {
  mixins: [MapMixin],
  props: {
    height: {
      type: String,
      default: "300px",
    },
    defaultFormCoords: {
      type: Array,
      default: () => [0, 0],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const eventBus = inject("eventBus");

    onMounted(() => {
      eventBus.on("reset-map-view", (zoomLevel) => {
        console.log("Resetting map view to zoom level:", zoomLevel);
        // Add logic to reset the map view
      });
    });
  },
};
</script>

<style scoped>
#map {
  width: 100%;
}
</style>
