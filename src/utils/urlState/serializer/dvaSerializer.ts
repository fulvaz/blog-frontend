import { ISerializer } from './serializer.interface';
import { UrlStateConfig } from '../urlStateFactory';
import { Tools } from '../../tools';

const defaultStringify = data => {
    const { current, pageSize, columnKey, order, name } = data;
    return {
        current,
        pageSize,
        columnKey,
        order,
        name: JSON.stringify(name),
    };
};

const defaultParse = params => {
    // 需要自行整理成state的数据结构
    // params返回的全部是字符串, 需要自己转换为对应数据格式
    const { current, pageSize, columnKey, order, name } = params;
    return {
        current: parseInt(current, 10),
        pageSize: parseInt(pageSize, 10),
        columnKey,
        order,
        name: JSON.parse(name),
    };
};

export class DvaSerilizer implements ISerializer {
    constructor(
        private stringify: (data) => any,
        private parse: (data) => any,
        private config: UrlStateConfig
    ) {
        if (!this.stringify) {
            this.stringify = defaultStringify;
        }
        if (!this.parse) {
            this.parse = defaultParse;
        }
    }

    serialize(data: any) {
        const objToSerialize = {
            ...defaultStringify(data),
            ...this.stringify(data),
        };
        const urlSearchParam = Object.entries(
            Tools.removeUndefinedyObjMember(objToSerialize)
        ).reduce((p: URLSearchParams, [k, v]) => {
            p.append(k, v as string);
            return p;
        }, new URLSearchParams());
        return '?' + urlSearchParam;
    }

    deserialize(param: any) {
        try {
            return {
                ...defaultParse(Tools.removeUndefinedyObjMember(param)),
                ...this.parse(Tools.removeUndefinedyObjMember(param)),
            };
        } catch (e) {
            console.error(
                '[URLState]: 反序列化错误, 请检查你的反序列化方法定义是否正确'
            );
        }
    }
}
