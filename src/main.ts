import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import { router } from "./router";

declare global {
  interface Window {
    _tcbEnv?: {
      TCB_ENV_ID: string;
      TCB_REGION: string;
      TCB_SERVICE_DOMAIN: string;
    };
  }
}

createApp(App).use(router).mount("#app");
