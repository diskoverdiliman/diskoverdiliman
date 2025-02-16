<template>
  <!-- renders a modal anchored to the bottom, visibility controlled by myVisible -->
  <div class="text-xs-center">
    <v-bottom-sheet inset v-model="myVisible" class="bottom-sheet-custom">
      <v-sheet class="pa-4" max-width="600px" max-height="50vh"> <!-- Set max-width and max-height -->
        <slot></slot>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  // isVisible prop allows parent component to control modal visibility
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    myVisible: {
      get() {
        return this.isVisible;
      },
      set(value) {
        this.$emit('update:isVisible', value);
      }
    }
  }
};
</script>

<style scoped>
.bottom-sheet-custom {
  max-height: 50vh; /* Adjust the height as needed */
  overflow: hidden; /* Remove scroll bars */
  bottom: 20vh !important; /* Adjust the bottom position to move it up */
}
</style>
