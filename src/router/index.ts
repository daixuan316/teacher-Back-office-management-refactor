import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
