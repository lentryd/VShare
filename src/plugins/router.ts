import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)",
    name: "404",
    redirect: "/",
  },

  {
    path: "/",
    name: "App",
    component: () => import("@/views/Main.vue"),
  },

  {
    path: "/history/:id*",
    name: "History",
    component: () => import("@/views/History.vue"),
  },

  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
  },

  {
    path: "/signIn",
    name: "SignIn",
    meta: { hideBar: true, inverseTransition: true, onlyAnonymous: true },
    component: () => import("@/views/SignIn.vue"),
  },

  {
    path: "/signUp",
    name: "SignUp",
    meta: { hideBar: true, inverseTransition: true, onlyAnonymous: true },
    component: () => import("@/views/SignUp.vue"),
  },

  {
    path: "/resetPassword",
    name: "ResetPassword",
    meta: { hideBar: true, inverseTransition: true, onlyAnonymous: true },
    component: () => import("@/views/ResetPassword.vue"),
  },
];

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
