import { ISerializer } from './serializer.interface';
import { UrlStateConfig } from '../urlStateFactory';
import { Tools } from '../../tools';

export class CustomSerilizer implements ISerializer {
    constructor(
        private stringify: (data) => { ['key']: string },
        private parse: (data) => any,
        private config: UrlStateConfig
    ) {}

    serialize(data: any) {
        const objToSerialize = this.stringify(data);
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
            return this.parse(Tools.removeUndefinedyObjMember(param));
        } catch (e) {
            console.error(
                '[URLState]: 反序列化错误, 请检查你的反序列化方法定义是否正确'
            );
        }
    }
}
