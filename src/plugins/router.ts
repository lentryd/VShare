import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  /**
   * Обработка несуществующих путей (просто переадресация на главную страницу).
   */
  {
    path: "/:pathMatch(.*)",
    name: "404",
    redirect: "/",
  },

  /**
   * Главная
   * Можно отправить, получить файлы и САМОЕ ГЛАВНОЕ - поддержать проект.
   */
  {
    path: "/",
    name: "App",
    component: () => import("@/views/Main.vue"),
  },

  /**
   * История
   * Можно просмотреть историю отправленных файлов.
   * Узнать какие файлы еще отправляются.
   */
  {
    path: "/history/:id*",
    name: "History",
    alias: ["/b/:id*", "/h/:id*", "/f/:id*"],
    component: () => import("@/views/History.vue"),
  },

  /**
   * Профиль
   * Можно изменить свой аватар и имя.
   * Узнать версию приложения, свой id и авторизоваться в системе.
   */
  {
    path: "/profile",
    name: "Profile",
    alias: "/p",
    component: () => import("@/views/Profile.vue"),
  },
];

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
