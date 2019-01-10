export const ErrResp = [
    function(config) {
        // 添加token或者设置cookie

        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
]