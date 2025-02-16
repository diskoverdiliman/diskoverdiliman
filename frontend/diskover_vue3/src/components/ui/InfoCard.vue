<template>
  <!-- Card used in homepage for displaying info -->
  <!-- Has dark red header and light pink body -->
  <!-- Has shadow effect on hover and ripple effect on click -->
  <v-hover v-slot:default="{ isHovering }">
    <v-card
      :ripple="ripple"
      class="panel-card"
      :class="`elevation-${isHovering ? 12 : 2}`"
    >
      <v-card-title class="text-white pa-3 title-background">
        <slot name="title"></slot>
      </v-card-title>
      <div class="panel-content secondary">
        <slot name="content"></slot>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  // lets parent component specify if it wants ripple effect or not
  props: ["ripple"]
};
</script>

<style scoped>
.panel-card {
  display: flex;
  flex-flow: column;
}

.panel-content {
  height: 100%;
  background-color: #ffe6e6 !important;
}

.title-background {
  background-color: #7b1113 !important;
}
</style>
