const DEFAULT_STATE_KEY = '__defaultState';

interface PutStateInUrlConfig {
  [namespace: string]: {
    api: string;
  };
}

interface ChangeUrlConfig {
  namespace: string;
  filters: string[];
}

export function putStateInUrl(config: PutStateInUrlConfig): any {
  return function(target): any {
    const componentDidMount = target.prototype.componentDidMount;
    target.prototype.componentDidMount = function(...args) {
      this[DEFAULT_STATE_KEY] = JSON.parse(JSON.stringify(this.state));

      const {
        location: { search: currSearch }
      } = this.props;
      const currUrlParams = new URLSearchParams(currSearch);

      try {
        Object.keys(config).forEach(k => {
          if (currUrlParams.get(k)) {
            const data = JSON.parse(currUrlParams.get(k));
            this.state = {
              ...this.state,
              ...data
            };
          }
        });
      } catch (e) {
        // JSON parse err
        // 什么都不做即可
        console.warn(`UrlState: Url param syntax err: ${e.message}`);
      }
      componentDidMount.apply(this, args);
    };

    const componentDidUpdate = target.prototype.componentDidUpdate;
    target.prototype.componentDidUpdate = function(
      prevProps,
      prevState,
      snapshot
    ) {
      // 暂时没想到更好的方法, 因为setState是异步的, 虽然有提供回调, 但decorator取不到
      const {
        location: { search: prevSearch }
      } = prevProps;
      const {
        location: { search: currSearch }
      } = this.props;
      const prevUrlParams = new URLSearchParams(prevSearch);
      const currUrlParams = new URLSearchParams(currSearch);

      Object.keys(config).forEach(k => {
        if (prevUrlParams.get(k) !== currUrlParams.get(k)) {
          const setStateCb = () => {
            const remoteReqMethodName = config[k].api || `fetch${k}`;
            this[remoteReqMethodName].apply(this);
          };

          const restoreDefaultState = () => {
            this.setState(
              {
                ...this[DEFAULT_STATE_KEY]
              },
              setStateCb
            );
          };

          try {
            if (currUrlParams.get(k)) {
              // TODO:
              const data = JSON.parse(currUrlParams.get(k));
              this.setState(
                {
                  ...data
                },
                setStateCb
              );
            } else {
              restoreDefaultState();
            }
          } catch (e) {
            restoreDefaultState();
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
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    const method = descriptor.value;
    descriptor.value = function(...args) {
      method.apply(this, args);
      const urlParams = new URLSearchParams();
      const data = config.filters.reduce((p, k) => {
        return {
          ...p,
          [k]: (this).state[k]
        };
      }, {});
      urlParams.set(config.namespace, JSON.stringify(data));
      ((this).props).history.push(`?${urlParams}`);
    };
  };
}
