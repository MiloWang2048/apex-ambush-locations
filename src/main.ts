import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import ApexMap from "./components/ApexMap.vue";
import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

declare global {
  interface Window {
    _tcbEnv?: {
      TCB_ENV_ID: string;
      TCB_REGION: string;
      TCB_SERVICE_DOMAIN: string;
    };
  }
}

const routes: RouteRecordRaw[] = [{ path: "/:map?", component: ApexMap }];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
