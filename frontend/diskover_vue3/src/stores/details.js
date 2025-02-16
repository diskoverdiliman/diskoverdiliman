import { defineStore } from 'pinia';
import { getVueApp } from "@/main.js";

export const useDetailsStore = defineStore('details', {
  state: () => ({
    routeCoordinates: [],
    instructions: [],
    endCoords: [],
    markerIcon: "",
  }),
  actions: {
    setRouteCoordinates(newRouteCoordinates) {
      this.routeCoordinates = newRouteCoordinates;
    },
    setInstructions(newInstructions) {
      this.instructions = newInstructions;
    },
    setEndCoords(newEndCoords) {
      this.endCoords = newEndCoords;
    },
    setMarkerIcon(newMarkerIcon) {
      this.markerIcon = newMarkerIcon;
    }
  },
  getters: {
    fullIconUrl: (state) => state.markerIcon
      ? `${getVueApp().config.globalProperties.$backendStaticPath}images/markers/${state.markerIcon}`
      : null
  }
});
