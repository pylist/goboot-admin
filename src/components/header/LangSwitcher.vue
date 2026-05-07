<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Check, ChevronDown, Globe } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setLocale } from '@/locales';

const { t, locale, availableLocales } = useI18n();

// locale code → 显示标签的映射；新增语言时加这里
const localeMeta: Record<string, { name: string; short: string }> = {
  'zh-CN': { name: '简体中文', short: '中' },
  'en-US': { name: 'English', short: 'EN' },
};

// 当前语言的短标签（不在映射表里就用 code 自身大写兜底）
const currentShort = computed(
  () => localeMeta[locale.value]?.short ?? String(locale.value).toUpperCase(),
);

function pick(code: string) {
  if (code === locale.value) return;
  setLocale(code);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="sm"
        class="gap-1.5 px-2.5"
        :aria-label="t('common.language')"
      >
        <Globe class="size-4" />
        <span class="text-xs font-medium">{{ currentShort }}</span>
        <ChevronDown class="size-3 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem
        v-for="code in availableLocales"
        :key="code"
        class="justify-between"
        @select="pick(code)"
      >
        <span>{{ localeMeta[code]?.name ?? code }}</span>
        <Check v-if="locale === code" class="size-4 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
