<template>
  <!-- selection input with multiple category chips -->
  <div id="tag-select">
    <v-select
      v-model="tagsFilter"
      :items="tags"
      attach
      small-chips
      label="Tags"
      multiple
      clearable
      hide-details

    />
  </div>
</template>

<script>
import { useMainStore } from '@/stores/index'; // Import the main store
import { useSearchStore } from '@/stores/search';
import { computed } from 'vue';

export default {
  setup() {
    const mainStore = useMainStore(); // Access the main store
    const searchStore = useSearchStore();

    const tags = computed(() => mainStore.tagNames);

    const tagsFilter = computed({
      get() {
        return searchStore.tagsFilter;
      },
      set(value) {
        searchStore.setTagsFilter(value); // Update tagsFilter in the store
      },
    });

    return {
      tags,
      tagsFilter,
    };
  },
};
</script>

<style scoped>

</style>
