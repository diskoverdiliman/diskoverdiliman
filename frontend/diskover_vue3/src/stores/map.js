import { defineStore } from "pinia";

export const useMapStore = defineStore("map", {
  state: () => ({
    originCoords: JSON.parse(localStorage.getItem("gpsLocation")) || [14.655004131234529, 121.06428197779681], // Default UP Oblation coordinates
    isGpsPermissionToMark: false,
    sideDrawer: false,
    isSideDrawerVisible: false,
  }),
  actions: {
    setOriginCoords(coords) {
      this.originCoords = coords;
      localStorage.setItem("gpsLocation", JSON.stringify(coords)); // Persist the GPS location
    },
    setGpsPermissionToMark(permission) {
      this.isGpsPermissionToMark = permission;
    },
    setSideDrawer(value) {
      this.sideDrawer = value;
      this.isSideDrawerVisible = value;
    },
  },
});
