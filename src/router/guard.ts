import type { Router } from 'vue-router';

import { useAccessStore } from '@/stores/access';

export function setupGuard(router: Router) {
  router.beforeEach((to) => {
    const access = useAccessStore();
    // 公开路由（meta.public）直接放行
    if (to.meta.public) return true;
    if (!access.accessToken) {
      return {
        path: '/login',
        query: to.fullPath === '/' ? {} : { redirect: to.fullPath },
      };
    }
    return true;
  });
}
