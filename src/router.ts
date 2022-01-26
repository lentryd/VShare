import { userState } from "@/plugins/firebase/auth/state";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)",
    name: "404",
    redirect: "/",
  },

  // Всякая информация
  {
    path: "/",
    name: "EmptyLayout",
    component: () => import("@/layouts/Empty.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Main.vue"),
      },
    ],
  },

  // Авторизация и т.д.
  {
    path: "/auth",
    name: "AuthLayout",
    component: () => import("@/layouts/Auth.vue"),
    children: [
      {
        path: "",
        redirect: "/auth/signIn",
      },
      {
        path: "signIn",
        name: "SignIn",
        component: () => import("@/views/auth/SignIn.vue"),
      },
      {
        path: "signUp",
        name: "SignUp",
        component: () => import("@/views/auth/SignUp.vue"),
      },
      {
        path: "resetPassword",
        name: "ResetPassword",
        component: () => import("@/views/auth/ResetPassword.vue"),
      },
    ],
    beforeEnter() {
      if (userState.value.uid) return "/app";
      else return true;
    },
  },

  // Приложение
  {
    path: "/app",
    name: "AppLayout",
    component: () => import("@/layouts/App.vue"),
    children: [
      {
        path: "",
        redirect: "/app/rooms",
      },
      {
        path: "rooms/:roomId*",
        name: "Rooms",
        component: () => import("@/views/app/Rooms.vue"),
      },
      {
        path: "addRoom",
        name: "AddRoom",
        meta: { popUp: true },
        component: () => import("@/views/app/AddRoom.vue"),
      },
      {
        path: "myCode",
        name: "MyCode",
        meta: { popUp: true },
        component: () => import("@/views/app/MyCode.vue"),
      },
      {
        path: "addUser/:userId*",
        name: "AddUser",
        meta: { popUp: true },
        component: () => import("@/views/app/AddUser.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
