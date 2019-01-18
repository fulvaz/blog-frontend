import '@babel/polyfill';
import 'core-js/web'

import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import dva from 'dva';
import createLoading from 'dva-loading';
import { Global } from './models/globalModel';
import { Sidebar } from './models/sidebarModel';
import { IFrame } from './models/iFrameModel';


const app = dva();

app.use(createLoading({ effects: true }));

app.model(Global);
app.model(Sidebar);
app.model(IFrame);

// ReactDOM.render(
//   <HashRouter>
//     <App />
//   </HashRouter>,
//   document.getElementById("root")
// );

window['__DVA_INSTANCE'] = app;

app.router(({ history }) => <App history={history} />);

app.start('#root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
