import * as React from "react";

export class IframeComm extends React.Component {
    constructor() {
        super();
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidMount() {
        window.addEventListener("message", this.onReceiveMessage);
        this._frame.addEventListener("load", this.onLoad);
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.onReceiveMessage, false);
    }
    componentWillReceiveProps(nextProps) {
            // send a message if postMessageData changed
            this.sendMessage(nextProps.postMessageData);
    }
    onReceiveMessage(event) {
        const { handleReceiveMessage } = this.props;
        if (handleReceiveMessage) {
            handleReceiveMessage(event);
        }
    }
    onLoad() {
        const { handleReady } = this.props;
        if (handleReady) {
            handleReady();
        }
        // TODO: Look into doing a syn-ack TCP-like handshake
        //       to make sure iFrame is ready to REALLY accept messages, not just loaded.
        // send intial props when iframe loads
        this.sendMessage(this.props.postMessageData);
    }
    serializePostMessageData(data) {
        // Rely on the browser's built-in structured clone algorithm for serialization of the
        // message as described in
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
        if (!this.props.serializeMessage) {
            return data;
        }

        // To be on the safe side we can also ignore the browser's built-in serialization feature
        // and serialize the data manually.
        if (typeof data === "object") {
            return JSON.stringify(data);
        } else if (typeof data === "string") {
            return data;
        } else {
            return `${data}`;
        }
    }
    sendMessage(postMessageData) {
        // Using postMessage data from props will result in a subtle but deadly bug,
        // where old data from props is being sent instead of new postMessageData.
        // This is because data sent from componentWillReceiveProps is not yet in props but only in nextProps.
        const { targetOrigin } = this.props;
        const serializedData = this.serializePostMessageData(postMessageData);
        this._frame.contentWindow.postMessage(serializedData, targetOrigin);
    }
    render() {
        const { attributes } = this.props;
        // define some sensible defaults for our iframe attributes
        const defaultAttributes = {
            allowFullScreen: false,
            frameBorder: 0
        };
        // then merge in the user's attributes with our defaults
        const mergedAttributes = Object.assign(
            {},
            defaultAttributes,
            attributes
        );
        return (
            <iframe
                ref={el => {
                    this._frame = el;
                }}
                {...mergedAttributes}
            />
        );
    }
}
