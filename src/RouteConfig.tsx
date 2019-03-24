import React, { Component } from 'react';
import { NotFound } from './pages/NotFound/NotFound';
import { PageComponent } from './utils/type';
import { Switch, Route } from 'react-router-dom';
import { ArticleList } from './pages/ArticleList/ArticleList';
import { Article } from './pages/Article/Article';

// 根据后端返回的信息, 渲染route
// key和返回的id一一对应, 其key是加载的路径

export class RouteConfig extends Component<
    PageComponent<{
    }>
> {
    state = {
        routeIdsAllowed: [],
    };

    render() {
        return (
            <Switch>
                <Route exact key="/" path="/" component={ArticleList} />,
                <Route
                    exact
                    key="/article/:id"
                    path="/article/:id"
                    component={Article}
                />
                <Route exact path="/404" component={NotFound} />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
