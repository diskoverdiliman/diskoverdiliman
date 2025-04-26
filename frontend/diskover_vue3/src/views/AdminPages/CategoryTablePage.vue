<template>
  <v-container>
    <!-- Add New Category Button -->
    <v-btn class="text-white mb-2" @click="onClickNewCategory" style="background-color: #7b1113;">
      ADD NEW CATEGORY
    </v-btn>

    <!-- Categories Card -->
    <v-card>
      <v-card-title class="text-white" style="background-color: #7b1113;">
        <h1>Categories</h1>
      </v-card-title>
      <v-layout>
        <v-col>
          <CategoryTable v-on:edit-item="onEditItem" v-on:delete-item="onDeleteItem" :categories="categories" />
        </v-col>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'; // Import Axios
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import CategoryTable from "@/components/admin/CategoryTable.vue"; // Adjust the path as needed

export default {
  mixins: [AdminVerifierMixin],
  components: {
    CategoryTable, // Register CategoryTable
  },
  data() {
    return {
      categories: null,
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get("/admin/categories/"); // Use Axios to fetch categories
        this.categories = response.data;
        console.log("Categories successfully retrieved");
      } catch (error) {
        console.error("Failed to GET categories", error);
      }
    },
    onClickNewCategory() {
      this.$router.push(`/categoryform/create`);
    },
    onEditItem(id) {
      this.$router.push(`/categoryform/update/${id}`);
    },
    async onDeleteItem(id) {
      try {
        const response = await axios.delete(`/admin/categories/${id}/`); // Use Axios to delete a category
        console.log("Successfully deleted item", response);
        this.getCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Failed to delete item", error);
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Add reusable CSS classes */
.button-maroon {
  background-color: #7b1113 !important;
  color: black !important;
}

.title-maroon {
  background-color: #7b1113 !important;
  color: black !important;
}
</style>