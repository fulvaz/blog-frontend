import * as React from "react";
import { PageTitle } from "./PageTitle";
import { PageContent } from "./PageContent";
import style from "./PageLayout.module.less";

const { Component } = React;

export class PageLayout extends Component<{ ifBackShow?: boolean }> {
  public render() {
    const { children } = this.props;
    const title = React.Children.toArray(children).find(
      e => (e as any).type === PageTitle
    );
    const content = React.Children.toArray(children).find(
      e => (e as any).type === PageContent
    );
    console.log(children);
    return (
      <div>
        <div className={style.head}>{title}</div>
        <div className={style.content}>
          <div className="p20">{content}</div>
        </div>
      </div>
    );
  }
}
