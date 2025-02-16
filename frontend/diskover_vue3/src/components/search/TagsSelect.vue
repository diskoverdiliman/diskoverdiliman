<template>
  <!-- selection input with multiple category chips -->
  <div id="tag-select">
    <v-select
      v-model="tagsFilter"
      :items="tags"
      attach
      small-chips
      label="Tags"
      multiple
      clearable
      hide-details

    />
  </div>
</template>

<script>
import { useSearchStore } from '@/stores/search';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const searchStore = useSearchStore();
    const router = useRouter();

    const tags = computed(() => searchStore.tagNames);
    const apiQuery = computed(() => searchStore.apiQuery);

    const tagsFilter = computed({
      get() {
        return searchStore.tagsFilter;
      },
      set(value) {
        searchStore.setTagsFilter(value);
        searchStore.setPageNumber(1);
        router.push({
          name: "search",
          query: apiQuery.value
        });
      }
    });

    return {
      tags,
      tagsFilter
    };
  }
};
</script>

<style scoped>

</style>
