<template>
  <div :id="mapId" class="map-container" :style="{ height: height }">
    <v-progress-circular v-if="!map" :indeterminate="true"></v-progress-circular>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-easybutton";
import defaultIcon from "@/assets/markers/defaultIcon.png"

export default {
  props: {
    mapId: {
      type: String,
      default: "form-map",
    },
    defaultFormCoords: {
      type: Array,
      default() {
        return [14.655004131234529, 121.06428197779681];
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      map: null,
      marker: null, // Store the marker instance
      originIcon: L.icon({
        iconUrl: defaultIcon, // Replace with the path to your icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    };
  },
  mounted() {
    this.initializeMap();

    this.$nextTick(() => {
      if (this.map) {
        console.log("Map initialized:", this.map);
        this.map.invalidateSize();
      }
    });

    this.handleReadOnly();

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
      this.marker = this.addMarker(this.defaultFormCoords, {
        draggable: !this.readonly,
        icon: this.originIcon,
      });

      // Handle map click events
      if (!this.readonly) {
        this.map.on("click", this.setMarkerToClick.bind(this));
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
        this.map.on("click", this.setMarkerToClick.bind(this));
      }
    },
    setMarkerToClick(e) {
      console.log("Map click event:", e); // Debugging
      if (e.latlng) {
        const { lat, lng } = e.latlng;
        if (this.marker) {
          this.marker.setLatLng(e.latlng); // Move the existing marker
        } else {
          this.marker = this.addMarker(e.latlng, { draggable: true, icon: this.originIcon });
        }
        console.log("Emitting coordinates:", [lat, lng]); // Debugging
        this.$emit("click", [lat, lng]); // Emit the coordinates to the parent component
      } else {
        console.error("Invalid map click event:", e); // Debugging
      }
    },
    resetMapView() {
      this.map.setView(this.defaultFormCoords, 15);
      if (this.marker) {
        this.marker.setLatLng(this.defaultFormCoords); // Reset the marker position
      }
    },
    addMarker(coords, options = {}) {
      if (this.map) {
        const marker = L.marker(coords, options).addTo(this.map);
        marker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          console.log("Marker dragged to:", [lat, lng]); // Debugging
          this.$emit("click", [lat, lng]); // Emit the new coordinates to the parent component
        });
        return marker;
      }
      console.warn("Map is not initialized. Cannot add marker.");
      return null;
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>