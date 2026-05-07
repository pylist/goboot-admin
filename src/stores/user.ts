import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  role: number;
  status: number;
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null);

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
  }

  function clear() {
    userInfo.value = null;
  }

  return { userInfo, setUserInfo, clear };
});
