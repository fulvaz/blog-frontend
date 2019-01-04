export const CookieAuthReq = [
    function(config) {
        // 添加token或者设置cookie
        return {
            ...config,
            withCredentials: true,
        };
      },
      function(error) {
        return Promise.reject(error);
      }
]