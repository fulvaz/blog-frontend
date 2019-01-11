export const AuthReq = [
  config => {
    // 添加token或者设置cookie
    return {
      ...config,
      headers: {
        Authorization: 'token here'
      }
    };
  },
  error => {
    return Promise.reject(error);
  }
];
