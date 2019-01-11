import { Layout, Menu } from 'antd';
import * as React from 'react';
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
import classNames from 'classnames';
import style from './Sidebar.module.less';
import { Iconfont } from '../Iconfont/Iconfont';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { PageComponent } from '../../utils/type';

@connect(state => {
  const {title, data, selectedKeys} = state.sidebar;
  return {title, data, selectedKeys};
})
export class Sidebar extends React.Component<PageComponent<{
  title?: string | JSX.Element;
  data?: any;
  selectedKeys?: string[],
}>> {
  public state: any = {
    collapsed: false
  };

  public render() {
    const { collapsed } = this.state;
    const {title, data = [], selectedKeys} = this.props;

    const menu = (
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" selectedKeys={selectedKeys}>
        {data.map(e => {
          if (e.children && e.children.length !== 0) {
            return (
              <SubMenu
                key={e.key}
                title={
                  <span>
                    <Iconfont type={e.icon} />
                    <span>{e.name}</span>
                  </span>
                }
              >
                {e.children.map(c => (
                  <Menu.Item key={c.id}>
                    <Link to={c.path}>
                      <span>{c.name}</span>
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={e.key}>
                <Link to={e.path}>
                  <Iconfont type={e.icon} />
                  <span>{e.name}</span>
                </Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );

    return (
      <Sider
        collapsible
        width="190"
        collapsed={collapsed}
        onCollapse={this.onCollapse}
        collapsedWidth="50"
      >
        <div className={style.h50}>
          <div className={style['title-head']}>
            <Iconfont type="icon-logo" className={classNames(style.icon)} />
            <p className="m0 ml10">{collapsed ? '' : title}</p>
          </div>
        </div>
        {menu}
      </Sider>
    );
  }
  public onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }
}
