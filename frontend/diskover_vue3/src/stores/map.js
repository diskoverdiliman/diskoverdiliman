import { defineStore } from 'pinia';

// Define default start coordinates
const defaultStartCoords = [14.6549, 121.0647]; // Example coordinates for UP Diliman

export const useMapStore = defineStore('map', {
  state: () => ({
    isGpsPermissionToMark: localStorage.getItem('gps') === "true",
    originCoords: defaultStartCoords,
    sideDrawer: false,
    isSideDrawerVisible: false,
  }),
  actions: {
    setGpsPermissionToMark(gps) {
      this.isGpsPermissionToMark = gps;
      if (gps) {
        localStorage.setItem('gps', gps);
      } else {
        localStorage.removeItem('gps');
      }
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
