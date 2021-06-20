import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {WatMap, Login} from "./components";

function App() {
    return (
        < div
    className = "App" >
        < Router >
        < Switch >
        < Route
    path = "/"
    exact
    component = {()
=> <
    WatMap / >
}
    />
    < Route
    path = "/admin"
    exact
    component = {()
=> <
    Login / >
}
    />
    < /Switch>
    < /Router>
    < /div>
)
    ;
}

export default App;