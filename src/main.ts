import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";

declare global {
  interface Window {
    _tcbEnv?: {
      TCB_ENV_ID: string;
      TCB_REGION: string;
      TCB_SERVICE_DOMAIN: string;
    };
  }
}

createApp(App).mount("#app");
