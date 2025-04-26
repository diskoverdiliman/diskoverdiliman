import { defineStore } from 'pinia';
import { getVueApp } from "@/main.js";

export const useDetailsStore = defineStore('details', {
  state: () => ({
    endCoords: [],
    routeCoordinates: [],
    instructions: [],
    markerIcon: null,
    transportMode: 'driving', // Default to driving
    serviceUrl: 'http://localhost:5001/route/v1', // Default to driving service
  }),
  actions: {
    setEndCoords(coords) {
      this.endCoords = coords;
    },
    setRouteCoordinates(coords) {
      this.routeCoordinates = coords;
    },
    setInstructions(instructions) {
      this.instructions = instructions;
    },
    setMarkerIcon(icon) {
      this.markerIcon = icon;
    },
    setTransportMode(mode) {
      this.transportMode = mode;
      this.serviceUrl = mode === 'driving' 
        ? 'http://localhost:5001/route/v1' 
        : 'http://localhost:5002/route/v1';
    },
    setServiceUrl(url) { // Add this method
      this.serviceUrl = url;
    },
  },
  getters: {
    fullIconUrl: (state) => state.markerIcon
      ? `${getVueApp().config.globalProperties.$backendStaticPath}images/markers/${state.markerIcon}`
      : null,
  },
});
