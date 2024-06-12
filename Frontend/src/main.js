import axios from "axios";
// Всё для vue
import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js';
import store from './store/store';

// Рендер в HTML
createApp(App).use(router).use(store).mount('#app');
