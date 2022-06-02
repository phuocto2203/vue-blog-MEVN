import { createRouter, createWebHistory } from "vue-router";
import store from "../vuex/store";

const requireAuth = async (to, from, next) => {
  await store.dispatch("checkAuthenticatedUser");

  if (!store.state.userModule.isAuthenticated)
    next({ name: "sign-in-route", params: {} });
  else next();
};

const routes = [
  {
    path: "/",
    name: "home-route",
    component: () => import("../pages/home.vue"),
  },
  {
    path: "/posts",
    name: "posts-route",
    component: () => import("../pages/home.vue"),
  },

  {
    path: "/post-detail/:id",
    name: "post-detail-route",
    component: () => import("../pages/post-detail.vue"),
    props: true,
  },

  {
    path: "/your-posts",
    name: "your-posts-route",
    component: () => import("../pages/your-posts.vue"),
    beforeEnter: requireAuth,
  },

  {
    path: "/add-post",
    name: "add-post-route",
    component: () => import("../pages/add-post.vue"),
    beforeEnter: requireAuth,
  },
  {
    path: "/edit-post/:id",
    name: "edit-post-route",
    component: () => import("../pages/edit-post.vue"),
    beforeEnter: requireAuth,
  },

  {
    path: "/sign-in",
    name: "sign-in-route",
    component: () => import("../pages/sign-in.vue"),
  },
  {
    path: "/sign-up",
    name: "sign-up-route",
    component: () => import("../pages/sign-up.vue"),
  },
  {
    path: "/about",
    name: "about-route",
    component: () => import("../pages/about.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
