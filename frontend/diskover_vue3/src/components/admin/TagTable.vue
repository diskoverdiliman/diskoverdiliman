<template>
  <v-data-table
    v-if="tags instanceof Array"
    :headers="headers"
    :items="tags"
    class="elevation-1"
  >
    <!-- Body Slot -->
    <template v-slot:body="{ items }">
      <tr v-for="tag in items" :key="tag.id">
        <td class="text-black text-center">{{ tag.name }}</td>
        <td class="text-center">
          <v-icon small class="mr-2 text-blue" @click="$emit('edit-item', tag.id)">mdi-pencil</v-icon>
          <v-icon small class="mr-2 text-red" @click="$emit('delete-item', tag.id)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    tags: {
      type: [Array],
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name', align: 'center' },
        { title: 'Actions', key: 'actions', align: 'center' },
      ],
    };
  },
};
</script>

<style scoped>
.text-black {
  color: black !important;
}
.text-bold {
  font-weight: bold !important;
}
.text-blue {
  color: #1976d2 !important; /* Vuetify primary blue */
}
.text-red {
  color: #e53935 !important; /* Vuetify error red */
}
.text-center {
  text-align: center !important;
}
</style>
