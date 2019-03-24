import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Component } from 'react';

class ScrollTop extends Component<RouteComponentProps<any>> {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollTop);
