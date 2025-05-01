<template>
  <v-container>
    <!-- Add New Tag Button -->
    <v-btn class="text-white mb-2" @click="onClickNewTag" style="background-color: #7b1113;">
      ADD NEW TAG
    </v-btn>

    <!-- Tags Card -->
    <v-card>
      <v-card-title class="text-white" style="background-color: #7b1113;">
        <h1>Tags</h1>
      </v-card-title>
      <v-layout>
        <v-col>
          <TagTable v-on:delete-item="onDeleteItem" v-on:edit-item="onEditItem" :tags="tags" />
        </v-col>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"; // Import Axios
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import TagTable from "@/components/admin/TagTable.vue";

export default {
  mixins: [AdminVerifierMixin],
  components: {
    TagTable, // Register TagTable
  },
  data() {
    return {
      tags: null,
    };
  },
  mounted() {
    this.getTags();
  },
  methods: {
    async getTags() {
      try {
        const response = await axios.get("/admin/tags/"); // Use Axios to fetch tags
        this.tags = response.data;
        console.log("Tags successfully retrieved");
      } catch (error) {
        console.error("Failed to GET tags", error);
      }
    },
    async onDeleteItem(id) {
      try {
        const response = await axios.delete(`/admin/tags/${id}/`); // Use Axios to delete a tag
        console.log("Successfully deleted item", response);
        this.getTags(); // Refresh the tags list
      } catch (error) {
        console.error("Failed to delete item", error);
      }
    },
    onClickNewTag() {
      this.$router.push(`/tagform/create`);
    },
    onEditItem(id) {
      this.$router.push(`/tagform/update/${id}`);
    },
  },
};
</script>

<style scoped>
/* Optional: Add reusable CSS classes */
.button-maroon {
  background-color: #7b1113 !important;
  color: white !important;
}

.title-maroon {
  background-color: #7b1113 !important;
  color: white !important;
}
</style>