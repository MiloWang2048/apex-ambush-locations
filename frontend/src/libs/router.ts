import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import AmbushLocationDetail from "../components/AmbushLocationDetail.vue";
import Index from "../pages/Index.vue";
import ErrorPage from "../pages/ErrorPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/error",
    component: ErrorPage,
  },
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
    component: ErrorPage,
  },
];

const router = createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes,
});

export { routes, router };
