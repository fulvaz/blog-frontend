import { IUrlState } from './urlState.interface';
import { ISerializer } from './serializer/serializer.interface';
import { UrlStateConfig } from './urlStateFactory';
import { Tools } from '../tools';
import { ISynchronizer } from './sychonizer/synchronizer.interface';

// 胶水类
export class DvaUrlState implements IUrlState {
    initState: any;

    constructor(
        private serializer: ISerializer,
        private synchronizer: ISynchronizer,
        private config: UrlStateConfig
    ) {}

    handleInit(componentInstance: any) {
        const {
            location: { search: currSearch },
        } = componentInstance.props;
        const currUrlParams = new URLSearchParams(currSearch);

        // 根据filter从url里面取数据
        const paramObj = {};
        currUrlParams.forEach((v, k) => (paramObj[k] = v));

        const ifParamObjEmpty = Object.keys(paramObj).length === 0;
        if (!ifParamObjEmpty) {
            const state = this.serializer.deserialize(paramObj);
            this.synchronizer.restoreUI(
                componentInstance,
                Tools.removeUndefinedyObjMember(state)
            );
        }
    }

    handleUrlParamsChange(
        componentInstance: any,
        prevSearch: string,
        currSearch: string
    ) {
        const currUrlParams = new URLSearchParams(currSearch);
        const prevUrlParams = new URLSearchParams(prevSearch);

        const keysChanged = this.diffParams(prevUrlParams, currUrlParams);
        const ifUrlChanged = keysChanged.length > 0;

        if (!ifUrlChanged) {
            return;
        }

        // 清空了url
        if (currUrlParams.toString().length === 0) {
            this.restoreDefaultState(componentInstance);
            return;
        }

        const paramObj = {};
        currUrlParams.forEach((v, k) => {
            paramObj[k] = v;
        });
        const state = this.serializer.deserialize(paramObj);
        // 这里需要同步UI, 不能继续只修改state

        this.synchronizer.restoreUI(componentInstance, state).then(_ => {
            // 请求api
            this.requestAPI(prevUrlParams, currUrlParams, componentInstance);
        });
    }

    // 约定如果放dva的话filter要全部放在filters下, 且事件叫updateFilter, 且组件内的filter都在filter下
    saveInitState(componentInstance: any) {
        this.initState = componentInstance.props.filters;
    }

    changeUrlParams(componentInstance: any) {
        // 由于dispatch后, 传入组件的props会下次diff才会更新
        // 因此需要等一个周期
        setTimeout(() => {
            const urlSearchParam = this.serializer.serialize(
                componentInstance.props.filters
            );
            this.synchronizer.appendParams(componentInstance, urlSearchParam);
        });
    }

    private requestAllAPI(componentInstance: any) {
        const { apiConfig } = this.config;
        apiConfig.forEach(config => {
            const { api } = config;
            componentInstance[api]();
        });
    }

    private requestAPI(
        prevUrlParams: URLSearchParams,
        currUrlParams: URLSearchParams,
        componentInstance: any
    ) {
        const keysChanged = this.diffParams(prevUrlParams, currUrlParams);
        const { apiConfig } = this.config;
        apiConfig.forEach(config => {
            const { api, deps } = config;
            const ifNeedRequestApi =
                deps.filter(e => keysChanged.includes(e)).length > 0;
            if (ifNeedRequestApi) {
                componentInstance[api]();
            }
        });
    }

    private restoreDefaultState(componentInstance) {
        this.synchronizer.restoreState(componentInstance, {
            ...this.initState,
        });
    }

    private diffParams(
        prevSearchParam: URLSearchParams,
        currSearchParam: URLSearchParams
    ): string[] {
        const keys = [];
        currSearchParam.forEach((v, k) => {
            if (v !== prevSearchParam.get(k)) {
                keys.push(k);
            }
        });

        // 以前有现在没有的key
        prevSearchParam.forEach((v, k) => {
            if (!currSearchParam.has(k)) {
                keys.push(k);
            }
        });
        return keys;
    }
}
