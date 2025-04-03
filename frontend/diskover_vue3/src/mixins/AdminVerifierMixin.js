import { useAuthStore } from '@/stores/auth';

export default {
  created() {
    const authStore = useAuthStore(); // Access the auth store

    authStore.verifyToken()
      .then(() => {
        console.log("YOU HAVE PROVEN YOURSELF ADMIN. WELL DONE!!");
      })
      .catch(() => {
        console.log("YOU ARE NO ADMIN IN MY BOOKS!");
        this.$router.replace({ name: "unauthenticated" }); // Redirect to unauthenticated page
      });
  }
};