<template>
  <div class="search-bar-container">
    <v-text-field
      class="nav-search"
      label="Where to?"
      placeholder="Search away!"
      solo
      hide-details
      v-model="searchText"
      @keyup.enter="emitSearch"
    >
      <template #append-inner>
        <v-btn @click="emitSearch" class="search-btn" icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { useMapStore } from '@/stores/map';
import { useSearchStore } from '@/stores/search';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  setup() {
    const mapStore = useMapStore();
    const searchStore = useSearchStore();
    const searchText = ref(""); // Define searchText as a ref
    const router = useRouter(); // Use useRouter to get the router instance

    const apiQuery = computed(() => searchStore.apiQuery);

    const emitSearch = () => {
      if (!searchText.value.trim()) {
        console.warn("Search query is empty!");
        return; // Prevent empty search
      }

      console.log("Search submitted:", searchText.value);

      mapStore.setSideDrawer(true);
      searchStore.setSearchFilter(searchText.value);
      searchStore.setPageNumber(1);

      // Ensure we navigate with an updated query
      setTimeout(() => {
        router.push({
          path: "/map/search",
          query: { ...apiQuery.value }
        });
      }, 100); // Delay to ensure state updates
    };

    // Debugging: Log changes to apiQuery
    watch(apiQuery, (newQuery) => {
      console.log("Updated apiQuery:", newQuery);
    });

    return {
      searchText,
      apiQuery,
      emitSearch
    };
  }
};
</script>

<style scoped>
.search-bar-container {
  display: flex;
  align-items: center;
  gap: 8px; /* Adds space between search bar and button */
}

.nav-search {
  flex: 1;
  margin: 0;
}

.search-btn {
  padding: 8px 16px;
  background-color: #7b1113; /* Updated button color */
  color: white;
  font-weight: bold;
}
</style>
