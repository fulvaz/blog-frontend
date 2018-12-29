import React, { Component } from "react";
import style from "./App.module.less";
import "./styles/antd.less";
import "./styles/atomic.less";
import "./styles/iconfont.less";
import { Layout } from "antd";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Headers } from "./Components/Headers/Headers";
import classNames from "classnames";
import { TablePage } from "./Pages/TablePage/TablePage";
import { BrowserRouter, Route } from "react-router-dom";
import { FormPage } from "./Pages/FormPage/FormPage";

const { Content } = Layout;

class App extends Component {
  render() {
    console.log(style);

    const appTitle = "运营平台";

    return (
      <div>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar title={appTitle} />
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
