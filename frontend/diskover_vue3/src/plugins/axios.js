import Axios from "axios"
import { createApp } from "vue"

Axios.defaults.baseURL = process.env.VUE_APP_API_URL

export default {
  install: (app) => {
    app.config.globalProperties.$http = Axios
  },
}
