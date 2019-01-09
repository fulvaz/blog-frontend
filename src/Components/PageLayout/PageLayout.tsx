import * as React from "react";
import { PageTitle } from "./PageTitle";
import { PageContent } from "./PageContent";
import style from "./PageLayout.module.less";
import classNames from "classnames";
import { IconFont } from "../IconFont/IconFont";
import { ReactElement } from 'react';

const { Component } = React;

export class PageLayout extends Component<{ ifBackShow?: boolean }> {
  public back = () => {
    history.back();
  };
  public render() {
    const { children, ifBackShow } = this.props;
    const title = React.Children.toArray(children).find(
      (e: ReactElement<any>) => { return e.type === PageTitle}
    );
    const content = React.Children.toArray(children).find(
      (e: ReactElement<any>) => { return e.type === PageContent}
    );

    const backBtn = (
      <React.Fragment>
        <span className={style.back} onClick={this.back}>
          <IconFont
            type="icon-fanhui"
            className={classNames("mr10", style["icon-back"])}
          />
          <span>返回</span>
        </span>

        <div className={style.divider} />
      </React.Fragment>
    );

    return (
      <div>
        <div className={style.head}>
          {ifBackShow && backBtn} {title}
        </div>
        <div className={style.content}>
          <div className="p20">{content}</div>
        </div>
      </div>
    );
  }
}
