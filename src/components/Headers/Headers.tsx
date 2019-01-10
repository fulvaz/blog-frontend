import { Layout } from "antd";
import * as React from "react";
const { Header } = Layout;

export class Headers extends React.Component<{
  left: JSX.Element;
  right: JSX.Element;
}> {
  public render() {
    const { left, right } = this.props;
    return (
      <Header
        className="flex flex-jcsb"
        style={{
          background: "#fff", 
          padding: '0',
          paddingLeft: '20px',
          boxShadow: "0 3px 6px rgba(3, 4, 6, .2)",
          zIndex: 1039,
        }}
      >
        <div className="flex flex-ac">{left}</div>
        <div className="flex flex-ac">{right}</div>
      </Header>
    );
  }
}
