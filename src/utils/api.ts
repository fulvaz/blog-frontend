import request from './request';

import { environment } from '../enviroments';

const API_PREFIX = environment.apiPrefix;

export class API {
  public static fetchMenu(params?, option?) {
    console.warn('requesting fake menu data');
    return Promise.resolve([
      {
        key: 'example',
        id: 1,
        pid: 0,
        name: 'Example',
        description: 'Example',
        platform: 'OP',
        platformName: null
      },
      {
        key: 'form',
        id: 2,
        pid: 1,
        name: 'Form',
        description: 'Form',
        platform: 'OP',
        platformName: null
      },
      {
        id: 3,
        pid: 1,
        name: 'Table',
        key: 'table',
        description: 'Table',
        platform: 'OP',
        platformName: null
      },
      {
        key: 'urlState',
        id: 4,
        pid: 1,
        name: 'url state',
        description: 'url state',
        platform: 'OP',
        platformName: null
      }
    ]);
  }

  public static fetchFakeData(params, option?) {
    const { page, size } = params;
    console.log(size);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let arr = new Array(+size);
        arr = arr
          .fill(0)
          .map((e, idx) => ({ id: idx, name: `${page}xxx`, title: 'xxx' }));
        resolve({
          totalSize: size * 10 + 1,
          data: arr
        });
      }, 100);
    });
  }
}
