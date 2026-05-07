import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { i18n } from './locales';
import { useThemeStore } from './stores/theme';

import './assets/css/index.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);

// 初始化主题（store 内的 watch immediate 会自动同步 <html> class）
useThemeStore(pinia);

app.mount('#app');
