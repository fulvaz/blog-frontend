import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import dva from "dva";
import { Router, Switch, Route } from "dva/router";
import { Global } from "./models/globalModel";
import { Sidebar } from "./models/sidebarModel";
import { IFrame } from "./models/iFrameModel";


const app = dva();


app.model(Global);
app.model(Sidebar);
app.model(IFrame);

// ReactDOM.render(
//   <HashRouter>
//     <App />
//   </HashRouter>,
//   document.getElementById("root")
// );

app.router(({ history }) => (
    <App history={history} />
));

app.start("#root");

window['__DVA_INSTANCE'] = app;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
