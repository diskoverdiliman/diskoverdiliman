<template>
  <!-- selection input with multiple category chips -->
  <div id="category-select">
    <v-select
      :items="categories"
      v-model="selectedCategory"
      label="Category"
      @change="applyCategoryFilter"
      clearable
      hide-details
    />
  </div>
</template>

<script>
import { useSearchStore } from '@/stores/search';
import { computed } from 'vue';

export default {
  setup() {
    const searchStore = useSearchStore();

    const categories = computed(() => searchStore.categoryNames);
    const selectedCategory = computed({
      get: () => searchStore.categoryFilter,
      set: (value) => searchStore.setCategoryFilter(value)
    });

    const applyCategoryFilter = () => {
      searchStore.fetchResults();
    };

    return {
      categories,
      selectedCategory,
      applyCategoryFilter
    };
  }
};
</script>

<style scoped>

</style>
