import { UrlStateConfig, UrlStateFactory } from './urlStateFactory';

export class UrlStateDecorator {
    constructor(private config: UrlStateConfig) {}
}

// export function urlState(config: UrlStateConfig);
export function urlState(
    stringify: (data) => any,
    parse: (param) => any,
    config: UrlStateConfig
): any {
    // 人一定要有梦想, 万一哪天实现了自动序列化呢?
    if (typeof stringify === 'object') {
        // TODO: 处理只传config的情况 (不知道啥时候能做到)
        // tslint:disable-next-line: no-parameter-reassignment
        config = stringify;
    }

    const urlStateHandler = UrlStateFactory.build({
        ...config,
        serializer: { stringify, parse },
    });

    return function(target) {
        const componentDidMount = target.prototype.componentDidMount;

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

        config.methodChange.forEach(methodName => {
            const method = target.prototype[methodName];
            target.prototype[methodName] = function(...args) {
                method.apply(this, args);
                urlStateHandler.changeUrlParams(this);
            };
        });
    };
}
