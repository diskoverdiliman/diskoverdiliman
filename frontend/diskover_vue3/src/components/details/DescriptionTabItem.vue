<template>
  <!-- Tab item for displaying the current location description  -->
  <v-card color="secondary">
    <v-container>
      <span class="body-1">{{ description }}</span>
    </v-container>
  </v-card>
</template>

<script>
import { defineComponent, toRefs } from "vue";

export default defineComponent({
  name: "DescriptionTabItem",
  props: {
    description: {
      type: String,
      default: "No description found.",
    },
  },
  setup(props) {
    // Use `toRefs` to make props reactive
    const { description } = toRefs(props);

    return {
      description,
    };
  },
});
</script>

<style scoped>
</style>
