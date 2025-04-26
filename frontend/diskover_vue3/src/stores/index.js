// src/stores/index.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useMainStore = defineStore('main', {
  state: () => ({
    categories: [], // Array to store category data
    tags: [],       // Array to store tag data
    isSideDrawerVisible: true,
    previousPage: null, // Add previousPage to track the last visited page
  }),
  actions: {
    setCategories(categories) {
      this.categories = categories;
    },
    setTags(tags) {
      this.tags = tags;
    },
    setSideDrawer(isVisible) {
      this.isSideDrawerVisible = isVisible;
    },
    setPreviousPage(path) {
      // Guard to prevent storing the login page
      if (path === '/login') {
        return;
      }
      this.previousPage = path;
    },
  },
  getters: {
    categoryNames: (state) => state.categories.map((cat) => cat.name), // Extract the name property
    tagNames: (state) => state.tags.map((tag) => tag.name), // Extract the name property
    hasCategoriesLoaded: (state) => state.categories && state.categories.length !== 0,
  },
});

// Ensure Axios is globally available
export default {
  install: (app) => {
    app.config.globalProperties.$http = axios;
  },
};
