import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Import Vuetify styles

// Configure Vuetify
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light', // Set default theme
    themes: {
      light: {
        dark: false, // Explicitly define as a light theme
        colors: {  // ✅ Colors should be inside `colors`
          primary: "#D32F2F", // Darkish red
          secondary: "#FFEBEE", // Light pink
          accent: "#FFCDD2", // Pink
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi', // ✅ Use 'mdi' for Material Design Icons
  },
})

export default vuetify
