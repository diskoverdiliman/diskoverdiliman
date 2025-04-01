<template>
  <v-container class="grey lighten-4">
    <v-row>
      <v-col cols="12">
        <label>Name</label>
        <v-text-field
          placeholder="Name"
          color="black"
          v-model="name"
          :readonly="isReadOnly"
          :error="isReadOnly"
        />
      </v-col>
      <v-col cols="12">
        <label>Category</label>
        <v-select
          :items="categoryItems"
          placeholder="Category"
          color="black"
          :menu-props="{ zIndex: '1001' }"
          v-model="categoryId"
          :readonly="isReadOnly"
          :error="isReadOnly"
        />
      </v-col>
      <v-col cols="12">
        <div class="maroon-chips">
          <label>Tags</label>
          <v-select
            :items="tagItems"
            placeholder="Tags"
            color="black"
            chips
            deletable-chips
            :menu-props="{ zIndex: '1001' }"
            multiple
            v-model="tagIds"
            :readonly="isReadOnly"
            :error="isReadOnly"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <label>Description</label>
        <v-textarea
          v-model="description"
          color="black"
          auto-grow
          placeholder="Description"
          :readonly="isReadOnly"
          :error="isReadOnly"
        />
      </v-col>
      <FormMapView
        height="300px"
        @click="handleMapClick"
        :defaultFormCoords="defaultCoords"
        :readonly="isReadOnly"
      />
      <v-col cols="12">
        <v-row justify="space-between" align="end" class="pl-2">
          <label>LatLng (Click on the map to set):</label>
          <v-btn @click="resetMapView">Reset Map</v-btn>
        </v-row>
        <v-text-field
          label="Coordinates"
          readonly
          :error="isReadOnly"
          :value="coords"
        />
      </v-col>
      <v-col cols="12">
        <div class="maroon-chips">
          <v-autocomplete
            v-model="subareaIds"
            :items="subareaItems"
            :search-input.sync="subareaSearch"
            @input="subareaSearch = null"
            multiple
            cache-items
            hide-selected
            auto-select-first
            chips
            clearable
            deletable-chips
            label="Subareas"
            placeholder="Search a subarea"
            color="blue"
            :menu-props="{ zIndex: '1001' }"
            :readonly="isReadOnly"
            :error="isReadOnly"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <div class="maroon-chips">
          <v-autocomplete
            v-model="mainBuildingId"
            :items="mainBuildingItems"
            :search-input.sync="mainBuildingSearch"
            @input="mainBuildingSearch = null"
            cache-items
            hide-selected
            auto-select-first
            clearable
            label="Main Building"
            placeholder="Search a main building"
            color="blue"
            :menu-props="{ zIndex: '1001' }"
            :readonly="isReadOnly"
            :error="isReadOnly"
          />
        </div>
      </v-col>
      <v-col cols="12">
        <v-btn
          v-if="mode == 'create'"
          color="success"
          @click="handleCreateClick()"
          :disabled="isSubmitting"
        >
          Create Location
        </v-btn>
        <v-btn
          v-else-if="mode == 'update'"
          color="success"
          @click="handleUpdateClick()"
          :disabled="isSubmitting"
        >
          Update Location
        </v-btn>
        <v-btn
          v-else
          color="error"
          @click="handleDeleteClick()"
          :disabled="isSubmitting"
        >
          Delete Location
        </v-btn>
        <v-btn @click="handleCancelClick()">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { inject } from "vue";
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import { useMainStore } from "@/stores/index";
import FormMapView from "@/components/map/FormMapView.vue";

