<template>
  <!-- Clickable map for inputting latitude and longitude data in a form -->
  <div :id="mapId" class="map-container" :style="{ height: height }">
    <v-progress-circular v-if="!map" :indeterminate="true"></v-progress-circular>
  </div>
</template>

<script>
import MapMixin from "@/mixins/MapMixin";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-easybutton";

export default {
  mixins: [MapMixin],
  props: {
    mapId: {
      type: String,
      default: "form-map", // Unique ID for the FormMapView
    },
    defaultFormCoords: {
      type: Array,
      default() {
        return [14.655004131234529, 121.06428197779681]; // Default UP Oblation coordinates
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "300px", // Default height for the form map
    },
  },
  data() {
    return {
      map: null,
      originIcon: L.icon({
        iconUrl: "path/to/origin-icon.png", // Replace with the path to your icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    };
  },
  mounted() {
    console.log("Mounted: Initializing Form Map");
    this.initializeMap();
    this.handleReadOnly();

    // Ensure the map resizes properly
    this.$nextTick(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });

    // Bind resetMapView function to trigger upon every reset-map-view event
    this.$eventBus.on("reset-map-view", this.resetMapView);
  },
  beforeUnmount() {
    if (this.map) {
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer); // Remove all layers
      });
      this.map.off(); // Remove all event listeners
      this.map.remove(); // Remove the map instance
      this.map = null; // Clear the map reference
    }
    this.$eventBus.off("reset-map-view", this.resetMapView);
  },
  methods: {
    initializeMap() {
      if (this.map) {
        this.map.remove();
      }

      // Initialize the map with custom zoom options
      this.map = L.map(this.mapId, {
        zoomAnimation: true,
        zoomDelta: 0.5, // Smoother zooming
        wheelPxPerZoomLevel: 120, // Slower zooming
      }).setView(this.defaultFormCoords, 15);

      // Add the tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Add the origin marker
      this.addMarker(this.defaultFormCoords, {
        draggable: !this.readonly,
        icon: this.originIcon,
      }).bindPopup("Drag me to set the location").openPopup();

      // Handle map click events
      if (!this.readonly) {
        this.map.on("click", this.setMarkerToClick);
      }

      this.$nextTick(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });
    },
    handleReadOnly() {
      if (this.readonly) {
        // Remove click listeners if the map is readonly
        this.map.off("click", this.setMarkerToClick);
      } else {
        // Add click listeners if the map is editable
        this.map.on("click", this.setMarkerToClick);
      }
    },
    setMarkerToClick(e) {
      this.removeAllMarkers();
      const { lat, lng } = e.latlng;
      this.addMarker(e.latlng, { draggable: true, icon: this.originIcon });
      this.$emit("click", [lat, lng]); // Emit the new coordinates to the parent component
    },
    resetMapView() {
      this.map.setView(this.defaultFormCoords, 15);
      this.removeAllMarkers();
      this.addMarker(this.defaultFormCoords, {
        draggable: !this.readonly,
        icon: this.originIcon,
      });
    },
    addMarker(coords, options = {}) {
      if (this.map) {
        return L.marker(coords, options).addTo(this.map);
      }
      console.warn("Map is not initialized. Cannot add marker.");
      return null;
    },
    removeAllMarkers() {
      if (this.map) {
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#form-map {
  width: 100%; /* Ensure the map takes the full width of its container */
  height: 100%; /* Ensure the map takes the full height specified */
  position: relative; /* Ensure proper positioning */
}
</style>