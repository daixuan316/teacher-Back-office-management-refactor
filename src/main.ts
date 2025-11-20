import "./assets/main.css";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.mount("#app");
