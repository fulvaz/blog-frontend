import { RouteComponentProps } from 'react-router';
// import { FormComponentProps } from 'antd/lib/form/Form';

export type PageComponent<T> = Partial<RouteComponentProps> & T;

// export type FormComponent<T> = PageComponent<T> & FormComponentProps;
