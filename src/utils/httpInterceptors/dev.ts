export const DevReq = [
  (config) => {
    // 添加token或者设置cookie
    return {
      ...config
    };
  },
  (error) => {
    return Promise.reject(error);
  }
];
