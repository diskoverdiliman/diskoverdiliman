<template>
  <!-- renders a modal anchored to the bottom, visibility controlled by myVisible -->
  <div class="text-xs-center">
    <v-bottom-sheet
      inset
      v-model="myVisible"
      class="bottom-sheet-custom"
      elevation="0"
    >
      <v-sheet class="pa-4 d-flex flex-column align-center" max-width="600px" max-height="50vh">
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
  max-height: 50vh;
  overflow: hidden;
  bottom: 20vh !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.v-sheet {
  box-shadow: none !important;
  background-color: white !important; /* or your desired color */
  border: none !important;
}
</style>
