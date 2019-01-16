import React, { ReactElement } from 'react';
import style from './PageLayout.module.less';
import classNames from 'classnames';
import { Iconfont } from '../Iconfont/Iconfont';
import { PageTitle } from '../PageLayout/PageTitle';
import { PageContent } from '../PageLayout/PageContent';
import { PageControlLeft } from './PageControlLeft';
import { PageControlRight } from './PageControlRight';

const { Component } = React;

export class PageLayout extends Component<{ ifBackShow?: boolean }> {
  public back = () => {
    history.back();
  };
  public render() {
    const { children, ifBackShow } = this.props;
    const title = React.Children.toArray(children).find(
      (e: ReactElement<any>) => {
        return e.type === PageTitle;
      }
    );
    const content = React.Children.toArray(children).find(
      (e: ReactElement<any>) => {
        return e.type === PageContent;
      }
    );
    const controlLeft = React.Children.toArray(children).find(
      (e: ReactElement<any>) => {
        return e.type === PageControlLeft;
      }
    );
    const controlRight = React.Children.toArray(children).find(
      (e: ReactElement<any>) => {
        return e.type === PageControlRight;
      }
    );

    const backBtn = (
      <React.Fragment>
        <span className={style.back} onClick={this.back}>
          <Iconfont
            type="icon-fanhui"
            className={classNames('mr10', style['icon-back'])}
          />
          <span>返回</span>
        </span>

        <div className={style.divider} />
      </React.Fragment>
    );

    const pageControl =
      controlLeft || controlRight ? (
        <div className="mb20 flex flex-jcsb">
          <div>{controlLeft}</div>
          <div>{controlRight}</div>
        </div>
      ) : (
        ''
      );

    return (
      <div>
        <div className={style.head}>
          {ifBackShow && backBtn} {title}
        </div>
        <div className={style.content}>
          <div className="p20">
            {pageControl}
            <div>{content}</div>
          </div>
        </div>
      </div>
    );
  }
}
