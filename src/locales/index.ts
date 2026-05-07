import { createI18n } from 'vue-i18n';

/**
 * 自动加载所有 locale 命名空间。
 *
 * 路径约定：./langs/<locale>/<namespace>.json
 *   例：./langs/zh-CN/common.json → 在 i18n 里访问 t('common.xxx')
 *
 * 加新文件 / 加新语言：丢 JSON 进对应目录即可，无需改任何代码。
 */
const STORAGE_KEY = 'admin_locale';

const modules = import.meta.glob<{ default: Record<string, unknown> }>('./langs/**/*.json', {
  eager: true,
});

// Record<string, any>：vue-i18n 11 的递归 LocaleMessage 类型在嵌套 JSON 下推断很费劲，
// 用 any 绕开，运行时行为完全一致
const messages: Record<string, any> = {};
for (const [path, mod] of Object.entries(modules)) {
  // 形如 './langs/zh-CN/common.json' → ['zh-CN', 'common']
  const match = path.match(/\.\/langs\/([^/]+)\/(.+)\.json$/);
  if (!match) continue;
  const [, locale, namespace] = match;
  if (!locale || !namespace) continue;
  messages[locale] = messages[locale] || {};
  messages[locale][namespace] = mod.default;
}

function detectInitialLocale(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in messages) return stored;
  const lang = (navigator.language || 'zh-CN').toLowerCase();
  if (lang.startsWith('en')) return 'en-US';
  return 'zh-CN';
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages,
});

export const $t = i18n.global.t;

// composition 模式下 locale 是 WritableComputedRef，但 messages 用了 any 后类型推断丢失，
// 这里显式 as 一下；运行时仍然是 Ref
type LocaleRef = { value: string };

export function setLocale(locale: string) {
  (i18n.global.locale as unknown as LocaleRef).value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function getLocale(): string {
  return (i18n.global.locale as unknown as LocaleRef).value;
}
