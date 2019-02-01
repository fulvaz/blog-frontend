// polyfill here
import '@babel/polyfill';
import 'url-search-params-polyfill';
import 'raf/polyfill';


import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import dva from 'dva';


const app = dva();


// app.model(Global);

window['__DVA_INSTANCE'] = app;

app.router(({ history }) => <App history={history} />);

app.start('#root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
