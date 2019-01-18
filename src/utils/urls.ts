import {
    ParamsToParamsObj,
    ParamsObjToObject,
    JudgeParamsStatus,
    CreateParamsByFilters,
    ObjectToParamsObj,
    AssignObject
} from './urlsTool';

const DEFAULT_STATE_KEY = '__defaultState';

interface PutStateInUrlConfig {
    [method: string]: string[];
}

interface ChangeUrlConfig {
    namespace: string;
    filters: string[];
    isDav?: boolean;
}

export function putStateInUrl(namespace: string, config: PutStateInUrlConfig, iSDav?: boolean): any {
    return function(target): any {
        const componentDidMount = target.prototype.componentDidMount;

        //组件声明周期只在初始化时调用一次，自定义method一定会被调用一次
        target.prototype.componentDidMount = function(...args) {
            //根据isDav来决定保存的初始状态来自props或者state
            this[DEFAULT_STATE_KEY] = JSON.parse(JSON.stringify(iSDav ? this.props : this.state));
            const { location: { search: currSearch } } = this.props;
            const currUrlParams = new URLSearchParams(currSearch);

            //将url参数转化 paramsObj格式 {namespace-filter-a-b...-e-f:value}
            const curr_paramsObj = ParamsToParamsObj(currUrlParams);

            Object.keys(config).forEach((method: string) => {
                const filters = config[method];

                //将paramsObj格式转为childObj格式 {namespace-filter-a-b...-e-f} to {filter:{a:{b:obj}}}
                const paramsToChildObj = ParamsObjToObject(curr_paramsObj, namespace);

                //将url参数值与初始值合并生成state
                const state = AssignObject(this[DEFAULT_STATE_KEY],paramsToChildObj, );
 
                //获取跟filters相关的值
                const params = CreateParamsByFilters(state, filters);
                const setStateCb = () => {
                    const remoteReqMethodName = method || `fetch${method}`;
                    this[remoteReqMethodName].call(this, params);
                };

                //非Dav环境会帮忙设置state并调用method，Dav环境不会设置state只会调用method
                if (!iSDav) {
                    this.state = {
                        ...this.state,
                        ...state
                    };
                    setStateCb();
                } else {
                    setStateCb();
                }
            });
            componentDidMount.apply(this, args);
        };

        //组件改变就会调用
        const componentDidUpdate = target.prototype.componentDidUpdate;
        target.prototype.componentDidUpdate = function(prevProps, prevState, snapshot) {
            const { location: { search: prevSearch } } = prevProps;
            const { location: { search: currSearch } } = this.props;
            const prevUrlParams = new URLSearchParams(prevSearch);

            //将旧的url参数转化 paramsObj格式 {namespace-filter-a-b...-e-f:value}
            const prev_paramsObj = ParamsToParamsObj(prevUrlParams);
            const currUrlParams = new URLSearchParams(currSearch);

            //将新的url参数转化 paramsObj格式 {namespace-filter-a-b...-e-f:value}
            const curr_paramsObj = ParamsToParamsObj(currUrlParams);
            Object.keys(config).forEach((method: string) => {

                //标记url参数是否改变
                let status: boolean = false;
                const filters = config[method];
                filters.forEach((filter: string) => {
                    if (!status) {
                        status = JudgeParamsStatus(namespace, filter, curr_paramsObj, prev_paramsObj);
                    }
                });
                if (status) {
                    //将paramsObj格式转为childObj格式 {namespace-filter-a-b...-e-f} to {filter:{a:{b:obj}}}
                    const paramsToChildObj = ParamsObjToObject(curr_paramsObj, namespace);

                    //将url参数值与state/props值合并生成新的state
                    const state = AssignObject(iSDav ? this.props : this.state,paramsToChildObj);

                    //获取跟filters相关的值
                    const params = CreateParamsByFilters(state, filters);
                    const setStateCb = () => {
                        const remoteReqMethodName = method || `fetch${method}`;
                        this[remoteReqMethodName].call(this, params);
                    };

                    //非Dav环境会帮忙设置state并调用method，Dav环境不会设置state只会调用method
                    if (!iSDav) {
                        this.setState(
                            {
                                ...state
                            },
                            setStateCb
                        );
                    } else {
                        setStateCb();
                    }
                }
            });
            if (componentDidUpdate) {
                componentDidUpdate.call(this, prevProps, prevState, snapshot);
            }
        };
    };
}

export function changeUrl(config: ChangeUrlConfig) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        const method = descriptor.value;
        descriptor.value = function(...args) {
            method.apply(this, args);
            const urlParams = new URLSearchParams();
            config.filters.forEach((filter) => {
                const params = ObjectToParamsObj(config.isDav ? this.props : this.state, config.namespace, filter);
                Object.keys(params).forEach((param) => {
                    urlParams.set(param, params[param]);
                });
            });
            this.props.history.push(`?${urlParams}`);
        };
    };
}
