// src/stores/index.js
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useDetailsStore } from './details';
import { useSearchStore } from './search';
import { useMapStore } from './map';

export const useMainStore = defineStore('main', {
  state: () => ({
    categories: [],
    tags: [],
    isSideDrawerVisible: true,
  }),
  actions: {
    setCategories(newCategories) {
      this.categories = newCategories;
    },
    setTags(newTags) {
      this.tags = newTags;
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
