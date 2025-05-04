<template>
  <!-- Card for showing a location search result, shadow effect on hover -->
  <v-hover v-slot="{ isHovering }">
  <v-card
    class="secondary-bg my-2 overflow-hidden"
    :class="`elevation-${isHovering ? 12 : 2}`"
    :to="`/map/details/${result.id}`"
  >
    <v-row wrap>
      <v-col cols="3">
        <v-img contain height="70px" :src="thumbnailUrl" />
      </v-col>
      <v-col cols="9">
        <v-card-title class="title">{{ result.name }}</v-card-title>
      </v-col>
      <v-col cols="12">
        <v-card-text class="custom">
          <div ref="desc">{{ result.description }}</div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</v-hover>
</template>

<script>
import defaultThumbnail from '@/assets/no-thumbnail.jpg';

export default {
  props: {
    // parent component specifies the result to display
    result: {
      type: Object
    }
  },
  data() {
    return {
      // default thumbnail to use in case result doesn't have an image
      defaultThumbnail
    };
  },
  // called when card is ready for rendering
  mounted() {
    // clamps the description text to a maximum of two lines; truncates with ellipsis
    $clamp(this.$refs.desc, { clamp: 2 });
  },
  computed: {
    // complete the full thumbnail url using the backend static path and the thumbnail url
    thumbnailUrl() {
      return this.result.thumbnail_url
        ? `${this.$backendStaticPath}/images/locations/${this.result.thumbnail_url}`
        : '/assets/no-thumbnail.jpg'; // Adjust the path as needed
    }
  }
};
</script>

<style scoped>
</style>
