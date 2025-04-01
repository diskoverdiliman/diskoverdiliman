<template>
  <v-container>
    <v-btn class="primary text-black" @click="onClickNewCategory">
      ADD NEW CATEGORY
    </v-btn>
    <v-card>
      <v-card-title class="primary text-black">
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
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin"
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
    getCategories() {
      this.$http
        .get("/categories/")
        .then((response) => {
          this.categories = response.data;
          console.log("Categories successfully retrieved");
        })
        .catch((error) => {
          console.log("Failed to GET categories");
          console.log(error);
        });
    },
    onClickNewCategory() {
      this.$router.push(`/categoryform/create`);
    },
    onEditItem(id) {
      this.$router.push(`/categoryform/update/${id}`);
    },
    onDeleteItem(id) {
      this.$http
        .delete(`categories/${id}`)
        .then((response) => {
          console.log("Successfully deleted item", response);
          this.getCategories();
        })
        .catch((error) => {
          console.log("Failed to delete item", error);
        });
    },
  },
};
</script>