import {} from 'antd';
import { Layout } from 'antd';
import * as React from 'react';
const { Header } = Layout;

export class Headers extends React.Component {
    public props: {
        left: JSX.Element,
        right: JSX.Element,
    }

    public render() {
        const {left, right} = this.props;
        return (
            <Header className="flex flex-jcsb" style={{ background: '#fff', padding: 0, boxShadow: '0 3px 6px rgba(3, 4, 6, .2)' }}>
                <div className="flex flex-ac">
                    {left}
                </div>
                <div className="flex flex-ac">
                    {right}
                </div>
            </Header>
        );
    }
}
