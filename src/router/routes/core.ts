import type { RouteRecordRaw } from 'vue-router';

/**
 * 必须存在的核心路由：登录页、404 兜底，以及所有受保护页面共享的 BasicLayout 容器
 *
 * 业务模块（dashboard / system / order ...）放 modules/，会自动合并到 layoutRoute 的 children
 */

/** 不需要登录的公开路由 */
export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { public: true, title: 'login.title' },
  },
];

/** 受保护的 layout 容器，业务页都作为它的 children */
export const layoutRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/layout/BasicLayout.vue'),
  redirect: '/dashboard',
  children: [],
};

/** 404 兜底（必须在最后） */
export const fallbackRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  redirect: '/dashboard',
};
