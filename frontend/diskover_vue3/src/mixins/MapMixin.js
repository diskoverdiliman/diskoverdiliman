import L from "leaflet";
import originIconUrl from "@/assets/markers/originIcon.png";
import shadowIconUrl from "@/assets/markers/shadow.png";

export default {
  props: {
    height: {
      type: String,
      default: "60vh",
    },
    mapId: {
      type: String,
      default: "map",
    },
  },
  data() {
    return {
      circleGroup: null,
      zoomControl: null,
      map: null,
      markerGroup: null,
      defaultCoords: [51.505, -0.09],
      resetButton: null,
      originIcon: null,
    };
  },
  mounted() {
    this.initMap();
    this.originIcon = this.getIcon(originIconUrl); // Use the imported asset
  },
  methods: {
    initMap() {
      this.map = L.map(this.mapId, {
        zoomControl: false,
      }).setView(this.defaultCoords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map);

      this.map.on("click", (e) => {
        console.log("You clicked on ", e.latlng);
      });

      this.zoomControl = L.control.zoom({
        position: "bottomright",
      }).addTo(this.map);

      this.markerGroup = L.layerGroup().addTo(this.map);
      this.circleGroup = L.layerGroup().addTo(this.map);
    },
    addMarker(coords, options, popupText) {
      if (this.markerGroup) {
        let m = L.marker(coords, options).addTo(this.markerGroup);
        if (popupText) {
          m.bindPopup(popupText).openPopup();
        }
        return m;
      } else {
        console.log("error: markerGroup not initialized yet");
        return null;
      }
    },
    removeAllMarkers() {
      if (this.markerGroup) {
        this.markerGroup.clearLayers();
      } else {
        console.log("error: markerGroup not initialized yet");
      }
    },
    addCircle(coords, options) {
      if (this.circleGroup) {
        L.circle(coords, options).addTo(this.circleGroup);
      } else {
        console.log("addCircle error: circleGroup not initialized yet");
      }
    },
    removeAllCircles() {
      if (this.circleGroup) {
        this.circleGroup.clearLayers();
      } else {
        console.log("removeCircle error: circleGroup not initialized yet");
      }
    },
    fitAllMapView() {
      if (this.markerGroup && this.markerGroup.getBounds) {
        this.map.fitBounds(this.markerGroup.getBounds());
      } else {
        console.log("fitAllMapView error: markerGroup not initialized or empty");
      }
    },
    getIcon(iconUrl) {
      return iconUrl
        ? L.icon({
            iconUrl: iconUrl,
            shadowUrl: shadowIconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        : null;
    },
  },
};