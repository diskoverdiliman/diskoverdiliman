import { defineStore } from 'pinia';
import { getVueApp } from "@/main.js";

export const useDetailsStore = defineStore('details', {
  state: () => ({
    endCoords: [],
    routeCoordinates: [],
    instructions: [], // Store directions instructions
    markerIcon: null,
    transportMode: 'driving', // Default to driving
    serviceUrl: 'http://localhost:5001', // Default to driving service
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
        ? 'http://localhost:5001' 
        : 'http://localhost:5002';

      console.log('Service URL set to:', this.serviceUrl);        
    },
  },
  getters: {
    fullIconUrl: (state) => state.markerIcon
      ? `${getVueApp().config.globalProperties.$backendStaticPath}images/markers/${state.markerIcon}`
      : null,
  },
});
