import { createI18n } from 'vue-i18n';

import zhCN from './zh-CN.json';
import enUS from './en-US.json';

const STORAGE_KEY = 'admin_locale';

function detectInitialLocale(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  // 浏览器语言粗略匹配
  const lang = (navigator.language || 'zh-CN').toLowerCase();
  if (lang.startsWith('en')) return 'en-US';
  return 'zh-CN';
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

export const $t = i18n.global.t;

export function setLocale(locale: string) {
  i18n.global.locale.value = locale as any;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function getLocale() {
  return i18n.global.locale.value;
}
