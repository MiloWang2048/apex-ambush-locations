import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import AmbushLocationDetail from "../components/AmbushLocationDetail.vue";
import Index from "../pages/Index.vue";
import NotFound from "../pages/NotFound.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/:map?",
    component: Index,
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
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes,
});

export { routes, router };
