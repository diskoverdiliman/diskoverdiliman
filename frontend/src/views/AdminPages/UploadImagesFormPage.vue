<template>
  <v-container class="grey lighten-4 fill-height d-flex align-center justify-center">
    <div class="form-container">
      <!-- Current Unbinded Images -->
      <div>
        <div class="headline mb-3">Current unbinded images</div>
        <div v-for="image in unbindedImages" :key="image.id" class="mt-2">
          <div class="title">{{ image.img_url }}</div>
          <v-img :src="getFullImageUrl(image.img_url)" height="150px" contain />
        </div>
      </div>

      <!-- Upload Section -->
      <div class="mt-4">
        <div class="title">Upload unbinded images</div>
        <input
          type="file"
          ref="imageFiles"
          multiple
          @input="handleImageUploads"
          class="mt-2"
        />
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 d-flex justify-end">
        <v-btn color="success" class="mr-2" @click="handleUploadClick()" :disabled="isSubmitting">
          Upload unbinded images
        </v-btn>
        <v-btn @click="handleCancelClick()">Cancel</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import AdminVerifierMixin from "@/mixins/AdminVerifierMixin";

export default {
  mixins: [AdminVerifierMixin],
  mounted() {
    this.apiGetUnbindedImages();
  },
  data() {
    return {
      uploadedImageFiles: [],
      unbindedImages: [],
      isSubmitting: false,
    };
  },
  methods: {
    apiGetUnbindedImages() {
      this.$http
        .get(`/admin/images/`, {
          params: {
            location_id: 0,
          },
        })
        .then((response) => {
          console.log("successful retrieved images data from API: ", response.data);
          this.unbindedImages = response.data;
        })
        .catch((error) => {
          console.log("error retrieving location update/delete data from API: ", error);
        });
    },
    getFullImageUrl(imgUrl) {
      return `${this.$backendStaticPath}/images/locations/${imgUrl}`;
    },
    handleImageUploads() {
      const imageFiles = this.$refs.imageFiles.files;
      this.uploadedImageFiles = [];
      for (let i = 0; i < imageFiles.length; i++) {
        this.uploadedImageFiles.push(imageFiles[i]);
      }
    },
    handleUploadClick() {
      this.isSubmitting = true;
      let formData = new FormData();
      for (let imageFile of this.uploadedImageFiles) {
        formData.append("images", imageFile);
      }
      console.log(formData);
      this.$http
        .post(`/admin/images/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("successfully uploaded unbinded images to API", response);
          this.$router.go();
        })
        .catch(function (error) {
          alert("error uploading unbinded images to API", error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    handleCancelClick() {
      console.log("cancel");
      this.$router.go(-1);
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
  max-width: 800px; /* Limit the maximum width of the form */
}

.mt-2 {
  margin-top: 8px; /* Add spacing between elements */
}

.mt-4 {
  margin-top: 16px; /* Add larger spacing between sections */
}

.d-flex {
  display: flex; /* Enable flexbox layout */
}

.justify-end {
  justify-content: flex-end; /* Align items to the right */
}

.mr-2 {
  margin-right: 8px; /* Add spacing between buttons */
}
</style>
