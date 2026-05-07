import { useMediaQuery, useStorage } from '@vueuse/core';
import { ref } from 'vue';

/**
 * 桌面端侧边栏是否完全显示（false = 整体隐藏，主区独占整宽）
 * 这是 hamburger 在桌面下控制的状态
 */
const sidebarVisibleDesktop = useStorage<boolean>(
  'admin_sidebar_visible_desktop',
  true,
);

/**
 * 桌面端"折叠到 icon-only"状态（仅在 sidebarVisibleDesktop=true 时有意义）
 * 这是 sidebar 底部按钮控制的状态
 */
const sidebarCollapsed = useStorage<boolean>('admin_sidebar_collapsed', false);

/**
 * 移动端抽屉开关：会话级状态，不持久化
 * mobile 下 sidebar 用 fixed 定位 + transform 滑出/滑入
 */
const sidebarOpenMobile = ref(false);

/**
 * 当前是否桌面视口（>= md）
 * 用 useMediaQuery 自动响应 resize
 */
const isDesktop = useMediaQuery('(min-width: 768px)');

export function useLayout() {
  return {
    sidebarVisibleDesktop,
    sidebarCollapsed,
    sidebarOpenMobile,
    isDesktop,
    /** 底部按钮：折叠/展开（仅 desktop） */
    toggleSidebar: () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    },
    /**
     * Hamburger 按钮统一接口：
     *   mobile：开/关抽屉
     *   desktop：显示/隐藏整个侧边栏
     */
    toggleSidebarVisible: () => {
      if (isDesktop.value) {
        sidebarVisibleDesktop.value = !sidebarVisibleDesktop.value;
      } else {
        sidebarOpenMobile.value = !sidebarOpenMobile.value;
      }
    },
    closeMobileSidebar: () => {
      sidebarOpenMobile.value = false;
    },
  };
}
