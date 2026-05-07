import type { RouteRecordRaw } from 'vue-router';

import { fallbackRoute, layoutRoute, publicRoutes } from './core';

/**
 * 自动加载 ./modules/*.ts 下导出的 default RouteRecordRaw[]，挂到 layoutRoute.children
 *
 * 加业务模块：在 modules/ 下新建文件，default export 一个数组就行，无需改这里
 */
const moduleFiles = import.meta.glob<{ default: RouteRecordRaw[] }>('./modules/*.ts', {
  eager: true,
});

const moduleRoutes = Object.values(moduleFiles).flatMap((m) => m.default);
layoutRoute.children = moduleRoutes;

/** 最终给 router 用的扁平路由数组（顺序：layout 容器 → 公开页 → 404 兜底） */
export const routes: RouteRecordRaw[] = [layoutRoute, ...publicRoutes, fallbackRoute];
