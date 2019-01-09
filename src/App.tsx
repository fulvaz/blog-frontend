import React, { Component } from "react";
import style from "./App.module.less";
import "./Styles/antd.less";
import "./Styles/atomic.less";
import { Layout, Icon } from "antd";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Headers } from "./Components/Headers/Headers";
import classNames from "classnames";
import { Switch, Route, Link, Router } from "dva/router";
import { connect, SubscriptionAPI } from "dva";
import { Dispatch } from "redux";
import { IFrame } from "./Components/IFrame/IFrame";
import { renderData as sidebarRenderData } from "./models/SidebarModel";
const { Content } = Layout;
import dynamic from "dva/dynamic";
import { NotFound } from "./Pages/NotFound/NotFound";


// 根据后端返回的信息, 渲染route
// key和返回的id一一对应, 其key是加载的路径
const app = window['__DVA_INSTANCE'];
const routeData = {
  2: {
    component: dynamic({
      app,
      // models: () => [].map(e => import(e)),
      component: () => import("./Pages/FormPage/FormPage").then(e => Object.values(e)[0])
    }),
  },
  3: {
    component: dynamic({
      app,
      component: () => import("./Pages/TablePage/TablePage").then(e => Object.values(e)[0])
    }),
  },
  10: {
    component: dynamic({
      app,
      component: () => import("./Pages/UrlStateExample/UrlStateExample").then(e => Object.values(e)[0])
    }),
  }
};

@connect()
class App extends Component<{
  dispatch?: Dispatch<{ type: string; payload?: any }>;
  history: any;
}> {
  state = {
    routeIdsAllowed: []
  };

  componentDidMount() {
    // 这里请求后台api, 获得sidebar菜单信息
    const sidebarData = JSON.parse(
      '[{"key":"Example","id":1,"pid":0,"name":"Example","description":"Example","platform":"OP","platformName":null},{"key":"Table","id":2,"pid":1,"name":"Form","description":"Form","platform":"OP","platformName":null},{"id":3,"pid":1,"name":"Table","description":"Table","platform":"OP","platformName":null},{"key":"url state","id":10,"pid":1,"name":"url state","description":"url state","platform":"OP","platformName":null}]'
    );
    this.props.dispatch({ type: "sidebar/updateSidebar", data: sidebarData });
    this.props.dispatch({ type: "sidebar/updateTitle", data: "运营平台" });

    this.setState({
      routeIdsAllowed: sidebarData.filter(e => e.pid !== 0).map(e => e.id)
    });
  }

  render() {
    const { history } = this.props;

    const { routeIdsAllowed } = this.state;
    const routeAllow = routeIdsAllowed.map(id => {
      return (
        <Route
          key={id}
          exact
          path={sidebarRenderData[id].path}
          component={routeData[id].component}
        />
      );
    });

    return (
      <Router history={history}>
        <div>
          <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
              <Headers
                left={<span>这是右边</span>}
                right={<span>这是左边</span>}
              />
              <Content>
                <div className={classNames(style["content-container"])}>
                  <div>
                    <Switch>
                      {routeAllow}
                      <Route
                        exact
                        path="/remote"
                        render={() => <React.Fragment />}
                      />
                      <Route exact path="/404" component={NotFound} />
                      <Route component={NotFound} />
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
