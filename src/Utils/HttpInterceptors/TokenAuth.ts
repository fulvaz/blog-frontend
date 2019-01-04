export const AuthReq = [
    function(config) {
        // 添加token或者设置cookie
        return {...
          config,
          headers: {
            'Authorization': 'token here'
          }
        };
      },
      function(error) {
        return Promise.reject(error);
      }
]