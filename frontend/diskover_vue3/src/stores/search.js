import { defineStore } from 'pinia';
import axios from 'axios';
import { getVueApp } from "@/main.js";

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchFilter: '',
    categoryFilter: '',
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
        this.updateCategoryAndTagNames(); // Update categoryNames and tagNames
        console.log('categoryNames:', this.categoryNames);
        console.log('tagNames:', this.tagNames);
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
    },
    setCategoryFilter(category) {
      this.categoryFilter = category;
    },
    setPageNumber(page) {
      this.pageNumber = page;
    },
    setApiQuery(query) {
      this.apiQuery = query;
    },
    resetAll() {
      this.searchFilter = '';
      this.categoryFilter = '';
      this.pageNumber = 1;
      this.apiQuery = {};
      this.results = [];
      this.totalResultCount = 0;
      this.maxPages = 0;
      this.categoryNames = [];
      this.tagNames = [];
    },
    updateCategoryAndTagNames() {
      // Extract unique category names
      const categories = new Set();
      const tags = new Set();

      this.results.forEach(result => {
        if (result.category) {
          categories.add(result.category);
        }
        if (result.tags && Array.isArray(result.tags)) {
          result.tags.forEach(tag => tags.add(tag));
        }
      });

      this.categoryNames = Array.from(categories).sort(); // Convert to array and sort
      this.tagNames = Array.from(tags).sort(); // Convert to array and sort
    }
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
        result => result.marker_icon ? `${getVueApp().config.globalProperties.$backendStaticPath}images/markers/${result.marker_icon}` : null
      ) : [];
    }
  }
});
