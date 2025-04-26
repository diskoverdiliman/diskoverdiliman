<template>
  <!-- renders the location results of a search/filter query on the side drawer -->
  <div>
    <!-- headline for describing results -->
    <p class="title">{{headlineText}}</p>

    <CategorySelect class="selector"/>

    <SortSelect @change="applyRouteQueries" class="selector"/>

    <TagsSelect class="selector"/>

    <p class="subheading">{{resultCount}} results found</p>
    <!-- show 10 results a result cards in a column -->
    <v-row>
      <v-col cols="12" v-for="result in results" :key="result.id">
        <ResultCard :result="result"/>
      </v-col>
    </v-row>
    <!-- paginator for controlling page of results -->
    <ResultPaginator @change="applyRouteQueries"/>
  </div>
</template>

<script>
import { useSearchStore } from '@/stores/search';
import { useMapStore } from '@/stores/map'; // Import mapStore
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onBeforeUnmount, computed } from 'vue';
import CategorySelect from '@/components/search/CategorySelect.vue'; // Ensure the import path is correct
import SortSelect from '@/components/search/SortSelect.vue'; // Ensure the import path is correct
import TagsSelect from '@/components/search/TagsSelect.vue'; // Ensure the import path is correct
import ResultCard from '@/components/search/ResultCard.vue'; // Ensure the import path is correct
import ResultPaginator from '@/components/search/ResultPaginator.vue'; // Ensure the import path is correct

export default {
  components: {
    CategorySelect,
    SortSelect,
    TagsSelect,
    ResultCard,
    ResultPaginator
  },
  setup() {
    const searchStore = useSearchStore();
    const mapStore = useMapStore(); // Use mapStore to control the side drawer
    const router = useRouter();
    const route = useRoute();

    const applyApiQueries = () => {
      // HTTP GET Request with appropriate querystring
      searchStore.fetchResults(route.query)
        .then(response => {
          searchStore.setResults(response.data.results);
          searchStore.setMaxPages(response.data.total_pages);
          searchStore.setTotalResultCount(response.data.count);
        })
        .catch(error => {
          alert("error receiving queried results from API: ");
          console.log(error);
        });
    };

    const applyRouteQueries = () => {
      router.push({
        name: "search",
        query: searchStore.apiQuery
      });
    };

    const handleRouteChange = () => {
      searchStore.setApiQuery(route.query);
      applyApiQueries();
    };

    const handleDefaultPagination = () => {
      if (!("page" in route.query)) {
        let pagedQuery = {
          ...route.query,
          page: 1
        };
        router.replace({ name: route.name, query: pagedQuery });
      }
    };

    onMounted(() => {
      mapStore.setSideDrawer(true); // Show the side drawer by default
      handleRouteChange();
      handleDefaultPagination();
    });

    onBeforeUnmount(() => {
      searchStore.resetAll();
    });

    return {
      results: computed(() => searchStore.results), // Ensure reactivity
      resultCount: computed(() => searchStore.totalResultCount),
      headlineText: computed(() => {
        if (searchStore.searchFilter) {
          return `Showing filtered results for "${searchStore.searchFilter}"`;
        } else {
          return "Showing all filtered results";
        }
      }),
      categories: computed(() => searchStore.categoryNames),
      searchText: computed(() => searchStore.searchFilter),
      apiQuery: computed(() => searchStore.apiQuery),
      applyRouteQueries
    };
  }
};
</script>

<style scoped>
.title {
  margin-top: 5px;
  margin-bottom: 5px;
}

.subheading {
  margin-bottom: 15px;
}

.selector {
  color: black;
  background-color: white;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 0; /* Ensure no padding */
}

.selector .v-list-item {
  background-color: white;
  color: white;
}

.selector .v-list-item:hover {
  background-color: #f0f0f0 !important;
}

/* Ensure the container does not overflow horizontally */
div {
  overflow-x: hidden; /* Prevent horizontal scrolling */
  box-sizing: border-box; /* Include padding and border in the element's width */
}

/* Ensure rows and columns fit within the container */
v-row {
  margin: 0; /* Remove default margins */
  padding: 0; /* Remove default padding */
}

v-col {
  padding: 0; /* Remove padding from columns */
}

/* Ensure the selectors and other elements fit properly */
.selector {
  width: 100%; /* Ensure the selector spans the full width of its container */
  max-width: 100%; /* Prevent the selector from exceeding the container width */
  margin: 0 auto; /* Center the selector */
}

.title, .subheading {
  margin: 0; /* Remove unnecessary margins */
  padding: 0; /* Remove unnecessary padding */
  text-align: center; /* Optional: Center-align text */
}
</style>