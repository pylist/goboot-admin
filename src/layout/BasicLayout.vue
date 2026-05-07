<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Sparkles,
  User,
} from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ColorModeSwitcher from '@/components/header/ColorModeSwitcher.vue';
import ThemeSwitcher from '@/components/header/ThemeSwitcher.vue';
import LangSwitcher from '@/components/header/LangSwitcher.vue';
import { useAccessStore, useUserStore } from '@/stores';
import { useLayout } from '@/composables/useLayout';
import { logoutApi } from '@/api/auth';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const access = useAccessStore();
const user = useUserStore();
const {
  sidebarVisibleDesktop,
  sidebarCollapsed,
  sidebarOpenMobile,
  isDesktop,
  toggleSidebar,
  toggleSidebarVisible,
  closeMobileSidebar,
} = useLayout();

// 文字渐隐"折叠"行为只在桌面端 + visible + collapsed 时生效
const showCollapsed = computed(
  () => isDesktop.value && sidebarVisibleDesktop.value && sidebarCollapsed.value,
);

// 路由变化时关掉移动抽屉
watch(() => route.fullPath, () => closeMobileSidebar());

// 视口变成 desktop 时清掉 mobile 抽屉状态，避免遗留
watch(isDesktop, (desktop) => {
  if (desktop) closeMobileSidebar();
});

async function handleLogout() {
  try {
    await logoutApi(access.refreshToken);
  } catch {
    // 后端 logout 失败也照样跳登录
  }
  access.clear();
  user.clear();
  router.replace('/login');
}
</script>

<template>
  <div class="flex min-h-svh bg-background">
    <!-- 移动端遮罩：点击关闭抽屉，desktop 永不显示 -->
    <div
      v-if="sidebarOpenMobile"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
      @click="closeMobileSidebar"
    />

    <!--
      侧边栏多状态：
        · mobile：fixed 定位，transform 滑入/滑出（基于 sidebarOpenMobile）
        · desktop：relative 排版，width 在 0/16/60 三档之间过渡
            - sidebarVisibleDesktop=false → md:w-0（整体隐藏）
            - sidebarVisibleDesktop=true & sidebarCollapsed=true → md:w-16（icon-only）
            - sidebarVisibleDesktop=true & sidebarCollapsed=false → md:w-60（完整）
    -->
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col overflow-hidden border-r bg-card transition-[transform,width] duration-200 md:relative md:translate-x-0"
      :class="[
        sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full',
        sidebarVisibleDesktop
          ? sidebarCollapsed
            ? 'md:w-16'
            : 'md:w-60'
          : 'md:w-0 md:border-r-0',
      ]"
    >
      <div class="flex h-16 items-center gap-2 px-4">
        <Sparkles class="size-5 shrink-0 text-primary" />
        <span
          class="whitespace-nowrap text-base font-bold tracking-tight transition-opacity"
          :class="
            showCollapsed
              ? 'opacity-0 duration-100'
              : 'opacity-100 duration-150 delay-150'
          "
        >
          Admin
        </span>
      </div>

      <nav class="flex-1 space-y-1 p-2">
        <RouterLink
          to="/dashboard"
          :title="showCollapsed ? t('dashboard.title') : ''"
          class="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          active-class="bg-accent text-accent-foreground font-medium"
        >
          <LayoutDashboard class="size-4 shrink-0" />
          <span
            class="transition-opacity"
            :class="
              showCollapsed
                ? 'opacity-0 duration-100'
                : 'opacity-100 duration-150 delay-150'
            "
          >
            {{ t('dashboard.title') }}
          </span>
        </RouterLink>
      </nav>

      <!-- 折叠按钮：仅 desktop 且未被 hamburger 整体隐藏时显示 -->
      <div
        v-if="sidebarVisibleDesktop"
        class="hidden p-2 md:block"
      >
        <Button
          variant="ghost"
          size="icon"
          :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleSidebar"
        >
          <PanelLeftClose
            class="size-4 transition-transform duration-200"
            :class="sidebarCollapsed && 'rotate-180'"
          />
        </Button>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center gap-1 border-b bg-card px-4">
        <!-- Hamburger：跨端统一入口
             · mobile：切抽屉
             · desktop：整体显示/隐藏侧边栏（不是折叠到 icon） -->
        <Button
          variant="ghost"
          size="icon"
          :aria-label="
            isDesktop
              ? sidebarVisibleDesktop
                ? 'Hide sidebar'
                : 'Show sidebar'
              : sidebarOpenMobile
                ? 'Close menu'
                : 'Open menu'
          "
          @click="toggleSidebarVisible"
        >
          <Menu class="size-4" />
        </Button>

        <!-- 右侧 switchers + 用户菜单 -->
        <div class="ml-auto flex items-center gap-1">
          <ThemeSwitcher />
          <ColorModeSwitcher />
          <LangSwitcher />
          <span class="mx-2 h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="gap-2">
                <span
                  class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <User class="size-4" />
                </span>
                <span class="hidden text-sm md:inline">
                  {{ user.userInfo?.nickname || user.userInfo?.username || '...' }}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-44">
              <DropdownMenuLabel>
                {{ user.userInfo?.nickname || user.userInfo?.username }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                class="text-destructive focus:text-destructive"
                @select="handleLogout"
              >
                <LogOut class="size-4" />
                {{ t('common.logout') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
