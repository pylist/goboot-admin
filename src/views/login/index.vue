<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Loader2, Lock, User } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProfileApi, loginApi } from '@/api/auth';
import { useAccessStore, useUserStore } from '@/stores';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const access = useAccessStore();
const user = useUserStore();

const account = ref('');
const password = ref('');
const submitting = ref(false);
const errorMsg = ref('');

async function handleSubmit() {
  errorMsg.value = '';
  if (!account.value || !password.value) {
    errorMsg.value = t('login.validateRequired');
    return;
  }

  submitting.value = true;
  try {
    const result = await loginApi({
      account: account.value,
      password: password.value,
    });
    access.setTokens(result.accessToken, result.refreshToken);
    // 取最新 profile（响应拦截器会自动带 token）
    const profile = await getProfileApi();
    user.setUserInfo(profile);
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.replace(redirect);
  } catch (err: any) {
    errorMsg.value = err?.message || t('login.failed');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div
    class="flex min-h-svh items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 p-4"
  >
    <Card class="w-full max-w-md shadow-xl">
      <CardHeader class="space-y-2 text-center">
        <div
          class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
        >
          <span class="text-lg font-bold">A</span>
        </div>
        <CardTitle class="text-2xl">{{ t('login.title') }}</CardTitle>
        <CardDescription>{{ t('login.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="account">{{ t('login.account') }}</Label>
            <div class="relative">
              <User
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="account"
                v-model="account"
                type="text"
                :placeholder="t('login.accountPlaceholder')"
                class="pl-9"
                autocomplete="username"
                :disabled="submitting"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="password">{{ t('login.password') }}</Label>
            <div class="relative">
              <Lock
                class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="password"
                v-model="password"
                type="password"
                :placeholder="t('login.passwordPlaceholder')"
                class="pl-9"
                autocomplete="current-password"
                :disabled="submitting"
              />
            </div>
          </div>

          <p
            v-if="errorMsg"
            role="alert"
            class="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {{ errorMsg }}
          </p>

          <Button type="submit" class="w-full" :disabled="submitting">
            <Loader2 v-if="submitting" class="size-4 animate-spin" />
            {{ submitting ? t('login.submitting') : t('login.submit') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
