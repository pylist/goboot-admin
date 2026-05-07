<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Check, Monitor, Moon, Sun } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/stores';

const { t } = useI18n();
const themeStore = useThemeStore();

const items = [
  { value: 'light', icon: Sun, label: 'theme.colorMode.light' },
  { value: 'dark', icon: Moon, label: 'theme.colorMode.dark' },
  { value: 'system', icon: Monitor, label: 'theme.colorMode.system' },
] as const;
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" :aria-label="t('theme.colorMode.label')">
        <Sun v-if="!themeStore.isDark" class="size-4" />
        <Moon v-else class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem
        v-for="item in items"
        :key="item.value"
        class="justify-between"
        @select="themeStore.setColorMode(item.value)"
      >
        <span class="flex items-center gap-2">
          <component :is="item.icon" class="size-4" />
          {{ t(item.label) }}
        </span>
        <Check v-if="themeStore.colorMode === item.value" class="size-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
