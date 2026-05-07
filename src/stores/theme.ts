import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

/** 颜色模式（独立于主题色） */
export type ColorMode = 'light' | 'dark' | 'system';

/** 主题色名（要新增主题，加这里 + 在 index.css 加对应 .theme-xxx 块） */
export type ThemeName = 'default' | 'blue' | 'green' | 'rose' | 'orange';

const COLOR_MODE_KEY = 'admin_color_mode';
const THEME_KEY = 'admin_theme';

const COLOR_MODES: ColorMode[] = ['light', 'dark', 'system'];
const THEMES: ThemeName[] = ['default', 'blue', 'green', 'rose', 'orange'];

function readStored<T extends string>(key: string, valid: readonly T[], fallback: T): T {
  const raw = localStorage.getItem(key);
  return (valid as readonly string[]).includes(raw || '') ? (raw as T) : fallback;
}

export const useThemeStore = defineStore('theme', () => {
  const colorMode = ref<ColorMode>(readStored(COLOR_MODE_KEY, COLOR_MODES, 'system'));
  const theme = ref<ThemeName>(readStored(THEME_KEY, THEMES, 'default'));

  // 跟踪系统色彩偏好（colorMode === 'system' 时跟随）
  const mql = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const systemPrefersDark = ref<boolean>(mql?.matches ?? false);
  mql?.addEventListener('change', (e) => {
    systemPrefersDark.value = e.matches;
  });

  /** 当前实际是不是 dark（解析了 system 之后） */
  const isDark = computed(
    () => colorMode.value === 'dark' || (colorMode.value === 'system' && systemPrefersDark.value),
  );

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode;
    localStorage.setItem(COLOR_MODE_KEY, mode);
  }

  function setTheme(t: ThemeName) {
    theme.value = t;
    localStorage.setItem(THEME_KEY, t);
  }

  // 把状态同步到 <html> 的 class 上
  watch(
    [theme, isDark],
    () => {
      const html = document.documentElement;
      // 清掉旧的 theme-* 类
      Array.from(html.classList)
        .filter((c) => c.startsWith('theme-'))
        .forEach((c) => html.classList.remove(c));
      // default 主题 = 不加类（用 :root 兜底，CSS 体积省一点）
      if (theme.value !== 'default') {
        html.classList.add(`theme-${theme.value}`);
      }
      html.classList.toggle('dark', isDark.value);
    },
    { immediate: true },
  );

  return {
    colorMode,
    theme,
    isDark,
    setColorMode,
    setTheme,
    /** 暴露常量给 UI 渲染选项 */
    AVAILABLE_THEMES: THEMES,
    AVAILABLE_COLOR_MODES: COLOR_MODES,
  };
});
