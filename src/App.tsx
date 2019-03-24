import React, { Component } from 'react';
import style from './App.module.less';
import './styles/antd.less';
import './styles/atomic.less';
import './styles/common.less';
import { RouteConfig } from './RouteConfig';
import { PageComponent } from './utils/type';

import { Header } from './pages/Header/Header';
import classNames from 'classnames';
import { Footer } from './pages/Footer/Footer';
import { Landscape } from './pages/Landscape/Landscape';
import ScrollTop from './components/ScrollTop/ScrollTop';
import { HashRouter } from 'react-router-dom';

class App extends Component<PageComponent<{}>> {
    render() {
        return (
            <HashRouter>
                <ScrollTop>
                    <Header />
                    <div className="pt50">
                        <Landscape />
                    </div>
                    <div className={classNames(style.content)}>
                        <RouteConfig />
                    </div>
                    <div>
                        <Footer />
                    </div>
                </ScrollTop>
            </HashRouter>
        );
    }
}

export default App;
