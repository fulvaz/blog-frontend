const DEFAULT_STATE_KEY = '__defaultState';

interface PutStateInUrlConfig {
    [method: string]: string[];
}

interface ChangeUrlConfig {
    namespace: string;
    filters: string[];
    isDav?: boolean;
}

function FindObject(namespace: string, obj: {}, filter?: string) {
    const params = {};
    Object.keys(obj).forEach((key) => {
        if (key === filter || !filter) {
            if (typeof obj[key] === `object`) {
                if (!Array.isArray(obj[key])) {
                    const child = FindObject(`${namespace}-${key}`, obj[key]);
                    Object.assign(params, child);
                } else {
                    params[`${namespace}-${key}`] = obj[key].length > 0 ? obj[key].join(`,`) : null;
                }
            } else {
                if (typeof obj[key] !== `function`) {
                    if (typeof obj[key] !== undefined) {
                        if (typeof obj[key] === `boolean` || typeof obj[key] === `number`) {
                            if (filter) {
                                params[`${namespace}-${filter}-${key}`] = obj[key];
                            } else {
                                params[`${namespace}-${key}`] = obj[key];
                            }
                        } else {
                            if (filter) {
                                params[`${namespace}-${filter}-${key}`] = obj[key] ? obj[key] : null;
                            } else {
                                params[`${namespace}-${key}`] = obj[key] ? obj[key] : null;
                            }
                        }
                    }
                }
            }
        }
    });
    return params;
}

function ArrToObject(arr: string[], value) {
    const obj = {};
    if (arr.length === 1) {
        obj[arr[0]] = value;
    } else {
        arr.forEach((key, i) => {
            const index = arr.length - 1 - i;

            if (i === 0) {
                obj[arr[index]] = value;
            }
            if (i > 0) {
                obj[arr[index]] = {};
                obj[arr[index]][arr[index + 1]] = obj[arr[index + 1]];
            }
            if (i > 0) {
                delete obj[arr[index + 1]];
            }
        });
    }
    return obj;
}

function AssignObject(origin: {}, value: {}) {
    const obj = JSON.parse(JSON.stringify(origin));
    const obj_keys = Object.keys(obj);
    Object.keys(value).forEach((value_key) => {
        if (obj_keys.indexOf(value_key) === -1) {
            obj[value_key] = value[value_key];
        } else {
            obj[value_key] = AssignObject(obj[value_key], value[value_key]);
        }
    });
    return obj;
}

function CreateObject(obj: {}, namespace?: string) {
    const params = {};
    Object.keys(obj).forEach((key: string) => {
        if ((namespace && key.indexOf(namespace) === 0) || !namespace) {
            const arr = key.split(`-`);
            arr.splice(0, 1);
            if (params[arr[0]]) {
                params[arr[0]] = AssignObject(params[arr[0]], ArrToObject(arr, obj[key])[arr[0]]);
            } else {
                params[arr[0]] = ArrToObject(arr, obj[key])[arr[0]];
            }
        }
    });
    return params;
}

export function putStateInUrl(namespace: string, config: PutStateInUrlConfig, iSDav?: boolean): any {
    return function(target): any {
        const componentDidMount = target.prototype.componentDidMount;
        target.prototype.componentDidMount = function(...args) {
            this[DEFAULT_STATE_KEY] = JSON.parse(JSON.stringify(iSDav ? this.props : this.state));
            /*初始化部分，将url映射到state */
            const { location: { search: currSearch } } = this.props;
            const currUrlParams = new URLSearchParams(currSearch);
            const curr_params = {};
            currUrlParams.forEach((value, key) => {
                curr_params[key] = value;
            });
            Object.keys(config).forEach((method: string) => {
                const changeParams = [];
                const params = {};
                const cb = {};
                config[method].forEach((filter: string) => {
                    Object.keys(curr_params).forEach((curr) => {
                        if (curr.indexOf(`${namespace}-${filter}`) === 0) {
                            if (curr_params[curr]) {
                                params[curr] = curr_params[curr];
                                changeParams.push(true);
                            }
                        }
                    });
                });
                const start = AssignObject(CreateObject(params, namespace), this[DEFAULT_STATE_KEY]);
                if (!iSDav) {
                    this.setState({
                        ...start
                    });
                }
                config[method].forEach((filter: string) => {
                    cb[filter] = start[filter];
                });
                const setStateCb = () => {
                    const remoteReqMethodName = method || `fetch${method}`;

                    this[remoteReqMethodName].call(this, cb);
                };
                if (changeParams.length > 0 || Object.keys(curr_params).length === 0) {
                    setStateCb();
                }
            });
            componentDidMount.apply(this, args);
        };

        const componentDidUpdate = target.prototype.componentDidUpdate;
        target.prototype.componentDidUpdate = function(prevProps, prevState, snapshot) {
            // 暂时没想到更好的方法, 因为setState是异步的, 虽然有提供回调, 但decorator取不到
            const { location: { search: prevSearch } } = prevProps;
            const { location: { search: currSearch } } = this.props;
            const prevUrlParams = new URLSearchParams(prevSearch);
            const prev_params = {};
            prevUrlParams.forEach((value, key) => {
                prev_params[key] = value;
            });
            const currUrlParams = new URLSearchParams(currSearch);
            const curr_params = {};
            currUrlParams.forEach((value, key) => {
                curr_params[key] = value;
            });
            /*处理currUrlParams，防止有些参数因为为空被忽略了 */
            Object.keys(config).forEach((method: string) => {
                const changeParams = [];
                const params = {};
                config[method].forEach((filter: string) => {
                    Object.keys(prev_params).forEach((prev) => {
                        Object.keys(curr_params).forEach((curr) => {
                            if (
                                curr.indexOf(`${namespace}-${filter}`) === 0 ||
                                prev.indexOf(`${namespace}-${filter}`) === 0
                            ) {
                                if (curr_params[curr]) {
                                    params[curr] = curr_params[curr];
                                }
                                if (prev_params[curr] !== params[curr] || prev_params[prev] !== params[prev]) {
                                    changeParams.push(true);
                                }
                            }
                        });
                    });
                });
                const setStateCb = () => {
                    const remoteReqMethodName = method || `fetch${method}`;
                    this[remoteReqMethodName].call(this, CreateObject(params, namespace));
                };
                if (changeParams.length > 0) {
                    setStateCb();
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
                const params = FindObject(config.namespace, config.isDav ? this.props : this.state, filter);
                Object.keys(params).forEach((param) => {
                    urlParams.set(param, params[param]);
                });
            });
            this.props.history.push(`?${urlParams}`);
        };
    };
}
