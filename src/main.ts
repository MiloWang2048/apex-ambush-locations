import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");

declare global {
  interface Window {
    _tcbEnv?: {
      TCB_ENV_ID: string;
      TCB_REGION: string;
      TCB_SERVICE_DOMAIN: string;
    };
  }
}
