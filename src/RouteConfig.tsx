import React, { Component } from 'react';
import { NotFound } from './pages/NotFound/NotFound';
import { Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import { connect, SubscriptionAPI } from 'dva';
import { PageComponent } from './utils/type';

// 根据后端返回的信息, 渲染route
// key和返回的id一一对应, 其key是加载的路径

function genConfig(app) {
    return {
        form: {
            path: '/form',
            component: (dynamic as any)({
                app,
                component: () =>
                    import('./pages/FormPage/FormPage').then(
                        e => Object.values(e)[0]
                    ),
            }),
        },
        table: {
            path: '/table',
            component: (dynamic as any)({
                app,
                component: () =>
                    import('./pages/TablePage/TablePage').then(
                        e => Object.values(e)[0]
                    ),
            }),
        },
        urlState: {
            path: '/url-state',
            component: (dynamic as any)({
                app,
                models: () => [
                    import('./pages/UrlStateExample/dvaModel').then(
                        e => Object.values(e)[0]
                    ),
                ],
                component: () =>
                    import('./pages/UrlStateExample/UrlStateExampleRoute').then(
                        e => Object.values(e)[0]
                    ),
            }),
        },
    };
}

@connect(({ sidebar }) => ({ sidebar }))
export class RouteConfig extends Component<
    PageComponent<{
        sidebar?: any;
    }>
> {
    state = {
        routeIdsAllowed: [],
        config: genConfig(window['__DVA_INSTANCE']),
    };


    render() {
        const { config } = this.state;
        const routeIdsAllowed = this.props.sidebar.dataFlat.map(e => e.key);
        const routeAllow = routeIdsAllowed
            .map(key => {
                if (!config[key]) return;
                return (
                    <Route
                        key={key}
                        path={config[key].path}
                        component={config[key].component}
                    />
                );
            })
            .filter(e => e);

        // 添加根路由 /
        const keyFirst = routeIdsAllowed.find(e => config[e]);

        if (keyFirst) {
            routeAllow.unshift(
                <Route
                    exact
                    key="/"
                    path="/"
                    component={config[keyFirst].component}
                />
            );

            // 跳根路径非常不妙
            if (this.props.location.pathname === '/') {
                setTimeout(() => {
                    this.props.history.push(config[keyFirst].path);
                });
            }
        }

        return (
            <Switch>
                {routeAllow}
                <Route exact path="/remote" render={() => <React.Fragment />} />
                <Route exact path="/404" component={NotFound} />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
