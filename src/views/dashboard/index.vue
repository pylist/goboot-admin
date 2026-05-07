<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserStore } from '@/stores';

const { t } = useI18n();
const user = useUserStore();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-muted-foreground">
        {{ t('dashboard.welcome') }},
        {{ user.userInfo?.nickname || user.userInfo?.username }}
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Scaffold ✨</CardTitle>
        <CardDescription>
          Vite + Vue 3 + TS + Tailwind + shadcn-vue + Pinia + Vue Router +
          vue-i18n
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          {{ t('dashboard.scaffoldHint') }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
