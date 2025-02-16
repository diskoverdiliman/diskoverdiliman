<template>
  <!-- Floating Button used to control sideDrawer visibility -->
  <v-btn
    v-show="checkSideDrawer"
    absolute
    dark
    fab
    small
    :style="extraStyle"
    color="#7b1113" 
    class="floating-btn"
    @click="toggleSideDrawer"
  >
    <v-icon>{{ icon }}</v-icon> <!-- Use mdi-arrow-right for the right-pointing icon -->
  </v-btn>
</template>

<script>
import { computed, inject } from 'vue';
import { useDisplay } from 'vuetify';
import { useMapStore } from '@/stores/map';

export default {
  // lets parent component specify which component button is attached to
  props: {
    attachedTo: {
      type: String,
      default: "map"
    }
  },
  setup(props) {
    const { mdAndUp } = useDisplay();
    const mapStore = useMapStore();
    const eventBus = inject('eventBus'); // Inject the eventBus

    const isOnMap = computed(() => {
      return props.attachedTo === "map";
    });

    const checkSideDrawer = computed(() => {
      if (isOnMap.value) {
        // only show map button ">" if sideDrawer is tucked in
        return !mapStore.isSideDrawerVisible;
      } else {
        // only show drawer button "<" if sideDrawer is tucked out
        return mapStore.isSideDrawerVisible;
      }
    });

    const extraStyle = computed(() => {
      return {
        right: isOnMap.value ? "auto" : "-28px",
        left: isOnMap.value ? "0%" : "auto" // Adjust this value to position the button on the left side
      };
    });

    const icon = computed(() => {
      return isOnMap.value ? "mdi-arrow-right" : "mdi-arrow-left";
    });

    const toggleSideDrawer = () => {
      eventBus.emit("toggle-side-drawer");
    };

    return {
      mdAndUp,
      mapStore,
      eventBus,
      isOnMap,
      checkSideDrawer,
      extraStyle,
      icon,
      toggleSideDrawer
    };
  }
};
</script>

<style scoped>
.floating-btn {
  z-index: 1002 !important;
  top: 50%; /* Center the button vertically */
  transform: translateY(-50%); /* Adjust for centering */
  border-radius: 50%; /* Make the button circular */
  width: 70px; /* Set a fixed width */
  height: 70px; /* Set a fixed height */
  scale: 0.75;
}
</style>
