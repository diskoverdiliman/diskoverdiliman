<template>
  <v-container>
    <v-btn class="primary text-black" @click="onClickNewTag">
      ADD NEW TAG
    </v-btn>
    <v-card>
      <v-card-title class="primary text-black">
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
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin"
import TagTable from "@/components/admin/TagTable.vue"; 

export default{
    mixins: [AdminVerifierMixin],
    components: {
        TagTable, // Register TagTable
    },
    data(){
        return{
            tags: null
        }
    },
    mounted(){
        this.getTags()
    },
    methods: {
        getTags() {
            this.$http.get('/tags/')
            .then(response => {
                this.tags = response.data;
                console.log("Tags successfully retrieved");
            })
            .catch(error => { // Use .catch instead of .else
                console.error("Failed to GET tags:", error);
            });
        },
        onDeleteItem(id) {
            this.$http.delete(`tags/${id}`)
            .then(response => {
                console.log("Successfully deleted item", response);
                this.getTags(); // Refresh the tags after deletion
            })
            .catch(error => { // Use .catch instead of .else
                console.error("Failed to delete item:", error);
            });
        },
        onClickNewTag() {
            this.$router.push(`/tagform/create`);
        },
        onEditItem(id) {
            this.$router.push(`/tagform/update/${id}`);
        },
    }
}
</script>