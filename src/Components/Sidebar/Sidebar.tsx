import { Icon, Layout, Menu } from "antd";
import * as React from "react";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
import * as classNames from "classnames";
import style from "./Sidebar.module.less";

export class Sidebar extends React.Component {
  public state: any = {
    collapsed: false
  };

  public props: {
    title: string | JSX.Element;
  };

  public render() {
    console.log(style);
    const { title } = this.props;
    const { collapsed } = this.state;
    return (
      <Sider
        collapsible
        width="190"
        collapsed={collapsed}
        onCollapse={this.onCollapse}
        collapsedWidth="50"
      >
        <div className={style.h50}>
          <div className={style["title-head"]}>
            <i className={classNames("iconfont", style.icon)}>&#xe60e;</i>
            <p className="m0 ml10">{collapsed ? "" : title}</p>
          </div>
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Option 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
  public onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
}
