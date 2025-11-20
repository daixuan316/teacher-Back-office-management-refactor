import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import Message from "primevue/message"; // 如果使用 Element Plus
// 或者使用 PrimeVue 的 Toast
// import { useToast } from 'primevue/usetoast'

// 响应数据接口
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量读取
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    // 1. 添加 token
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 添加时间戳防止缓存（GET 请求）
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // 3. 开发环境打印请求信息
    if (import.meta.env.VITE_APP_ENV === "development") {
      console.log("📤 Request:", {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 开发环境打印响应信息
    if (import.meta.env.VITE_APP_ENV === "development") {
      console.log("📥 Response:", {
        url: response.config.url,
        data: response.data,
      });
    }

    const { code, data, message } = response.data;

    // 根据后端返回的 code 进行不同处理
    switch (code) {
      case 200:
      case 0:
        // 成功
        return data;

      case 401:
        // 未授权，跳转登录
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        // ElMessage.error('登录已过期，请重新登录')
        console.error("登录已过期，请重新登录");
        // 跳转到登录页
        window.location.href = "/login";
        return Promise.reject(new Error(message || "未授权"));

      case 403:
        // 无权限
        // ElMessage.error('无权限访问')
        console.error("无权限访问");
        return Promise.reject(new Error(message || "无权限"));

      case 404:
        // 资源不存在
        // ElMessage.error('请求的资源不存在')
        console.error("请求的资源不存在");
        return Promise.reject(new Error(message || "资源不存在"));

      case 500:
        // 服务器错误
        // ElMessage.error('服务器错误，请稍后重试')
        console.error("服务器错误");
        return Promise.reject(new Error(message || "服务器错误"));

      default:
        // 其他错误
        // ElMessage.error(message || '请求失败')
        console.error(message || "请求失败");
        return Promise.reject(new Error(message || "请求失败"));
    }
  },
  (error: AxiosError) => {
    // 响应错误处理
    console.error("❌ Response Error:", error);

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // ElMessage.error('请求参数错误')
          console.error("请求参数错误");
          break;
        case 401:
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          // ElMessage.error('登录已过期，请重新登录')
          console.error("登录已过期");
          window.location.href = "/login";
          break;
        case 403:
          // ElMessage.error('无权限访问')
          console.error("无权限访问");
          break;
        case 404:
          // ElMessage.error('请求的资源不存在')
          console.error("请求的资源不存在");
          break;
        case 500:
          // ElMessage.error('服务器错误，请稍后重试')
          console.error("服务器错误");
          break;
        case 502:
          // ElMessage.error('网关错误')
          console.error("网关错误");
          break;
        case 503:
          // ElMessage.error('服务不可用')
          console.error("服务不可用");
          break;
        default:
          // ElMessage.error((data as any)?.message || '请求失败')
          console.error("请求失败");
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      // ElMessage.error('网络错误，请检查网络连接')
      console.error("网络错误，请检查网络连接");
    } else {
      // 其他错误
      // ElMessage.error(error.message || '请求失败')
      console.error(error.message || "请求失败");
    }

    return Promise.reject(error);
  }
);

// 导出封装的请求方法
export default service;

// 导出常用的请求方法
export const request = {
  get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.get(url, { params, ...config });
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.delete(url, { params, ...config });
  },

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.patch(url, data, config);
  },
};
