import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import ApexMap from "./pages/ApexMap.vue";

const routes: RouteRecordRaw[] = [{ path: "/:map?", component: ApexMap }];

const router = createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes,
});

export { routes, router };
