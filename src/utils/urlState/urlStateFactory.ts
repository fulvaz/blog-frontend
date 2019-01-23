import { IUrlState } from './urlState.interface';
import { CommonUrlState } from './commonUrlState';
import { CustomSerilizer } from './serializer/customSerializer';
import { CommonSynchronizer } from './sychonizer/commonSynchronizer';
import { DvaSynchronizer } from './sychonizer/dvaSynchronizer';
import { DvaUrlState } from './dvaUrlState';

export interface UrlStateConfig {
    ifDva?: boolean;
    dvaFilterEvent?: string; // 用于更新filter的事件
    dvaNamespace?: string;
    ifAngular?: boolean;
    serializer?: { stringify: (data) => any; parse: (param) => any }; // TODO: 其他的序列化方式
    apiConfig: { api: string; deps: string[] }[];
    methodChange: string[];
    ifStringifyObj?: boolean;
}

export class UrlStateFactory {
    public static build(config: UrlStateConfig): IUrlState {
        const { ifDva = false, ifAngular = false } = config;
        if (ifDva) {
            const { stringify, parse } = config.serializer;
            const serializer = new CustomSerilizer(stringify, parse, config);
            const synchronizer = new DvaSynchronizer(config);
            return new DvaUrlState(serializer, synchronizer, config);
        } else if (ifAngular) {
            // TODO: angular的路由状态处理
            throw new Error('Handler not implemented yet');
        } else {
            // 默认
            const { stringify, parse } = config.serializer;
            const serializer = new CustomSerilizer(stringify, parse, config);
            const synchronizer = new CommonSynchronizer();
            return new CommonUrlState(serializer, synchronizer, config);
        }
    }
}
