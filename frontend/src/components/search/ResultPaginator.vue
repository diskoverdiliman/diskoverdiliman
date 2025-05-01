<template>
  <!-- page buttons for navigation through result pages -->
  <v-layout justify-center id="result-paginator" class="pb-4">
    <v-pagination
      v-model="pageNumber"
      :length="maxPages"
    >
    </v-pagination>
  </v-layout>
</template>

<script>
import { useSearchStore } from '@/stores/search';
import { computed } from 'vue';

export default {
  setup(props, { emit }) {
    const searchStore = useSearchStore();

    const maxPages = computed(() => searchStore.maxPages);
    const pageNumber = computed({
      get() {
        return searchStore.pageNumber;
      },
      set(value) {
        searchStore.setPageNumber(value); // Update pageNumber in the store
      },
    });

    return {
      maxPages,
      pageNumber,
    };
  },
};
</script>

<style scoped>
/* The following styles configure the color scheme of the pagination buttons */
#result-paginator .v-pagination__item, .v-pagination__navigation {
  background-color: var(--v-secondary-base) !important;
  color: var(--v-primary-base);
}

#result-paginator .v-pagination__navigation .v-icon {
  color: var(--v-primary-base);
}

#result-paginator .v-pagination__item--active {
  background-color: var(--v-primary-base) !important;
  color: white;
}
</style>
