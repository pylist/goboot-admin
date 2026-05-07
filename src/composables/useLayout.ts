import { useStorage } from '@vueuse/core';

/**
 * 侧边栏折叠状态：写到 localStorage，刷新保留
 * 折叠后 sidebar 缩窄为 icon-only，文字隐藏
 */
const sidebarCollapsed = useStorage<boolean>('admin_sidebar_collapsed', false);

export function useLayout() {
  return {
    sidebarCollapsed,
    toggleSidebar: () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    },
  };
}
