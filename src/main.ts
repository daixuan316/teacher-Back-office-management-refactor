import "./assets/main.css";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(pinia);
app.use(router);
app.mount("#app");
