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
import MapMixin from "@/mixins/MapMixin"
export default{
     mixins: [MapMixin],
}
</script>