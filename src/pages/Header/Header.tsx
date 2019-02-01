import c from 'classnames';
import React from 'react';
import styles from './header.module.less';

export class Header extends React.Component {
    public render() {
        return (
            <section
                className={c(
                    'pos-f',
                    'flex',
                    'flex-jcsb',
                    'flex-aic',
                    'p-middle',
                    'background-b',
                    styles.headerContainer
                )}
            >
                <a href="/">Fulvaz PlayGroud</a>
                <i>显示介绍图标</i>
            </section>
        );
    }
}
