import "babel-polyfill";
import "react-app-polyfill/ie11";
import React from "react";
import App from "./App";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";


ReactDOM.render(
  <App />,
  document.getElementById("root")
);

serviceWorker.unregister();
