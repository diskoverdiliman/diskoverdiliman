<template>
  <v-container class="grey lighten-4 fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Form Container with White Background -->
        <div class="form-container">
          <v-row>
            <!-- Name Field -->
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

            <!-- Category Dropdown -->
            <v-col cols="12">
              <label>Category</label>
              <v-select
                :items="categoryItems"
                item-title="name"
                item-value="id"
                placeholder="Category"
                color="black"
                :menu-props="{ zIndex: '1001' }"
                v-model="categoryId"
                :readonly="isReadOnly"
                :error="isReadOnly"
              />
            </v-col>

            <!-- Tags Dropdown -->
            <v-col cols="12">
              <div class="maroon-chips">
                <label>Tags</label>
                <v-select
                  :items="tagItems"
                  item-title="name"
                  item-value="value"
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

            <!-- Description Field -->
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

            <!-- Map View -->
            <v-col cols="12">
              <FormMapView
                height="300px"
                @click="handleMapClick"
                :defaultFormCoords="defaultCoords"
                :readonly="isReadOnly"
              />
              <v-btn @click="resetMapView" class="mt-2">Reset Map</v-btn>
            </v-col>

            <!-- Coordinates Field -->
            <v-col cols="12">
              <label>LatLng (Click on the map to set):</label>
              <v-text-field
                label="Coordinates"
                v-model="coordsDisplay"
              />
            </v-col>

            <!-- Subareas Dropdown -->
            <v-col cols="12">
              <div class="maroon-chips">
                <v-autocomplete
                  v-model="subareaIds"
                  :items="subareaItems"
                  item-title="text"
                  item-value="value"
                  :search-input.sync="subareaSearch"
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
                  @change="clearSubareaSearch"
                />
              </div>
            </v-col>

            <!-- Main Building Dropdown -->
            <v-col cols="12">
              <div class="maroon-chips">
                <v-autocomplete
                  v-model="mainBuildingId"
                  :items="mainBuildingItems"
                  :search-input.sync="mainBuildingSearch"
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
                  item-title="text"
                  item-value="value"
                />
              </div>
            </v-col>

            <!-- Action Buttons -->
            <v-col cols="12">
              <v-row justify="end" class="mt-4">
                <v-btn
                  v-if="mode === 'create'"
                  color="success"
                  class="mr-2"
                  @click="handleCreateClick"
                  :disabled="isSubmitting"
                >
                  Create Location
                </v-btn>
                <v-btn
                  v-else-if="mode === 'update'"
                  color="success"
                  class="mr-2"
                  @click="handleUpdateClick"
                  :disabled="isSubmitting"
                >
                  Update Location
                </v-btn>
                <v-btn
                  v-else
                  color="error"
                  class="mr-2"
                  @click="handleDeleteClick"
                  :disabled="isSubmitting"
                >
                  Delete Location
                </v-btn>
                <v-btn @click="handleCancelClick">Cancel</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import { useMainStore } from "@/stores/index.js";
import FormMapView from "@/components/map/FormMapView.vue";

export default {
  mixins: [AdminVerifierMixin],
  components: {
    FormMapView,
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
      mainBuildingId: "",
      mainBuildingSearch: "",
      mainBuildingItems: [],
      isSubmitting: false,
    };
  },
  computed: {
    categoryItems() {
      const mainStore = useMainStore();
      return mainStore.categories;
    },
    tagItems() {
      const mainStore = useMainStore();
      return mainStore.tags;
    },
    isReadOnly() {
      return this.mode === "delete";
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
      this.$eventBus.emit("reset-map-view", 15);
    },
    handleMapClick(newCoords) {
      if (Array.isArray(newCoords)) {
        this.coords = newCoords;
      }
    },
    handleRouteChange() {
      this.apiGetSubareaItems("");
      this.apiGetMainBuildingItems("");
      if (this.mode === "update" || this.mode === "delete") {
        this.getUpdateData(this.id);
      }
    },
    async getUpdateData(id) {
      try {
        const response = await axios.get(`/admin/locations/${id}`);
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
        console.error("Error retrieving location data:", error);
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
        console.error("Error retrieving subarea items:", error);
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
        console.error("Error retrieving main building items:", error);
      }
    },
    handleCancelClick() {
      this.$router.go(-1);
    },
    async handleDeleteClick() {
      this.isSubmitting = true;
      try {
        await axios.delete(`/admin/locations/${this.id}/`);
        this.$router.push(`/map/search`);
      } catch (error) {
        console.error("Error deleting location:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleCreateClick() {
      this.isSubmitting = true;
      const payload = {
        name: this.name,
        category: this.categoryId,
        tags: this.tagIds,
        description: this.description,
        lat: this.coords[0],
        lng: this.coords[1],
        subareas: this.subareaIds,
        main_building: this.mainBuildingId,
      };
      console.log("Payload for Create:", payload); // Print the payload
      try {
        const response = await axios.post(`/admin/locations/`, payload);
        this.$router.push(`/map/details/${response.data.id}`);
      } catch (error) {
        console.error("Error creating location:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleUpdateClick() {
      this.isSubmitting = true;
      const payload = {
        name: this.name,
        category: this.categoryId,
        tags: this.tagIds,
        description: this.description,
        lat: this.coords[0],
        lng: this.coords[1],
        subareas: this.subareaIds,
        main_building: this.mainBuildingId,
      };
      console.log("Payload for Update:", payload); // Print the payload
      try {
        await axios.patch(`/admin/locations/${this.id}/`, payload);
        this.$router.push(`/map/details/${this.id}`);
      } catch (error) {
        console.error("Error updating location:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    clearSubareaSearch() {
      this.subareaSearch = ""; // Clear the search input explicitly
    },
  },
};
</script>

<style scoped>
.form-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

label {
  font-weight: bold;
  font-size: 16px;
}

.maroon-chips .v-chip {
  background-color: var(--v-primary-base);
  color: white;
}
</style>