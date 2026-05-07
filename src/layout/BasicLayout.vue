<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  LayoutDashboard,
  LogOut,
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
const access = useAccessStore();
const user = useUserStore();
const { sidebarCollapsed, toggleSidebar } = useLayout();

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
    <!-- 侧边栏 -->
    <!--
      丝滑要点：
      1. aside 加 overflow-hidden，让文字溢出时被自然裁剪
      2. 文字常驻 DOM（不用 v-if），加 whitespace-nowrap 防换行
      3. 不在折叠态切换 justify/padding 这类布局 class，避免位置跳变
      4. 图标用单一组件 + transform rotate 平滑过渡
    -->
    <aside
      class="hidden shrink-0 flex-col overflow-hidden border-r bg-card transition-[width] duration-200 md:flex"
      :class="sidebarCollapsed ? 'w-16' : 'w-60'"
    >
      <div class="flex h-16 items-center gap-2 px-4">
        <Sparkles class="size-5 shrink-0 text-primary" />
        <!--
          文字渐隐时序（width 动画 200ms）：
          - 折叠：opacity 100ms 内淡出，赶在 sidebar 还宽时就消失，不会出现"半字符"
          - 展开：等 150ms 让 sidebar 先撑开，再 150ms 淡入，期间已经够宽容下整段
        -->
        <span
          class="whitespace-nowrap text-base font-bold tracking-tight transition-opacity"
          :class="sidebarCollapsed ? 'opacity-0 duration-100' : 'opacity-100 duration-150 delay-150'"
        >
          Admin
        </span>
      </div>

      <nav class="flex-1 space-y-1 p-2">
        <RouterLink
          to="/dashboard"
          :title="sidebarCollapsed ? t('dashboard.title') : ''"
          class="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          active-class="bg-accent text-accent-foreground font-medium"
        >
          <LayoutDashboard class="size-4 shrink-0" />
          <span
            class="transition-opacity"
            :class="sidebarCollapsed ? 'opacity-0 duration-100' : 'opacity-100 duration-150 delay-150'"
          >
            {{ t('dashboard.title') }}
          </span>
        </RouterLink>
      </nav>

      <!-- 折叠按钮：常驻左下，图标用 rotate 而非 v-if 切换 -->
      <div class="p-2">
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

    <!-- 右侧 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center justify-end gap-1 border-b bg-card px-4">
        <!-- 主题 / 颜色模式 / 语言 / 用户 -->
        <div class="flex items-center gap-1">
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
