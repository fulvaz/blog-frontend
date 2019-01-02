import React, { Component } from "react";
import style from "./App.module.less";
import "./styles/antd.less";
import "./styles/atomic.less";
import { Layout, Icon } from "antd";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Headers } from "./Components/Headers/Headers";
import classNames from "classnames";
import { TablePage } from "./Pages/TablePage/TablePage";
import { FormPage } from "./Pages/FormPage/FormPage";
import { Switch, Route, Link, Router } from "dva/router";
import { connect, SubscriptionAPI } from "dva";
import { Dispatch } from "redux";
import { NotFound } from "./Pages/NotFound/NotFound";
import { IFrame } from './Components/IFrame/IFrame';
import {renderData as sidebarRenderData} from './models/Sidebar';
const { Content } = Layout;

const componentMapping = {
  1: TablePage,
  2: FormPage,
  3: NotFound,
}


@connect()
class App extends Component<{
  dispatch?: Dispatch<{ type: string; payload?: any }>;
  history: any;
}> {
  componentDidMount() {
    const sidebarData = JSON.parse(
      '[{"key":"客户管理","id":1,"pid":0,"name":"客户管理","description":"客户管理","platform":"OP","platformName":null},{"key":"Table","id":2,"pid":1,"name":"平台数据","description":"平台数据","platform":"OP","platformName":null},{"key":"素材管理","id":3,"pid":0,"name":"素材管理","description":"素材管理","platform":"OP","platformName":null},{"key":"我的素材","id":4,"pid":3,"name":"我的素材","description":"我的素材","platform":"OP","platformName":null},{"key":"素材数据","id":5,"pid":3,"name":"素材数据","description":"素材数据","platform":"OP","platformName":null},{"key":"转化管理","id":6,"pid":0,"name":"转化管理","description":"转化管理","platform":"OP","platformName":null},{"key":"转化列表","id":7,"pid":6,"name":"转化列表","description":"转化列表","platform":"OP","platformName":null},{"key":"权限管理","id":8,"pid":0,"name":"权限管理","description":"权限管理","platform":"OP","platformName":null},{"key":"表格","id":3,"pid":1,"name":"客户账户管理","description":"客户账户管理","platform":"OP","platformName":null},{"key":"公司平台管理","id":10,"pid":1,"name":"公司平台管理","description":"公司平台管理","platform":"OP","platformName":null},{"key":"爬取账户管理","id":11,"pid":1,"name":"爬取账户管理","description":"爬取账户管理","platform":"OP","platformName":null},{"key":"全部素材","id":12,"pid":3,"name":"全部素材","description":"全部素材","platform":"OP","platformName":null},{"key":"MAPI客户管理","id":13,"pid":0,"name":"MAPI客户管理","description":null,"platform":"OP","platformName":null},{"key":"代理商管理","id":14,"pid":13,"name":"代理商管理","description":null,"platform":"OP","platformName":null},{"key":"子客管理","id":15,"pid":13,"name":"子客管理","description":null,"platform":"OP","platformName":null},{"key":"投放报表","id":19,"pid":0,"name":"投放报表","description":"投放报表","platform":"OP","platformName":null},{"key":"效果报表","id":20,"pid":19,"name":"效果报表","description":"效果报表","platform":"OP","platformName":null},{"key":"结算报表","id":21,"pid":19,"name":"结算报表","description":"结算报表","platform":"OP","platformName":null},{"key":"人群包管理","id":24,"pid":0,"name":"人群包管理","description":"人群包管理","platform":"OP","platformName":null},{"key":"客户组管理","id":25,"pid":0,"name":"客户组管理","description":"客户组管理","platform":"OP","platformName":null},{"key":"渠道包管理","id":26,"pid":0,"name":"渠道包管理","description":"渠道包管理","platform":"OP","platformName":null},{"key":"财务报表","id":27,"pid":0,"name":"财务报表","description":null,"platform":"OP","platformName":null},{"key":"系统管理","id":32,"pid":0,"name":"系统管理","description":"系统管理","platform":"OP","platformName":null},{"key":"操作日志","id":33,"pid":32,"name":"操作日志","description":"操作日志","platform":"OP","platformName":null}]'
    );
    this.props.dispatch({ type: "sidebar/updateSidebar", data: sidebarData });
    this.props.dispatch({ type: "sidebar/updateTitle", data: "运营平台" });

    this.setState({
      routeIdsAllowed: sidebarData.map(e => e.id),
    })
  }

  render() {
    const { history } = this.props;
    // const {routeIdsAllowed} = this.state;
    // const routeAllow = routeIdsAllowed.map(id => {
    //   return (
    //     <Route exact path={sidebarRenderData[id].path} component={componentMapping[id]}  />
    //   )
    // });

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
                      <Route exact path="/" component={TablePage} />
                      <Route exact path="/form" component={FormPage} />
                      <Route exact path="/remote" render={() => (<React.Fragment />)} />
                      <Route component={NotFound} />
                      {/* {routeAllow} */}
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
