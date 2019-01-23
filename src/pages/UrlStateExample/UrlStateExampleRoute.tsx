import React from 'react';
import { Route } from 'dva/router';
import { PageComponent } from '../../utils/type';
import { BackendFilters } from './BackendFilters';
import { CustomCols } from './CustomCols';
import { FrontendFilters } from './FrontEndFilters';
import { Dva } from './Dva';

export class UrlStateExampleRoute extends React.Component<
  PageComponent<any>
> {
  render() {
    const { match } = this.props;
    return (
      <React.Fragment>
        <Route exact path={match.url + '/'} component={BackendFilters} />
        <Route exact path={match.url + '/custom-cols'} component={CustomCols} />
        <Route exact path={match.url + '/frontend-filtes'} component={FrontendFilters} />
        <Route exact path={match.url + '/with-dva'} component={Dva} />
      </React.Fragment>
    );
  }
}
