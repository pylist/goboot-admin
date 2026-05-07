<script setup lang="ts">
import { computed } from 'vue';
import { Toaster, type ToasterProps } from 'vue-sonner';
import 'vue-sonner/style.css';

import { useThemeStore } from '@/stores';

const themeStore = useThemeStore();

// 跟随站点主题色彩模式（light / dark），保证 toast 视觉跟 UI 协调
const theme = computed<ToasterProps['theme']>(() =>
  themeStore.isDark ? 'dark' : 'light',
);
</script>

<template>
  <Toaster
    :theme="theme"
    class="toaster group"
    rich-colors
    position="top-right"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
