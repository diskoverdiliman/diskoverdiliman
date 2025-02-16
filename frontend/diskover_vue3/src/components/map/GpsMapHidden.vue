<template>
  <!-- GPS permission modals and hidden map for making GPS queries -->
  <div>
    <!-- Center modal for asking for GPS permission -->
    <CenterModal :isVisible="isBottomModalVisible" @close="setBottomModal(false)">
      <v-row class="red lighten-4" align="center" justify="center">
        <div class="display-1 pt-3">{{ gpsQuestionText }}</div>
        <v-row class="pt-4" justify="end"> <!-- Added justify="end" to align buttons to the right -->
          <!-- call for geolocation when Yes is clicked -->
          <v-btn color="blue" dark @click="callGeolocation" class="mx-2">Yes</v-btn> <!-- Added margin-x to add space between buttons -->
          <!-- forefeit geolocation permissions when No is clicked -->
          <v-btn color="red" dark @click="forfeitPermissionToMark" class="mx-2">No</v-btn> <!-- Added margin-x to add space between buttons -->
        </v-row>
      </v-row>
    </CenterModal>
    <!-- hidden GPS map -->
    <div id="hidden-map" :style="{display: 'none'}"></div>
    <!-- Center modal for confirming GPS permission despite proximity from UP diliman -->
    <CenterModal :isVisible="isCenterModalVisible" @close="setCenterModal(false)">
      <v-row class="red lighten-4 text-xs-center" align-content="space-around">
        <v-col class="headline amber lighten-4 py-3">
          Your current location doesn't appear to be in UP Diliman
        </v-col>
        <v-col class="title pt-2">Continue GPS anyway?</v-col>
        <v-row justify="end" class="pt-4"> <!-- Added justify="end" to align buttons to the right -->
          <!-- confirm geolocation marking permissions when Yes is clicked -->
          <v-btn color="blue" dark @click="grantPermissionToMark" class="mx-2">Yes</v-btn> <!-- Added margin-x to add space between buttons -->
          <!-- abstain from granting geolocation marking permissions if No is clicked -->
          <v-btn color="red" dark @click="setCenterModal(false)" class="mx-2">No</v-btn> <!-- Added margin-x to add space between buttons -->
        </v-row>
      </v-row>
    </CenterModal>
  </div>
</template>

<script>
import { defineComponent, computed, inject } from 'vue';
import { useMapStore } from '@/stores/map';
import MapMixin from "@/mixins/MapMixin";
import CenterModal from '@/components/ui/CenterModal.vue'; // Import the CenterModal component

export default defineComponent({
  mixins: [MapMixin],
  components: {
    CenterModal
  },
  data() {
    return {
      isBottomModalVisible: false,
      isCenterModalVisible: false,
      pendingCoords: this.$defaultStartCoords,
      boundingBox: L.latLngBounds(this.$defaultUpBoundingBox)
    };
  },
  computed: {
    hasPermissionToMark: {
      get() {
        return this.mapStore.isGpsPermissionToMark;
      },
      set(value) {
        this.mapStore.setGpsPermissionToMark(value);
      }
    },
    gpsQuestionText() {
      return this.hasPermissionToMark
        ? "Would you like to continue using GPS marker?"
        : "Would you like to use GPS to mark your location?";
    }
  },
  mounted() {
    this.initGeolocationCallbacks();
    const eventBus = inject('eventBus'); // Inject the eventBus
    eventBus.on("open-gps-bottom-modal", () => {
      console.log("Received open-gps-bottom-modal event"); // Add a console log to verify the event reception
      this.setBottomModal(true);
    });
    eventBus.on("call-geolocation", this.callGeolocation);
  },
  methods: {
    setBottomModal(value) {
      this.isBottomModalVisible = value;
    },
    setCenterModal(value) {
      this.isCenterModalVisible = value;
    },
    initGeolocationCallbacks() {
      this.map.on("locationfound", e => {
        let { lat, lng } = e.latlng;
        this.pendingCoords = [lat, lng];
        if (this.hasPermissionToMark) {
          this.mapStore.setOriginCoords(this.pendingCoords);
        } else if (this.boundingBox.contains(this.pendingCoords)) {
          this.grantPermissionToMark();
        } else {
          this.setCenterModal(true);
        }
        console.log("geolocation pendingCoords found: ", this.pendingCoords);
      });
      this.map.on("locationerror", e => {
        console.log("geolocation error: ", e.message);
      });
    },
    callGeolocation() {
      this.setBottomModal(false);
      this.map.locate({
        enableHighAccuracy: true
      });
    },
    grantPermissionToMark() {
      this.setCenterModal(false);
      this.hasPermissionToMark = true;
      this.mapStore.setOriginCoords(this.pendingCoords);
      console.log("permission to mark granted");
    },
    forfeitPermissionToMark() {
      this.setBottomModal(false);
      this.hasPermissionToMark = false;
      this.mapStore.setOriginCoords(this.$defaultStartCoords);
    }
  },
  setup() {
    const mapStore = useMapStore();
    return { mapStore };
  }
});
</script>

<style scoped>
</style>
