<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Check, Palette } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore, type ThemeName } from '@/stores';

const { t } = useI18n();
const themeStore = useThemeStore();

// 每个主题对应一个示色圆点（HSL 跟 index.css 里 light 模式下的 --primary 一致）
const themeSwatches: Record<ThemeName, string> = {
  default: 'hsl(222.2 47.4% 11.2%)',
  blue: 'hsl(221.2 83.2% 53.3%)',
  green: 'hsl(142.1 76.2% 36.3%)',
  rose: 'hsl(346.8 77.2% 49.8%)',
  orange: 'hsl(24.6 95% 53.1%)',
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :aria-label="t('theme.theme.label')">
        <Palette class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuLabel>{{ t('theme.theme.label') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="name in themeStore.AVAILABLE_THEMES"
        :key="name"
        class="justify-between"
        @select="themeStore.setTheme(name)"
      >
        <span class="flex items-center gap-2">
          <span
            class="size-4 rounded-full border"
            :style="{ backgroundColor: themeSwatches[name] }"
          />
          {{ t(`theme.theme.${name}`) }}
        </span>
        <Check v-if="themeStore.theme === name" class="size-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
