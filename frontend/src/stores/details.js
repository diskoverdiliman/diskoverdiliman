import { defineStore } from 'pinia';
import { getVueApp } from "@/main.js";

export const useDetailsStore = defineStore('details', {
  state: () => ({
    endCoords: [],
    routeCoordinates: [],
    instructions: [], // Store directions instructions
    markerIcon: null,
    transportMode: 'driving', // Default to driving
    // serviceUrl: 'https://localhost:5001', // Default to driving service for development
    serviceUrl: process.env.VITE_BASE_URL, // Use environment variable for service URL
    routeColor: '#3388ff', // Default route color
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
      // for development
      // this.serviceUrl = mode === 'driving' 
      //   ? 'https://localhost:5001' 
      //   : 'https://localhost:5002';

      console.log('Service URL set to:', this.serviceUrl);        
    },
    setRouteColor(color) {
      this.routeColor = color;
    },
  },
  getters: {
    fullIconUrl: (state) => state.markerIcon
      ? `${getVueApp().config.globalProperties.$backendStaticPath}/images/markers/${state.markerIcon}`
      : null,
  },
});
