// src/stores/index.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useMainStore = defineStore('main', {
  state: () => ({
    categoriesState: [], // Array to store category data
    tagsState: [],       // Array to store tag data
    isSideDrawerVisible: true,
    previousPage: null, // Add previousPage to track the last visited page
  }),
  actions: {
    setCategories(categories) {
      this.categoriesState = categories; // Use spread operator to ensure reactivity
    },
    setTags(tags) {
      this.tagsState = tags; // Use spread operator to ensure reactivity
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
    categories: (state) => state.categoriesState,
    tags: (state) => state.tagsState,
    categoryNames: (state) => state.categoriesState.map((cat) => cat.name), // Extract the name property
    tagNames: (state) => state.tagsState.map((tag) => tag.name), // Extract the name property
    hasCategoriesLoaded: (state) => state.categoriesState && state.categoriesState.length !== 0,
  },
});

// Ensure Axios is globally available
export default {
  install: (app) => {
    app.config.globalProperties.$http = axios;
  },
};
