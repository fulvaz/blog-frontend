import * as React from "react";
import { connect } from 'dva';
import {IframeComm} from './IFrameComm';

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
    
    

    return <IframeComm targetOrigin="*" handleReceiveMessage={this.onReceiveMessage} postMessageData={'from parent'} attributes={{src, style: {width: '100%', height: 'calc(100vh - 50px)', display}}} />;
  }
}



