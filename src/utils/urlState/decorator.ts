import { UrlStateConfig, UrlStateFactory } from './urlStateFactory';

export class UrlStateDecorator {
    constructor(private config: UrlStateConfig) {}
}

const changeUrlMethod = Symbol('decoratedMethod');
const fetchApiMethod = Symbol('fetchApiMethod');

export function urlState(config: UrlStateConfig = {}): any {
    // 人一定要有梦想, 万一哪天实现了自动序列化呢?
    // if (typeof stringify === 'object') {
    //     // TODO: 处理只传config的情况 (不知道啥时候能做到)
    //     // tslint:disable-next-line: no-parameter-reassignment
    //     config = stringify;
    // }

    return function(target) {
        const componentDidMount = target.prototype.componentDidMount;

        // 这里做了一次重构, 将原来在外面配置的apiConfig通过装饰器的方法传递进来

        Object.getOwnPropertyNames(target.prototype)
            .filter(k => {
                // 是否为getter或者setter
                const descriptor = Object.getOwnPropertyDescriptor(
                    target.prototype,
                    k
                );
                return !descriptor.set && !descriptor.get;
            })
            .filter(k => typeof target.prototype[k] === 'function')
            .forEach(k => {
                if (target.prototype[k][fetchApiMethod]) {
                    const apiConfig = target.prototype[k][fetchApiMethod];
                    config.apiConfig = config.apiConfig || [];
                    config.apiConfig.push(apiConfig);
                }
            });

        const { stringify, parse } = config;
        const urlStateHandler = UrlStateFactory.build({
            ...config,
            stringify,
            parse,
        });

        target.prototype.componentDidMount = function(...args) {
            urlStateHandler.saveInitState(this);
            urlStateHandler.handleInit(this);
            if (componentDidMount) componentDidMount.apply(this, args);
        };

        const componentDidUpdate = target.prototype.componentDidUpdate;
        target.prototype.componentDidUpdate = function(
            prevProps,
            prevState,
            snapshot
        ) {
            const {
                location: { search: prevSearch },
            } = prevProps;
            const {
                location: { search: currSearch },
            } = this.props;

            urlStateHandler.handleUrlParamsChange(this, prevSearch, currSearch);
            if (componentDidUpdate) {
                componentDidUpdate.call(this, prevProps, prevState, snapshot);
            }
        };

        Object.getOwnPropertyNames(target.prototype)
            .filter(k => {
                // 是否为getter或者setter
                const descriptor = Object.getOwnPropertyDescriptor(
                    target.prototype,
                    k
                );
                return !descriptor.set && !descriptor.get;
            })
            .filter(k => typeof target.prototype[k] === 'function')
            .forEach(k => {
                if (
                    typeof target.prototype[k] === 'function' &&
                    target.prototype[k][changeUrlMethod]
                ) {
                    const method = target.prototype[k] as Function;
                    target.prototype[k] = function(...args) {
                        method.apply(this, args);
                        urlStateHandler.changeUrlParams(this);
                    };
                }
            });
    };
}

export function changeUrl() {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        target[propertyKey][changeUrlMethod] = true;
    };
}

export function fetchApi(config: { deps: string[] }) {
    return function(
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        target[propertyKey][fetchApiMethod] = { ...config, api: propertyKey };
    };
}
