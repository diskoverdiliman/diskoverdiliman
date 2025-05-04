<template>
  <v-container class="grey lighten-4 fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <!-- Form Container -->
        <div class="form-container">
          <v-row>
            <v-col cols="12" class="display-1">
              <div class="mb-4">
                Update images binded to
                <span class="display-2 primary--text">{{ locationName }}</span>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="title">Images currently binded to location</div>
              <v-row>
                <v-col
                  v-for="image in bindedImages"
                  :key="image.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="d-flex align-center justify-center"
                >
                  <v-checkbox v-model="selectedBindedImages" :value="image.id" color="primary">
                    <template #label>
                      <div class="text-center">
                        <v-img :src="getFullImageUrl(image.img_url)" height="150px" contain class="mb-2" />
                        <div>{{ image.img_url }}</div>
                      </div>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="title">Add images binded to other locations</div>
              <v-autocomplete
                v-model="locationSearchId"
                :items="locationSearchItemsWithUnbinded"
                item-title="text"
                item-value="value"
                :search-input.sync="locationSearchQuery"
                @input="apiGetLocationSearchImages"
                cache-items
                hide-selected
                auto-select-first
                clearable
                label="Location Search"
                placeholder="Search images from a location"
                :menu-props="{ zIndex: '1001' }"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div v-for="image in locationSearchImages" :key="image.id">
                <v-checkbox v-model="selectedSearchImages" :value="image.id" color="primary">
                  <div slot="label">
                    <div>{{ image.img_url }}</div>
                    <v-img :src="getFullImageUrl(image.img_url)" height="150px" contain />
                  </div>
                </v-checkbox>
              </div>
            </v-col>
          </v-row>

          <!-- Upload Section -->
          <v-row class="mt-4">
            <v-col cols="12">
              <div class="title">Upload images</div>
              <v-btn color="primary" @click="triggerFileInput" block>Choose Files</v-btn>
              <input
                type="file"
                ref="imageFiles"
                multiple
                @input="handleImageUploads"
                style="display: none;"
              />
              <div class="mt-2">{{ uploadedImageFiles.length }} file(s) selected</div>
            </v-col>
          </v-row>

          <!-- Action Buttons -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-btn color="success" @click="handleUpdateClick()" :disabled="isSubmitting" block>
                Update location images
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn @click="handleCancelClick()" block>Cancel</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";
import axios from "axios";

export default {
  mixins: [AdminVerifierMixin],
  mounted() {
    this.handleRouteChange();
  },
  data() {
    return {
      locationName: "",
      bindedImages: [],
      selectedBindedImages: [],
      locationSearchId: -1,
      locationSearchItems: [],
      locationSearchQuery: "",
      locationSearchImages: [],
      selectedSearchImages: [],
      uploadedImageFiles: [],
      isSubmitting: false,
    };
  },
  computed: {
    locationId() {
      return this.$route.params.id;
    },
    locationSearchItemsWithUnbinded() {
      return [
        ...this.locationSearchItems,
        { text: "Unbinded", value: 0 },
        { text: "None", value: -1 },
      ];
    },
    updatedImageIds() {
      return [...this.selectedBindedImages, ...this.selectedSearchImages];
    },
  },
  watch: {
    $route() {
      this.handleRouteChange();
    },
  },
  methods: {
    handleRouteChange() {
      this.apiGetLocationToUpdateImages(this.locationId);
      this.apiGetLocationSearchItems("");
    },
    apiGetLocationToUpdateImages(id) {
      axios
        .get(`/admin/locations/images/${id}`)
        .then((response) => {
          console.log("Successfully retrieved images data from API: ", response.data);
          this.locationName = response.data.name;
          this.bindedImages = response.data.images;
          this.selectedBindedImages = response.data.images.map((image) => image.id);
        })
        .catch((error) => {
          console.log("Error retrieving location update/delete data from API: ", error);
        });
    },
    apiGetLocationSearchItems(searchValue) {
      axios
        .get(`/admin/locations/`, {
          params: {
            search: searchValue,
          },
          paramsSerializer: (params) => {
            return this.$qs.stringify(params, { indices: false });
          },
        })
        .then((response) => {
          this.locationSearchItems = response.data.map((loc) => ({
            text: loc.name, // Use "text" instead of "tit"
            value: loc.id,
          }));
        })
        .catch((error) => {
          alert("Error receiving queried results from API: ");
          console.log(error);
        });
    },
    apiGetLocationSearchImages() {
      this.locationSearchQuery = null;
      this.selectedSearchImages = [];
      if (!this.locationSearchId && this.locationSearchId != 0) {
        this.locationSearchId = -1;
      }
      axios
        .get(`/admin/images/`, {
          params: { location_id: this.locationSearchId },
          paramsSerializer: (params) => {
            return this.$qs.stringify(params, { indices: false });
          },
        })
        .then((response) => {
          console.log("Successfully retrieved location search images data from API: ", response.data);
          this.locationSearchImages = response.data;
        })
        .catch((error) => {
          alert("Error receiving queried results from API: ");
          console.log(error);
        });
    },
    getFullImageUrl(imgUrl) {
      return `${this.$backendStaticPath}/images/locations/${imgUrl}`;
    },
    handleImageUploads() {
      const imageFiles = this.$refs.imageFiles.files;
      console.log("Selected files:", imageFiles);
      this.uploadedImageFiles = [];
      for (let i = 0; i < imageFiles.length; i++) {
        this.uploadedImageFiles.push(imageFiles[i]);
      }
    },
    handleUpdateClick() {
      this.isSubmitting = true;
      let formData = new FormData();
      for (let imageId of this.updatedImageIds) {
        formData.append("image_ids", imageId);
      }
      for (let imageFile of this.uploadedImageFiles) {
        formData.append("images", imageFile);
      }
      console.log(formData);
      axios
        .patch(`/admin/locations/images/${this.locationId}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Successfully patched updated location to API", response);
          this.$router.push({ name: "details", params: { id: this.locationId } });
        })
        .catch((error) => {
          alert("Error patching updated location to API", error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    handleCancelClick() {
      console.log("Cancel");
      this.$router.go(-1);
    },
    triggerFileInput() {
      this.$refs.imageFiles.click();
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

.mt-2 {
  margin-top: 8px;
}
</style>