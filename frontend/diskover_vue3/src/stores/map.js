import { defineStore } from 'pinia';

// Define default start coordinates
const defaultStartCoords = [14.6549, 121.0647]; // Example coordinates for UP Diliman

export const useMapStore = defineStore('map', {
  state: () => ({
    isGpsPermissionToMark: false,
    originCoords: [0, 0],
    sideDrawer: false,
    isSideDrawerVisible: false,
  }),
  actions: {
    setGpsPermissionToMark(value) {
      this.isGpsPermissionToMark = value;
    },
    setOriginCoords(coords) {
      this.originCoords = coords;
    },
    setSideDrawer(value) {
      this.sideDrawer = value;
      this.isSideDrawerVisible = value;
    },
  }
});
