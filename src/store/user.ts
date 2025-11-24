import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 用户信息接口
export interface UserInfo {
  id?: string | number;
  username?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any; // 允许其他扩展字段
}

// 定义用户 store
export const useUserStore = defineStore("user", () => {
  // state
  const token = ref<string>("");
  const userInfo = ref<UserInfo>({});

  // 是否已登录 (computed)
  const isLoggedIn = computed(() => !!token.value);

  // 从本地存储加载 token 和用户信息
  const loadFromStorage = () => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUserInfo = localStorage.getItem("userInfo");
    
    if (storedToken) {
      token.value = storedToken;
    }
    
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error("解析用户信息失败:", error);
        userInfo.value = {};
      }
    }
  };

  // 设置 token
  const setToken = (newToken: string, remember: boolean = false) => {
    token.value = newToken;
    
    // 根据 remember 参数选择存储方式
    if (remember) {
      localStorage.setItem("token", newToken);
      // 移除 sessionStorage 中的 token，避免冲突
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", newToken);
      // 移除 localStorage 中的 token，避免冲突
      localStorage.removeItem("token");
    }
  };

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info;
    localStorage.setItem("userInfo", JSON.stringify(info));
  };

  // 更新用户信息（部分更新）
  const updateUserInfo = (partialInfo: Partial<UserInfo>) => {
    userInfo.value = { ...userInfo.value, ...partialInfo };
    localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
  };

  // 清除 token 和用户信息（登出）
  const clearUserData = () => {
    token.value = "";
    userInfo.value = {};
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userInfo");
  };

  // 登出
  const logout = () => {
    clearUserData();
  };

  // 初始化：从本地存储加载数据
  loadFromStorage();

  return {
    // state
    token,
    userInfo,
    // getters
    isLoggedIn,
    // actions
    setToken,
    setUserInfo,
    updateUserInfo,
    clearUserData,
    logout,
    loadFromStorage,
  };
});

