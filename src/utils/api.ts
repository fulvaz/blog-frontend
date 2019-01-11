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

  public static fetchChannelsList(params, option?) {
    return request.get(`${API_PREFIX}/channels`, { ...option, params });
  }

  public static createChannels(params, option?) {
    return request.post(`${API_PREFIX}/channels`, params, option);
  }

  public static updateChannels(params, option?) {
    return request.put(`${API_PREFIX}/channels`, params, option);
  }

  public static fetchChannelsById(params, option?) {
    const { id } = params;
    delete params.id;
    return request.get(`${API_PREFIX}/channels/${id}`, { ...option, params });
  }

  public static deleteChannelsById(params, option?) {
    const { id } = params;
    delete params.id;
    return request.delete(`${API_PREFIX}/channels/${id}`, {
      ...option,
      params
    });
  }

  public static fetchGatewayUser(params?, option?) {
    return request.get(`${API_PREFIX}/gateway_users`, { ...option, params });
  }

  public static createChannelAudience(params?, option?) {
    return request.post(`${API_PREFIX}/channel/audience`, params, option);
  }

  public static updateChannelAudience(params, option?) {
    return request.put(`${API_PREFIX}/channel/audience`, params, option);
  }

  public static updateChannelAudienceUpdateStatus(params, option?) {
    return request.put(`${API_PREFIX}/channel/audience/updateStatus`, params, option);
  }

  public static fetchChannelAudienceById(params?, option?) {
    const {channelId, id} = params;
    delete params.channelId;
    delete params.id;
    return request.get(`${API_PREFIX}/channel/${channelId}/audience/${id}`, { ...option, params });
  }

  public static fetchChannelAudience(params?, option?) {
    const channelId = params.channelId;
    delete params.channelId;
    return request.get(`${API_PREFIX}/channel/${channelId}/audience`, { ...option, params });
  }
  public static getWhareTargetsById(params?, option?) {
    const id = params.id;
    delete params.id;
    return request.get(`${API_PREFIX}/shareTargets/${id}`, { ...option, params });
  }
}
