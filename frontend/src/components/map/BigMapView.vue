<template>
  <div id="map" class="map-container">
    <slot></slot>
    <v-row justify="center" align="center">
      <v-col align="center">
        <v-progress-circular :indeterminate="true"></v-progress-circular>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MapMixin from "@/mixins/MapMixin";
import JeepMixin from "@/mixins/JeepMixin";
import { useMapStore } from '@/stores/map';
import { useDetailsStore } from '@/stores/details';
import { useSearchStore } from '@/stores/search';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-easybutton';
import { inject, watch } from 'vue';

export default {
  mixins: [MapMixin, JeepMixin],
  mounted() {
    this.initializeMap();
    this.handleMapChange();
    this.listenForInstructionCircles();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  props: {
    isOnDetailsPage: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      map: null,
      gpsButton: null,
      routing: null,
      endIcon: null,
      originIcon: L.icon({
        iconUrl: 'null',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    };
  },
  computed: {
    osrmServiceUrl() {
      const detailsStore = useDetailsStore();
      return detailsStore.serviceUrl; // Use the reactive service URL from the store
    },
    endCoords() {
      const detailsStore = useDetailsStore();
      return detailsStore.endCoords;
    },
    routeCoordinates() {
      const detailsStore = useDetailsStore();
      return detailsStore.routeCoordinates;
    },
    hasPermissionToMark() {
      const mapStore = useMapStore();
      return mapStore.isGpsPermissionToMark;
    },
    originCoords: {
      get() {
        const mapStore = useMapStore();
        return mapStore.originCoords;
      },
      set(value) {
        const mapStore = useMapStore();
        mapStore.setOriginCoords(value);
      }
    },
    resultIds() {
      const searchStore = useSearchStore();
      return searchStore.resultIds;
    },
    resultCoords() {
      const searchStore = useSearchStore();
      return searchStore.resultCoords;
    },
    fullIconUrls() {
      const searchStore = useSearchStore();
      return searchStore.fullIconUrls;
    },
    detailIconUrl() {
      const detailsStore = useDetailsStore();
      return detailsStore.fullIconUrl;
    },
    transportMode() {
      const detailsStore = useDetailsStore();
      return detailsStore.transportMode; // Reactively use the transportMode from the store
    },
  },
  watch: {
    isOnDetailsPage() {
      this.handleMapChange();
    },
    originCoords() {
      this.handleMapChange();
    },
    endCoords() {
      this.handleMapChange();
    },
    resultCoords() {
      this.handleMapChange();
    },
    transportMode(newMode) {
      this.handleMapChange(); // Reinitialize the map when transport mode changes
    },
    osrmServiceUrl() {
      this.handleMapChange(); // Reinitialize the map when service URL changes
    },
    // Watch for changes in the side drawer visibility
    'mapStore.isSideDrawerVisible': {
      handler() {
        if (this.map) {
          this.map.invalidateSize(); // Notify Leaflet of the size change
        }
      },
      immediate: true,
    },
  },
  methods: {
    switchToDriving() {
      this.transportMode = "driving";
      this.handleMapChange();
    },
    switchToWalking() {
      this.transportMode = "foot";
      this.handleMapChange();
    },
    initializeMap() {
      if (this.map) {
        this.map.remove();
      }
      this.map = L.map('map').setView([14.5995, 120.9842], 13); // Default to Manila

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      this.initGpsButton();
      this.initResetButton();
      this.initJeepRoutes();
      this.initJeepRoutesControl();
      this.handleMapChange();
      this.listenForInstructionCircles();

      this.map.on('locationfound', this.onLocationFound);
      this.map.on('locationerror', this.onLocationError);
    },
    handleMapChange() {
      if (this.isOnDetailsPage) {
        this.initDetailsPageMap();
      } else {
        this.initSearchPageMap();
      }
    },
    initSearchPageMap() {
      if (this.routing) {
        this.routing.remove();
      }
      this.removeAllCircles();
      this.removeAllMarkers();
      this.addMarker(
        this.originCoords,
        {
          draggable: true,
          icon: this.originIcon
        },
        "You are here. Drag me all you like."
      );
      this.map.setView(this.originCoords, 15);
      for (let i = 0; i < this.resultCoords.length; i++) {
        let icon = this.getIcon(this.fullIconUrls[i]);
        this.addMarker(this.resultCoords[i], {
          draggable: false,
          ...(icon && { icon: icon })
        }).on("click", () => {
          this.$router.push({
            name: "details",
            params: { id: this.resultIds[i] }
          });
        });
      }
    },
    initDetailsPageMap() {
      this.removeAllMarkers();
      if (this.routing) {
        this.routing.remove();
      }
      this.initRouting(this.originCoords, this.endCoords);
      this.map.fitBounds([this.originCoords, this.endCoords]);
    },
    initGpsButton() {
      this.gpsButton = L.easyButton({
        position: "bottomright",
        states: [
          {
            icon: '<i class="material-icons">gps_fixed</i>',
            onClick: () => {
              if (this.hasPermissionToMark) {
                this.map.locate({ setView: true, maxZoom: 16 });
              } else {
                this.eventBus.emit("open-gps-bottom-modal");
              }
            }
          }
        ]
      }).addTo(this.map);
    },
    initRouting(start, finish) {
      if (this.routing) {
        this.routing.remove();
      }

      const mode = this.transportMode || "driving";
      const baseUrl = this.osrmServiceUrl.replace(/\/$/, "");
      const detailsStore = useDetailsStore();
      const routeColor = detailsStore.routeColor || '#3388ff'; // Default to blue if no color is set

      console.log("Using OSRM Service URL:", baseUrl, "with profile:", mode);

      this.routing = L.Routing.control({
        router: new L.Routing.OSRMv1({
          serviceUrl: `${baseUrl}/route/v1`,
          profile: mode,
        }),
        plan: L.Routing.plan([L.latLng(start), L.latLng(finish)], {
          createMarker: (index, waypoint) => {
            if (index === 0) {
              return L.marker(waypoint.latLng, {
                draggable: true,
                icon: this.originIcon,
              }).bindPopup("You are here. Drag me all you like").openPopup();
            } else {
              let icon = this.getIcon(this.detailIconUrl);
              return L.marker(waypoint.latLng, {
                draggable: false,
                ...(icon && { icon: icon }),
              }).bindPopup("You want to go here").openPopup();
            }
          },
        }),
        routeWhileDragging: true,
        show: true,
        fitSelectedRoutes: true,
        collapsible: false,
        lineOptions: {
          styles: [{ color: routeColor, weight: 5 }], // Use the dynamic route color
        },
      })
        .on("routesfound", (e) => {
          const route = e.routes[0];
          const instructions = route.instructions.map((inst) => ({
            text: inst.text,
            distance: inst.distance,
          }));
          const coordinates = route.coordinates.map((coord) => [coord.lat, coord.lng]);

          this.setInstructions(instructions);
          this.setRouteCoordinates(coordinates);
        })
        .addTo(this.map);

      this.routing._container.style.display = "none";
    },
    listenForInstructionCircles() {
      if (!this.eventBus) {
        console.error('eventBus is not defined!');
        return;
      }

      this.eventBus.on("toggle-side-drawer", () => {
        this.mapStore.setSideDrawer(!this.mapStore.isSideDrawerVisible);
      });
    },
    setInstructions(instructions) {
      const detailsStore = useDetailsStore();
      detailsStore.setInstructions(instructions);
    },
    setRouteCoordinates(coordinates) {
      const detailsStore = useDetailsStore();
      detailsStore.setRouteCoordinates(coordinates);
    },
    onLocationFound(e) {
      const radius = e.accuracy / 2;
      const latlng = e.latlng;
      L.marker(latlng, { icon: this.originIcon })
        .addTo(this.map)
        .bindPopup(`You are within ${radius} meters from this point`).openPopup();
      L.circle(latlng, radius).addTo(this.map);
    },
    onLocationError(e) {
      alert(e.message);
    }
  },
  setup() {
    const eventBus = inject('eventBus'); // Ensure eventBus is injected
    const mapStore = useMapStore();

    if (!eventBus) {
      console.error('eventBus is not provided!');
    }

    return { eventBus, mapStore };
  }
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

.leaflet-control-container .leaflet-routing-container-hide {
    display: none !important;
}
</style>