import { message } from 'antd';
import { Tools } from '../tools';
import { environment } from '../../enviroments';
import { stat } from 'fs';

function showErr(content) {
  message.error(content);
}

function goAuthPage() {
  // if (process.env.REACT_APP_ENV === 'local') {
  //   showErr('鉴权失败, 开发环境需要自行复制token');
  // }

  Tools.jumpTo(environment.login + '?next_url=' + location.href);
}

export const ErrInterceport = {
  req: [],
  res: [
    response => {
      // 这里处理业务错误
      const { data: body, status } = response;
      if (status === 200 && body.code !== 2000) {
        if (body.code === 4001 || body.code === 4003) {
          goAuthPage();
        } else if (body.code !== 2000 && body.msg) {
          showErr(`[${body.code}] ${body.msg}`);
        } else if (body.code !== 2000 && !body.msg) {
          showErr(`[${body.code || 'UNKNOWN'}] 网络出现未知错误, 请稍后重试`);
        }
      }
      return response;
    },
    error => {
      // 处理网络相关错误
      const { status } = error.response;
      showErr(`[${status || 'UNKNOWN'}] 网络错误, 请重试`);
      
      if (status === 401 || status === 403) {
        goAuthPage();
      }
      return Promise.reject(error);
    }
  ]
};
