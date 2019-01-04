import axios from "axios";
import {Modal} from 'antd';

const {error} = Modal;

function showErr(content) {
    error({
        title: '网络错误',
        content,
    });
}


axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
