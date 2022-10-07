import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import AmbushLocationDetail from "./components/AmbushLocationDetail.vue";
import ApexMap from "./pages/ApexMap.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/:map?",
    component: ApexMap,
    children: [
      {
        path: "location/:locationId",
        component: AmbushLocationDetail,
        props: true,
      },
      {
        path: "location",
        redirect: "", // redirect to parent route
      },
    ],
  },
];

const router = createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes,
});

export { routes, router };
