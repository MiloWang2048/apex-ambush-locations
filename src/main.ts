import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import { router } from "./libs/router";
import { createPinia } from "pinia";
import "@icon-park/vue-next/styles/index.css";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");

declare global {
  interface Window {
    _tcbEnv?: {
      TCB_ENV_ID: string;
      TCB_REGION: string;
      TCB_SERVICE_DOMAIN: string;
    };
  }
}
