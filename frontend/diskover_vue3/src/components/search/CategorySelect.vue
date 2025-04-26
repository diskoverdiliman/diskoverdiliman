<template>
  <!-- selection input with multiple category chips -->
  <div id="category-select">
    <v-select
      :items="categories"
      item-text="name"
      item-value="id"
      v-model="selectedCategory"
      label="Category"
      @change="applyCategoryFilter"
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

    // Access categoryNames from the main store
    const categories = computed(() => mainStore.categoryNames);

    const selectedCategory = computed({
      get: () => searchStore.categoryFilter,
      set: (value) => searchStore.setCategoryFilter(value),
    });

    const applyCategoryFilter = () => {
      searchStore.fetchResults();
    };

    return {
      categories,
      selectedCategory,
      applyCategoryFilter,
    };
  },
};
</script>

<style scoped>
</style>
