import React, { Component } from 'react';
import style from './App.module.less';
import './styles/antd.less';
import './styles/atomic.less';
import './styles/common.less';
import { Router, Switch, Route } from 'dva/router';
import { connect } from 'dva';
import { RouteConfig } from './RouteConfig';
import { PageComponent } from './utils/type';

import { Header } from './pages/Header/Header';
import classNames from 'classnames';
import { Footer } from './pages/Footer/Footer';
import { Landscape } from './pages/Landscape/Landscape';
import { ArticleList } from './pages/ArticleList/ArticleList';

@connect()
class App extends Component<PageComponent<{}>> {
    render() {
        const { history } = this.props;
        return (
            <Router history={history}>
                <div>
                    <Header />
                    <div className="pt50">
                        <Landscape />
                    </div>
                    <div className={classNames(style.content)}>
                        <RouteConfig history={history} />
                    </div>
                    <div>
                        <Footer />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
