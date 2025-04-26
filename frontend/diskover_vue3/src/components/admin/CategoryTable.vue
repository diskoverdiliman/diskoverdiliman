<template>
  <v-data-table
    v-if="categories instanceof Array"
    :headers="headers"
    :items="categories"
    class="elevation-1"
  >
    <!-- Body Slot -->
    <template v-slot:body="{ items }">
      <tr v-for="category in items" :key="category.id">
        <td class="text-black text-center">{{ category.name }}</td>
        <td class="text-black text-center">{{ category.url }}</td>
        <td class="text-center">
          <!-- Rectangle for Route Color -->
          <div
            class="route-color-box"
            :style="{ backgroundColor: category.route_color }"
          ></div>
        </td>
        <td class="text-center">
          <v-icon small class="mr-2 text-blue" @click="$emit('edit-item', category.id)">mdi-pencil</v-icon>
          <v-icon small class="mr-2 text-red" @click="$emit('delete-item', category.id)">mdi-delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    categories: {
      type: [Array],
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { title: 'Name', key: 'name', align: 'center' },
        { title: 'URL', key: 'url', align: 'center' },
        { title: 'Route Color', key: 'route_color', align: 'center' },
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
.route-color-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: inline-block;
}
.text-center {
  text-align: center !important;
}
</style>