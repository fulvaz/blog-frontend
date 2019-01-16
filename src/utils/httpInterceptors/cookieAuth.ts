export const CookieAuthInterceport = {
  req: [
    config => {
      // 添加token或者设置cookie
      config.withCredentials = true;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  ]
};
