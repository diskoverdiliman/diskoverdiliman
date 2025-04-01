// src/stores/index.js
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useDetailsStore } from './details';
import { useSearchStore } from './search';
import { useMapStore } from './map';
import axios from 'axios';

export const useMainStore = defineStore('main', {
  state: () => ({
    categories: [], // Array to store category data
    tags: [],       // Array to store tag data
    isSideDrawerVisible: true,
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
    }
  },
  getters: {
    categoryNames: (state) => state.categories.map(cat => cat.name),
    tagNames: (state) => state.tags.map(tag => cat.name),
    hasCategoriesLoaded: (state) => state.categories && state.categories.length !== 0
  }
});

// Ensure Axios is globally available
export default {
  install: (app) => {
    app.config.globalProperties.$http = axios;
  },
};
