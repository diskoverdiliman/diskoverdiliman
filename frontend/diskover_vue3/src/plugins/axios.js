import axios from "axios"

axios.defaults.baseURL = process.env.VITE_APP_API_URL

export default {
  install: (app) => {
    app.config.globalProperties.$http = axios
  },
}
