import { defineStore } from 'pinia';
import { ref } from 'vue';

const ACCESS_TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';

export const useAccessStore = defineStore('access', () => {
  const accessToken = ref<string>(localStorage.getItem(ACCESS_TOKEN_KEY) || '');
  const refreshToken = ref<string>(
    localStorage.getItem(REFRESH_TOKEN_KEY) || '',
  );

  function setTokens(access: string, refresh: string) {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  function clear() {
    accessToken.value = '';
    refreshToken.value = '';
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  return { accessToken, refreshToken, setTokens, clear };
});
