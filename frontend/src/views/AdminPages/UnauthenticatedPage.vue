<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <v-icon size="100" class="mb-4" color="primary">mdi-lock-alert</v-icon>
    <h1 class="text-h4 font-weight-bold">Admin Access Required</h1>
    <p class="text-body-1 mt-2 mb-6">
      Sorry, the page you are trying to access is for admin users only.
    </p>
    <div class="d-flex gap-4">
      <v-btn color="primary" to="/login" variant="flat">Login Page</v-btn>
      <v-btn color="secondary" to="/" variant="flat">Home Page</v-btn>
    </div>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
.gap-4 {
  gap: 16px;
}
</style>
