<template>
  <!-- GPS permission modals and hidden map for making GPS queries -->
  <div>
    <!-- Bottom modal for asking for GPS permission -->
    <BottomModal :isVisible="isBottomModalVisible" @close="setBottomModal(false)">
      <v-layout column align-center class="red lighten-4">
        <div class="display-1 pt-3">{{ gpsQuestionText }}</div>
        <v-layout>
          <!-- call for geolocation when Yes is clicked -->
          <v-btn color="blue" dark @click="callGeolocation">Yes</v-btn>
          <!-- forefeit geolocation permissions when No is clicked -->
          <v-btn color="red" dark @click="forfeitPermissionToMark">No</v-btn>
        </v-layout>
      </v-layout>
    </BottomModal>
    <!-- hidden GPS map -->
    <div id="hidden-map" :style="{ display: 'none' }"></div>
    <!-- Center modal for confirming GPS permission despite proximity from UP Diliman -->
    <CenterModal :isVisible="isCenterModalVisible" @close="setCenterModal(false)">
      <v-layout column align-content-space-around class="red lighten-4 text-xs-center">
        <v-card-title class="headline">Confirmation</v-card-title>
        <v-col class="headline amber lighten-4 py-3">
          Your current location doesn't appear to be in UP Diliman
        </v-col>
        <v-col class="title pt-2">Continue GPS anyway?</v-col>
        <v-layout justify-center>
          <!-- confirm geolocation marking permissions when Yes is clicked -->
          <v-btn color="blue" dark @click="grantPermissionToMark">Yes</v-btn>
          <!-- abstain from granting geolocation marking permissions if No is clicked -->
          <v-btn color="red" dark @click="setCenterModal(false)">No</v-btn>
        </v-layout>
      </v-layout>
    </CenterModal>
  </div>
</template>

<script>
import { inject } from "vue"; // Import inject from Vue
import { useMapStore } from "@/stores/map"; // Import the Pinia store
import MapMixin from "@/mixins/MapMixin";
import BottomModal from "@/components/ui/BottomModal.vue"; // Adjust the path as needed
import CenterModal from "@/components/ui/CenterModal.vue"; // Import CenterModal if needed

export default {
  mixins: [MapMixin],
  components: {
    BottomModal, // Register BottomModal
    CenterModal, // Register CenterModal
  },
  data() {
    const mapStore = useMapStore(); // Use the Pinia store
    return {
      isBottomModalVisible: false,
      isCenterModalVisible: false,
      pendingCoords: mapStore.originCoords, // Use the store's state
      boundingBox: L.latLngBounds(this.$defaultUpBoundingBox),
    };
  },
  computed: {
    hasPermissionToMark: {
      get() {
        const mapStore = useMapStore(); // Access the Pinia store
        return mapStore.isGpsPermissionToMark; // Access the state
      },
      set(value) {
        const mapStore = useMapStore(); // Access the Pinia store
        mapStore.setGpsPermissionToMark(value); // Call the action
      },
    },
    gpsQuestionText() {
      return this.hasPermissionToMark
        ? "Would you like to continue using GPS marker?"
        : "Would you like to use GPS to mark your location?";
    },
  },
  mounted() {
    this.initGeolocationCallbacks();
    const eventBus = inject("eventBus"); // Inject the eventBus
    if (eventBus) {
      eventBus.on("open-gps-bottom-modal", () => {
        this.setBottomModal(true);
      });
      eventBus.on("call-geolocation", this.callGeolocation);
    } else {
      console.error("EventBus is not available");
    }

    // Load GPS location from localStorage
    const savedGpsLocation = JSON.parse(localStorage.getItem("gpsLocation"));
    if (savedGpsLocation) {
      const mapStore = useMapStore(); // Access the Pinia store
      mapStore.setOriginCoords(savedGpsLocation); // Restore the GPS location
    }
  },
  methods: {
    setBottomModal(value) {
      this.isBottomModalVisible = value;
    },
    setCenterModal(value) {
      this.isCenterModalVisible = value;
    },
    initGeolocationCallbacks() {
      if (!this.map) {
        console.error("Map is not initialized");
        return;
      }

      this.map.on("locationfound", (e) => {
        let { lat, lng } = e.latlng;
        this.pendingCoords = [lat, lng];
        const mapStore = useMapStore(); // Access the Pinia store
        if (this.hasPermissionToMark) {
          mapStore.setOriginCoords(this.pendingCoords); // Call the action
        } else if (this.boundingBox.contains(this.pendingCoords)) {
          this.grantPermissionToMark();
        } else {
          this.setCenterModal(true);
        }
        console.log("Geolocation pendingCoords found: ", this.pendingCoords);
      });

      this.map.on("locationerror", (e) => {
        console.log("Geolocation error: ", e.message);
      });
    },
    callGeolocation() {
      this.setBottomModal(false);
      this.map.locate({
        enableHighAccuracy: true,
      });
    },
    grantPermissionToMark() {
      this.setCenterModal(false);
      this.hasPermissionToMark = true;
      const mapStore = useMapStore(); // Access the Pinia store
      mapStore.setOriginCoords(this.pendingCoords); // Call the action

      // Save the GPS location to localStorage
      localStorage.setItem("gpsLocation", JSON.stringify(this.pendingCoords));
      console.log("Permission to mark granted, GPS location saved:", this.pendingCoords);
    },
    forfeitPermissionToMark() {
      this.setBottomModal(false);
      this.hasPermissionToMark = false;
      const mapStore = useMapStore(); // Access the Pinia store
      mapStore.setOriginCoords(this.$defaultStartCoords); // Call the action

      // Save the default GPS location to localStorage
      localStorage.setItem("gpsLocation", JSON.stringify(this.$defaultStartCoords));
      console.log("Permission to mark forfeited, GPS location reset to default:", this.$defaultStartCoords);
    },
  },
};
</script>

<style scoped>
</style>
