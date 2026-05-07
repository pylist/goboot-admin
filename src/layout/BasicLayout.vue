<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LayoutDashboard, LogOut, Sparkles } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { useAccessStore, useUserStore } from '@/stores';
import { logoutApi } from '@/api/auth';

const { t } = useI18n();
const router = useRouter();
const access = useAccessStore();
const user = useUserStore();

async function handleLogout() {
  try {
    await logoutApi(access.refreshToken);
  } catch {
    // 后端 logout 失败也无所谓，本地清掉照样跳登录
  }
  access.clear();
  user.clear();
  router.replace('/login');
}
</script>

<template>
  <div class="flex min-h-svh bg-background">
    <!-- 侧边栏 -->
    <aside class="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
      <div class="flex h-16 items-center gap-2 border-b px-4">
        <Sparkles class="size-5 text-primary" />
        <span class="text-base font-bold tracking-tight">Admin</span>
      </div>
      <nav class="flex-1 space-y-1 p-2">
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          active-class="bg-accent text-accent-foreground font-medium"
        >
          <LayoutDashboard class="size-4" />
          {{ t('dashboard.title') }}
        </RouterLink>
      </nav>
    </aside>

    <!-- 右侧 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center justify-between border-b bg-card px-6">
        <div class="text-sm text-muted-foreground">
          {{ user.userInfo?.nickname || user.userInfo?.username || '...' }}
        </div>
        <Button variant="ghost" size="sm" @click="handleLogout">
          <LogOut class="mr-2 size-4" />
          {{ t('common.logout') }}
        </Button>
      </header>

      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
