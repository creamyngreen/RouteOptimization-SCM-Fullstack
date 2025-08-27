import axios from "axios";
import axiosRetry from "axios-retry";
let store;
export const injectStore = (_store) => {
  store = _store;
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,
});

axiosRetry(instance, {
  retries: 3,
  retryCondition: (error) => {
    return error.response.status === 401 || error.response.status === 405;
  },
  retryDelay: (retryCount) => {
    return retryCount * 100;
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const state = store.getState();
    const token = state.account?.userInfo?.access_token ?? "";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// // Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  function (err) {
    if (err && err.response && err.response.data) {
      return err.response.data;
    }
    return Promise.reject(err);
  }
);

export default instance;
