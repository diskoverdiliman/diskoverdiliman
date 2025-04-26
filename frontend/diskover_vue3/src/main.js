import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import router from '@/router/index.js';
import { createPinia } from 'pinia';
import { setupVuePrototypes } from '@/vuePrototypes.js';
import { eventBus } from '@/eventBus'; // Use named import
import axios from './plugins/axios';
import '@/plugins/clamp.min.js'; // Import clamp.min.js

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$eventBus = eventBus; // Add the event bus to global properties
app.provide('eventBus', eventBus); // Provide the event bus

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(axios);

// Setup global properties and event bus
setupVuePrototypes(app);

// Ensure window object is available before assigning the app to it
if (typeof window !== 'undefined') {
  window.app = app;
}

app.mount('#app');

export const getVueApp = () => window.app;

export default app;