import React, { Component } from 'react';
import style from './App.module.less';
import './styles/antd.less';
import './styles/atomic.less';
import './styles/common.less';
import { Layout, Menu, Dropdown } from 'antd';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Headers } from './components/Headers/Headers';
import classNames from 'classnames';
import { Router, Switch } from 'dva/router';
import { connect } from 'dva';
import { IFrame } from './components/IFrame/IFrame';
const { Content } = Layout;
import { RouteConfig } from './RouteConfig';
import { PageComponent } from './utils/type';
import { Iconfont } from './components/Iconfont/Iconfont';
import { environment } from './enviroments';

@connect()
class App extends Component<PageComponent<{}>> {
  componentDidMount() {
    // 初始化sidebar

    this.props.dispatch({
      type: 'sidebar/fetchSidebar',
      payload: {}
    });
  }

  render() {
    const { history } = this.props;

    const userMenu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={environment.logout}
          >
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Router history={history}>
        <div>
          <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
              <Headers
                left={<span />}
                right={
                  <div className="flex">
                    <span className={classNames(style['header-icontainer'], 'cp')}>
                      <Iconfont type="icon-iconfontquestion" />
                    </span>
                    <span className={classNames(style['header-icontainer'], 'cp')}>
                      <Iconfont type="icon-icon-test26" />
                    </span>
                    <span className={classNames(style['header-icontainer'], 'cp')}>
                      <Iconfont type="icon-ArtboardCopy1" />
                    </span>
                    <Dropdown overlay={userMenu} >
                      <span className={classNames(style['header-icontainer'], 'cp')}>
                        <div>
                        <Iconfont type="icon-icon-test24" />
                        </div>
                      </span>
                    </Dropdown>
                  </div>
                }
              />
              <Content>
                <div className={classNames(style['content-container'])}>
                  <div>
                    <Switch>
                      <RouteConfig history={history} />
                    </Switch>
                    <IFrame />
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>
      </Router>
    );
  }
}

export default App;
