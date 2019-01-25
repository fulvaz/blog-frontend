import React from 'react';
import { Route } from 'dva/router';
import { PageComponent } from '../../utils/type';
import { CustomFilter } from './CustomFilters';
import { FrontendFilters } from './FrontEndFilters';
import { Dva } from './Dva';
import { CommonFilters } from './CommonFilters';

export class UrlStateExampleRoute extends React.Component<
  PageComponent<any>
> {
  render() {
    const { match } = this.props;
    return (
      <React.Fragment>
        <Route exact path={match.url + '/'} component={CommonFilters} />
        <Route exact path={match.url + '/custom-filters'} component={CustomFilter} />
        <Route exact path={match.url + '/with-dva'} component={Dva} />
      </React.Fragment>
    );
  }
}