export default {
  mixins: [AdminVerifierMixin],
  components: {
    FormMapView,
  },
  setup() {
    const eventBus = inject("eventBus"); // Inject the event bus
    return { eventBus };
  },
  mounted() {
    this.handleRouteChange();
    this.coords = this.defaultCoords;
  },
  data() {
    return {
      name: "",
      categoryId: "",
      tagIds: [],
      description: "",
      coords: [],
      defaultCoords: this.$defaultStartCoords,
      subareaIds: [],
      subareaSearch: "",
      subareaItems: [],
      mainBuildingId: 0,
      mainBuildingSearch: "",
      mainBuildingItems: [],
      isSubmitting: false,
    };
  },
  computed: {
    categoryItems() {
      const mainStore = useMainStore(); // Access the main store
      return mainStore.categories.map((cat) => ({
        text: cat.name,
        value: cat.id,
      }));
    },
    tagItems() {
      const mainStore = useMainStore(); // Access the main store
      return mainStore.tags.map((tag) => ({
        text: tag.name,
        value: tag.id,
      }));
    },
    isReadOnly() {
      return this.mode == "delete";
    },
    id() {
      return this.$route.params.id;
    },
    mode() {
      return this.$route.params.mode;
    },
  },
  watch: {
    $route() {
      this.handleRouteChange();
    },
    subareaSearch(newSearch) {
      this.apiGetSubareaItems(newSearch);
    },
    mainBuildingSearch(newSearch) {
      this.apiGetMainBuildingItems(newSearch);
    },
  },
  methods: {
    resetMapView() {
      this.eventBus.emit("reset-map-view", 15); // Emit the event
    },
    handleMapClick(newCoords) {
      this.coords = newCoords;
    },
    handleRouteChange() {
      this.apiGetSubareaItems("");
      this.apiGetMainBuildingItems("");
      if (this.mode == "update" || this.mode == "delete") {
        this.getUpdateData(this.id);
      }
    },
    getUpdateData(id) {
      this.$http
        .get(`/admin/locations/${id}`)
        .then((response) => {
          const {
            name,
            category,
            tags,
            description,
            lat,
            lng,
            subareas,
            main_building,
          } = response.data;
          this.name = name;
          this.categoryId = category;
          this.tagIds = tags;
          this.description = description;
          this.defaultCoords = [lat, lng];
          this.coords = [lat, lng];
          this.subareaIds = subareas;
          this.mainBuildingId = main_building;
        })
        .catch((error) => {
          console.error("Error retrieving location data:", error);
        });
    },
    apiGetSubareaItems(searchValue) {
      this.$http
        .get(`/admin/locations`, {
          params: { search: searchValue },
        })
        .then((response) => {
          this.subareaItems = response.data.map((sub) => ({
            text: sub.name,
            value: sub.id,
          }));
        })
        .catch((error) => {
          console.error("Error fetching subarea items:", error);
        });
    },
    apiGetMainBuildingItems(searchValue) {
      this.$http
        .get(`/admin/locations`, {
          params: { search: searchValue },
        })
        .then((response) => {
          this.mainBuildingItems = response.data.map((building) => ({
            text: building.name,
            value: building.id,
          }));
        })
        .catch((error) => {
          console.error("Error fetching main building items:", error);
        });
    },
    handleCancelClick() {
      this.$router.go(-1);
    },
    handleDeleteClick() {
      this.isSubmitting = true;
      this.$http
        .delete(`/admin/locations/${this.id}/`)
        .then(() => {
          this.$router.push(`/map/search`);
        })
        .catch((error) => {
          console.error("Error deleting location:", error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    handleCreateClick() {
      this.isSubmitting = true;
      this.$http
        .post(`/admin/locations/`, {
          name: this.name,
          category: this.categoryId,
          tags: this.tagIds,
          description: this.description,
          lat: this.coords[0],
          lng: this.coords[1],
          subareas: this.subareaIds,
          main_building: this.mainBuildingId,
        })
        .then((response) => {
          this.$router.push(`/map/details/${response.data.id}`);
        })
        .catch((error) => {
          console.error("Error creating location:", error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    handleUpdateClick() {
      this.isSubmitting = true;
      this.$http
        .patch(`/admin/locations/${this.id}/`, {
          name: this.name,
          category: this.categoryId,
          tags: this.tagIds,
          description: this.description,
          lat: this.coords[0],
          lng: this.coords[1],
          subareas: this.subareaIds,
          main_building: this.mainBuildingId,
        })
        .then(() => {
          this.$router.push(`/map/details/${this.id}`);
        })
        .catch((error) => {
          console.error("Error updating location:", error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>

<style scoped>
label {
  font-weight: bold !important;
  font-size: 16px !important;
}

.maroon-chips .v-chip {
  background-color: var(--v-primary-base) !important;
  color: white;
}
</style>
