import axios from 'axios';
import { ErrInterceport } from './httpInterceptors/err';
import { CookieAuthInterceport } from './httpInterceptors/cookieAuth';
import { TransformDataInterceport } from './httpInterceptors/transformData';

axios.interceptors.request.use(...CookieAuthInterceport.req);

axios.interceptors.response.use(...ErrInterceport.res);
axios.interceptors.response.use(...TransformDataInterceport.res);

axios.defaults.withCredentials = true;

export default axios;

// export default {
//   get(...args) {
//     return axios.get.apply(axios, args).then(e => e.data);
//   },
//   post(...args) {
//     return axios.post.apply(axios, args).then(e => e.data);
//   },
//   delete(...args) {
//     return axios.delete.apply(axios, args).then(e => e.data);
//   },
//   put(...args) {
//     return axios.put.apply(axios, args).then(e => e.data);
//   },
// };