import React, { Component } from "react";
import style from "./App.module.less";
import "./styles/antd.less";
import "./styles/atomic.less";
import { Layout, Icon } from "antd";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Headers } from "./Components/Headers/Headers";
import classNames from "classnames";
import { TablePage } from "./Pages/TablePage/TablePage";
import { BrowserRouter, Route } from "react-router-dom";
import { FormPage } from "./Pages/FormPage/FormPage";
import { render } from 'react-dom';

const { Content } = Layout;

class App extends Component {
  transformSidebarData = data => {
    if (!data.length) return;
    const renderData = {
      1: { icon: "icon-Pagex", path: "/material-data/designer" },
      2: { icon: "", path: "/platform-data/channel" },
      3: {
        path: "/material-data/designer", // customer-management
        icon: "icon-icon-test23"
      },
      4: {
        path: "/material-data/designer/home",
        icon: "icon-icon-test23"
      },
      5: {
        path: "/material-data/report",
        icon: ""
      },
      6: {
        path: "/conversion-data/conversions", // customer-management
        icon: "icon-Pagex"
      },
      7: {
        path: "/conversion-data/conversions",
        icon: ""
      },
      8: {
        path: "/user-data/users",
        icon: "icon-icon-test22"
      },
      9: {
        path: "/platform-data/customer",
        icon: ""
      },
      10: {
        path: "/platform-data/company",
        icon: "icon-guidang"
      },
      11: {
        path: "/platform-data/web-crawler",
        icon: ""
      },
      12: {
        path: "/material-data/material",
        icon: ""
      },
      13: {
        path: "/mapi-customer/agency",
        icon: "icon-Pagex"
      },
      14: {
        path: "/mapi-customer/agency",
        icon: "icon-Pagex"
      },
      15: {
        path: "/mapi-customer/guest",
        icon: "icon-Pagex"
      },
      19: {
        path: "/settlements-data/effect",
        icon: "icon-icon-test5"
      },
      20: {
        path: "/settlements-data/effect",
        icon: "icon-Pagex"
      },
      21: {
        path: "/settlements-data/settlement",
        icon: "icon-Pagex"
      },
      26: {
        path: "/pkg-data/pkgs",
        icon: "icon-Pagex"
      },
      32: {
        path: "/finance-data/finance",
        icon: "icon-Pagex"
      },
      24: {
        path: "/audience",
        icon: "icon-Pagex"
      },
      25: {
        path: "/audience",
        icon: "icon-Pagex"
      },
      27: {
        path: "/customer-group",
        icon: "icon-Pagex"
      },
      32: {
        path: "/customer-group",
        icon: "icon-Pagex"
      },
      33: {
        path: "/customer-group",
        icon: "icon-Pagex"
      },
    };
    
    return data
      .map(e => {
        return {
          ...e,
          icon: renderData[e.id].icon,
          path: renderData[e.id].path,
          children: data.filter(d => d.pid === e.id).map(e => {
            return {
              ...e,
              icon: renderData[e.id].icon,
              path: renderData[e.id].path,
            }
          }),
        };
      })
      .filter(e => e.pid === 0);
  };

  render() {
    const appTitle = "运营平台";
    const sidebarData = JSON.parse(
      '[{"key":"客户管理","id":1,"pid":0,"name":"客户管理","description":"客户管理","platform":"OP","platformName":null},{"key":"平台数据","id":2,"pid":1,"name":"平台数据","description":"平台数据","platform":"OP","platformName":null},{"key":"素材管理","id":3,"pid":0,"name":"素材管理","description":"素材管理","platform":"OP","platformName":null},{"key":"我的素材","id":4,"pid":3,"name":"我的素材","description":"我的素材","platform":"OP","platformName":null},{"key":"素材数据","id":5,"pid":3,"name":"素材数据","description":"素材数据","platform":"OP","platformName":null},{"key":"转化管理","id":6,"pid":0,"name":"转化管理","description":"转化管理","platform":"OP","platformName":null},{"key":"转化列表","id":7,"pid":6,"name":"转化列表","description":"转化列表","platform":"OP","platformName":null},{"key":"权限管理","id":8,"pid":0,"name":"权限管理","description":"权限管理","platform":"OP","platformName":null},{"key":"客户账户管理","id":9,"pid":1,"name":"客户账户管理","description":"客户账户管理","platform":"OP","platformName":null},{"key":"公司平台管理","id":10,"pid":1,"name":"公司平台管理","description":"公司平台管理","platform":"OP","platformName":null},{"key":"爬取账户管理","id":11,"pid":1,"name":"爬取账户管理","description":"爬取账户管理","platform":"OP","platformName":null},{"key":"全部素材","id":12,"pid":3,"name":"全部素材","description":"全部素材","platform":"OP","platformName":null},{"key":"MAPI客户管理","id":13,"pid":0,"name":"MAPI客户管理","description":null,"platform":"OP","platformName":null},{"key":"代理商管理","id":14,"pid":13,"name":"代理商管理","description":null,"platform":"OP","platformName":null},{"key":"子客管理","id":15,"pid":13,"name":"子客管理","description":null,"platform":"OP","platformName":null},{"key":"投放报表","id":19,"pid":0,"name":"投放报表","description":"投放报表","platform":"OP","platformName":null},{"key":"效果报表","id":20,"pid":19,"name":"效果报表","description":"效果报表","platform":"OP","platformName":null},{"key":"结算报表","id":21,"pid":19,"name":"结算报表","description":"结算报表","platform":"OP","platformName":null},{"key":"人群包管理","id":24,"pid":0,"name":"人群包管理","description":"人群包管理","platform":"OP","platformName":null},{"key":"客户组管理","id":25,"pid":0,"name":"客户组管理","description":"客户组管理","platform":"OP","platformName":null},{"key":"渠道包管理","id":26,"pid":0,"name":"渠道包管理","description":"渠道包管理","platform":"OP","platformName":null},{"key":"财务报表","id":27,"pid":0,"name":"财务报表","description":null,"platform":"OP","platformName":null},{"key":"系统管理","id":32,"pid":0,"name":"系统管理","description":"系统管理","platform":"OP","platformName":null},{"key":"操作日志","id":33,"pid":32,"name":"操作日志","description":"操作日志","platform":"OP","platformName":null}]'
    );

    
    return (
      <div>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar
            title={appTitle}
            data={this.transformSidebarData(sidebarData)}
          />
          <Layout>
            <Headers
              left={<span>这是右边</span>}
              right={<span>这是左边</span>}
            />
            <Content>
              <div className={classNames(style["content-container"])}>
                <div>
                  <Route path="/" component={TablePage} />
                  <Route path="/form" component={FormPage} />
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
