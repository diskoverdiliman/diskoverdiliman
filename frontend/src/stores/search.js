import { defineStore } from 'pinia';
import axios from 'axios';
import { getVueApp } from "@/main.js";

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchFilter: '',
    categoryFilter: '',
    tagsFilter: [], // Add tagsFilter for tag selection
    orderingFilter: '', // Add orderingFilter for sorting
    pageNumber: 1,
    apiQuery: {},
    results: [],
    totalResultCount: 0,
    maxPages: 0,
    categoryNames: [], // To store unique category names
    tagNames: [] // To store unique tag names
  }),
  actions: {
    async fetchResults(query) {
      try {
        const response = await axios.get('/locations', { params: query });
        this.setResults(response.data.results);
        this.setMaxPages(response.data.total_pages);
        this.setTotalResultCount(response.data.count);
        return response;
      } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
      }
    },
    setResults(results) {
      this.results = results;
    },
    setMaxPages(maxPages) {
      this.maxPages = maxPages;
    },
    setTotalResultCount(count) {
      this.totalResultCount = count;
    },
    setSearchFilter(filter) {
      this.searchFilter = filter;
      this.updateApiQuery();
    },
    setCategoryFilter(category) {
      this.categoryFilter = category;
      this.updateApiQuery();
    },
    setTagsFilter(tags) {
      this.tagsFilter = tags;
      this.updateApiQuery();
    },
    setOrderingFilter(ordering) {
      this.orderingFilter = ordering;
      this.updateApiQuery();
    },
    setPageNumber(page) {
      this.pageNumber = page;
      this.updateApiQuery();
    },
    setApiQuery(query) {
      // Update the apiQuery state based on the provided query
      this.apiQuery = {
        search: query.search || '',
        category: query.category || '',
        tags: query.tags ? query.tags.split(',') : [],
        ordering: query.ordering || '',
        page: query.page || 1,
      };

      // Update individual filters based on the query
      this.searchFilter = this.apiQuery.search;
      this.categoryFilter = this.apiQuery.category;
      this.tagsFilter = this.apiQuery.tags;
      this.orderingFilter = this.apiQuery.ordering;
      this.pageNumber = parseInt(this.apiQuery.page, 10);

      // Fetch results with the updated query
      this.fetchResults(this.apiQuery);
    },
    updateApiQuery() {
      this.apiQuery = {
        search: this.searchFilter,
        category: this.categoryFilter,
        tags: this.tagsFilter.join(','), // Convert array to comma-separated string
        ordering: this.orderingFilter,
        page: this.pageNumber,
      };
      this.fetchResults(this.apiQuery); // Trigger API call with updated query
    },
    resetAll() {
      this.searchFilter = '';
      this.categoryFilter = '';
      this.tagsFilter = [];
      this.orderingFilter = '';
      this.pageNumber = 1;
      this.apiQuery = {};
      this.results = [];
      this.totalResultCount = 0;
      this.maxPages = 0;
      this.categoryNames = [];
      this.tagNames = [];
    },
  },
  getters: {
    resultIds: (state) => {
      return state.results ? state.results.map(result => result.id) : [];
    },
    resultCoords: (state) => {
      return state.results ? state.results.map(result => {
        if (result && result.lat !== undefined && result.lng !== undefined) {
          return [result.lat, result.lng];
        }
        return null;
      }).filter(coord => coord !== null) : [];
    },
    fullIconUrls: (state) => {
      return state.results ? state.results.map(
        result => result.marker_icon ? `${getVueApp().config.globalProperties.$backendStaticPath}/images/markers/${result.marker_icon}` : null
      ) : [];
    }
  }
});
