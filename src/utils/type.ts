import { SubscriptionAPI } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { FormComponentProps } from 'antd/lib/form/Form';

export type PageComponent<T> = Partial<SubscriptionAPI> &
  Partial<RouteComponentProps> &
  T;

export type FormComponent<T> = PageComponent<T> & FormComponentProps;