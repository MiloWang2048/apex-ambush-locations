import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import { router } from "./libs/router";
import { createPinia } from "pinia";
import "@icon-park/vue-next/styles/index.css";
import { setup } from "./libs/setup";

setup();
const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
