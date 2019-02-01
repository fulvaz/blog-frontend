import request from './request';

import { environment } from '../enviroments';

const API_PREFIX = environment.apiPrefix;

export class API {
    public static fetchArticles(params?, option?): Promise<any> {
        return request.get(`${API_PREFIX}/articles`, { ...option, params });
    }
    public static fetchArticle(params?, option?) {
        const { id } = params;
        delete params.id;
        return request.get(`${API_PREFIX}/article/${id}`, {
            ...option,
            params,
        });
    }
}
