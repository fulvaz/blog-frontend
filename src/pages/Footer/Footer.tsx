import classNames from 'classnames';
import React from 'react';
import styles from './footer.module.less';

export class Footer extends React.Component {
    public render() {
        return (
            <section className={classNames('flex', 'flex-jcc', 'flex-aic', 'p-middle', 'background-b', styles.container)}>
                <span>Ha Ha Ha!</span>
            </section>
        );
    }
}

