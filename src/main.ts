import './assets/main.css'
import PrimeVue from 'primevue/config';
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
app.use(PrimeVue, { ripple: true });
