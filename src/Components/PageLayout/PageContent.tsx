import * as React from "react";

export class PageContent extends React.Component {
  public render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
