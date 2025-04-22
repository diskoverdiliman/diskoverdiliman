<template>
  <v-container class="grey lighten-4 fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8"> <!-- Adjusted width -->
        <!-- Form Container with White Background -->
        <div class="form-container">
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
                :menu-props="{zIndex:'1001'}"
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
                  :menu-props="{zIndex:'1001'}"
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
            <v-col cols="12">
              <FormMapView
                height="300px"
                @click="handleMapClick"
                :defaultFormCoords="defaultCoords"
                :readonly="isReadOnly"
              />
              <v-btn @click="resetMapView" class="mt-2">Reset Map</v-btn>
            </v-col>
            <v-col cols="12">
              <label>LatLng (Click on the map to set):</label>
              <v-text-field
                label="Coordinates"
                v-model="coordsDisplay"
              />
            </v-col>
            <v-col cols="12">
              <div class="maroon-chips">
                <v-autocomplete
                  v-model="subareaIds"
                  :items="subareaItems"
                  :search-input.sync="subareaSearch"
                  @input="subareaSearch=null"
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
                  :menu-props="{zIndex:'1001'}"
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
                  @input="mainBuildingSearch=null"
                  cache-items
                  hide-selected
                  auto-select-first
                  clearable
                  label="Main Building"
                  placeholder="Search a main building"
                  color="blue"
                  :menu-props="{zIndex:'1001'}"
                  :readonly="isReadOnly"
                  :error="isReadOnly"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <v-row justify="end" class="mt-4">
                <v-btn v-if="mode=='create'" color="success" class="mr-2" @click="handleCreateClick()" :disabled="isSubmitting">Create Location</v-btn>
                <v-btn v-else-if="mode=='update'" color="success" class="mr-2" @click="handleUpdateClick()" :disabled="isSubmitting">Update Location</v-btn>
                <v-btn v-else color="error" class="mr-2" @click="handleDeleteClick()" :disabled="isSubmitting">Delete Location</v-btn>
                <v-btn @click="handleCancelClick()">Cancel</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios"; // Import Axios
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import { useMainStore } from "@/stores/index.js";
import FormMapView from "@/components/map/FormMapView.vue"; // Import the FormMapView component

export default {
  mixins: [AdminVerifierMixin],
  components: {
    FormMapView, // Register the FormMapView component
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
      const mainStore = useMainStore();
      return mainStore.categories.map((cat) => ({
        text: cat.name,
        value: cat.id,
      }));
    },
    tagItems() {
      const mainStore = useMainStore();
      return mainStore.tags.map((tag) => ({
        text: tag.name,
        value: tag.id,
      }));
    },
    isReadOnly() {
      return this.mode == "delete" ? true : false;
    },
    id() {
      return this.$route.params.id;
    },
    mode() {
      return this.$route.params.mode;
    },
    coordsDisplay: {
      get() {
        return Array.isArray(this.coords) ? this.coords.join(", ") : "";
      },
      set(value) {
        const [lat, lng] = value.split(",").map((coord) => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          this.coords = [lat, lng];
        }
      },
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
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
      this.$eventBus.emit("reset-map-view", 15);
    },
    handleMapClick(newCoords) {
      console.log("Received coordinates:", newCoords); // Debugging
      if (Array.isArray(newCoords)) {
        this.coords = newCoords;
      } else {
        console.error("Invalid coordinates received:", newCoords); // Debugging
      }
    },
    handleRouteChange() {
      this.apiGetSubareaItems("");
      this.apiGetMainBuildingItems("");
      if (this.mode == "update" || this.mode == "delete") {
        this.getUpdateData(this.id);
      }
    },
    async getUpdateData(id) {
      try {
        const response = await axios.get(`/admin/locations/${id}`);
        console.log("Successfully retrieved location update/delete data from API:", response.data);
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
      } catch (error) {
        console.error("Error retrieving location update/delete data from API:", error);
      }
    },
    async apiGetSubareaItems(searchValue) {
      try {
        const params = searchValue ? { search: searchValue } : {};
        const response = await axios.get(`/admin/locations`, { params });
        this.subareaItems = response.data.map((sub) => ({
          text: sub.name,
          value: sub.id,
        }));
      } catch (error) {
        console.error("Error retrieving subarea items from API:", error);
      }
    },
    async apiGetMainBuildingItems(searchValue) {
      try {
        const params = searchValue ? { search: searchValue } : {};
        const response = await axios.get(`/admin/locations`, { params });
        this.mainBuildingItems = response.data.map((building) => ({
          text: building.name,
          value: building.id,
        }));
      } catch (error) {
        console.error("Error retrieving main building items from API:", error);
      }
    },
    handleCancelClick() {
      this.$router.go(-1);
    },
    async handleDeleteClick() {
      this.isSubmitting = true;
      try {
        const response = await axios.delete(`/admin/locations/${this.id}/`);
        console.log("Successfully deleted location from API:", response);
        this.$router.push(`/map/search`);
      } catch (error) {
        console.error("Error deleting location from API:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleCreateClick() {
      this.isSubmitting = true;
      try {
        const response = await axios.post(`/admin/locations/`, {
          name: this.name,
          category: this.categoryId,
          tags: this.tagIds,
          description: this.description,
          lat: this.coords[0],
          lng: this.coords[1],
          subareas: this.subareaIds,
          main_building: this.mainBuildingId,
        });
        console.log("Successfully posted new location to API:", response);
        this.$router.push(`/map/details/${response.data.id}`);
      } catch (error) {
        console.error("Error posting new location to API:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleUpdateClick() {
      this.isSubmitting = true;
      try {
        const response = await axios.patch(`/admin/locations/${this.id}/`, {
          name: this.name,
          category: this.categoryId,
          tags: this.tagIds,
          description: this.description,
          lat: this.coords[0],
          lng: this.coords[1],
          subareas: this.subareaIds,
          main_building: this.mainBuildingId,
        });
        console.log("Successfully patched updated location to API:", response);
        this.$router.push(`/map/details/${this.id}`);
      } catch (error) {
        console.error("Error patching updated location to API:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  background-color: white; /* White background for the form */
  padding: 20px; /* Add padding inside the form */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional shadow for better visibility */
  width: 100%; /* Ensure it takes the full width of the column */
}

label {
  font-weight: bold !important;
  font-size: 16px !important;
}

.maroon-chips .v-chip {
  background-color: var(--v-primary-base) !important;
  color: white;
}
</style>