import * as React from "react";
import { connect } from 'dva';
import { Redirect } from 'dva/router';
import {IframeComm} from './IFrameComm';

const WHITE_LIST = [
    'dev-test.jpushoa.com',
];

if (process.env.NODE_ENV === 'local') {
    WHITE_LIST.push('localhost');
    WHITE_LIST.push('127.0.0.1');
}

@connect(state => {
    const {src, ifHide} = state.iframe;
    return {
        src,
        ifHide,
    }
})
export class IFrame extends React.Component<{
    src?: string;
    ifHide?: boolean;
}> {
    public prevListener;

    public onReceiveMessage = (e) => {
        console.log(e);
    }

  public render() {
    const { src, ifHide } = this.props;
    const display = ifHide ? 'none' : 'block';
    
    try {
        const decodedSrc = atob(src);
        const urlInfo = new URL(decodedSrc);
        const {hostname} = urlInfo;
        if (!WHITE_LIST.includes(hostname)) {
            return <Redirect to="/404" />
        }
        return <IframeComm targetOrigin="*" handleReceiveMessage={this.onReceiveMessage} postMessageData={'from parent'} attributes={{src: decodedSrc, style: {width: '100%', height: 'calc(100vh - 50px)', display}}} />;
    } catch(e) {
        return <Redirect to="/404" />
    }
    
    
  }
}



