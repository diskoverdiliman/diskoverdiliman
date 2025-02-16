<template>
  <!-- the huge map displayed on the right side on the search and details pages -->
  <div id="map" class="map-container">
    <slot></slot>
    <v-row justify="center" align="center">
      <v-col align="center">
        <!-- loading circle in case map doesnt load in time -->
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
import { inject } from 'vue';

export default {
  mixins: [MapMixin, JeepMixin],
  mounted() {
    console.log("Mounted: Initializing Map");
    this.initializeMap();
    this.handleMapChange();
    this.listenForInstructionCirlces();
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
      serviceUrl: "https://diskover.up.edu.ph/osrm/route/v1",
      originIcon: L.icon({
        iconUrl: 'path/to/origin-icon.png', // Replace with the path to your icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    };
  },
  computed: {
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
    }
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
    }
  },
  methods: {
    initializeMap() {
      if (this.map) {
        this.map.remove();
      }
      this.map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.initGpsButton();
      this.initResetButton();
      this.initJeepRoutes(); // Initialize Jeepney routes
      this.initJeepRoutesControl(); // Initialize Jeepney routes control
      this.handleMapChange();
      this.listenForInstructionCirlces();

      // Handle location found event
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
      this.routing = L.Routing.control({
        serviceUrl: this.serviceUrl,
        plan: L.Routing.plan([L.latLng(start), L.latLng(finish)], {
          createMarker: (index, waypoint) => {
            if (index == 0) {
              return L.marker(waypoint.latLng, {
                draggable: true,
                icon: this.originIcon
              })
                .bindPopup("You are here. Drag me all you like")
                .openPopup();
            } else {
              let icon = this.getIcon(this.detailIconUrl);
              return L.marker(waypoint.latLng, {
                draggable: false,
                ...(icon && { icon: icon })
              })
                .bindPopup("You want to go here")
                .openPopup();
            }
          }
        }),
        routeWhileDragging: true,
        show: false,
        fitSelectedRoutes: true,
        collapsible: true
      }).addTo(this.map);

      this.routing.on("routesfound", e => {
        let insts = e.routes[0].instructions.map(inst => ({
          text: inst.text,
          distance: inst.distance,
          index: inst.index
        }));
        this.setInstructions(insts);
        let instIndex = 0;
        let coords = e.routes[0].coordinates.filter((coord, index) => {
          if (insts[instIndex].index == index) {
            instIndex++;
            return true;
          }
          return false;
        });
        this.setRouteCoordinates(coords);
      });

      this.routing.on("routingerror", e => {
        alert("OSRM Routing Error: " + e.error.message);
        console.log("OSRM Routing Error: ", e.error.message);
        this.setInstructions([]);
      });
    },
    listenForInstructionCirlces() {
      this.eventBus.on("add-circle", index => {
        let coords = this.routeCoordinates[index];
        this.addCircle(coords, {
          radius: 15,
          color: "#03f",
          fillColor: "white",
          opacity: 1,
          fillOpacity: 0.7
        });
        this.map.setView(coords, 16);
      });
      this.eventBus.on("clear-circles", this.removeAllCircles);
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

      // Add a marker at the user's location
      L.marker(latlng, { icon: this.originIcon })
        .addTo(this.map)
        .bindPopup(`You are within ${radius} meters from this point`).openPopup();

      // Add a circle around the user's location
      L.circle(latlng, radius).addTo(this.map);
    },
    onLocationError(e) {
      alert(e.message);
    }
  },
  setup() {
    const eventBus = inject('eventBus');
    return {
      eventBus
    };
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

.btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
