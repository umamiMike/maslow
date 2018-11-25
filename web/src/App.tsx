import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import DeviceDetails from "./DeviceDetails";
import CreateDevice from "./CreateDevice";
import CreateSite from "./CreateSite";
import Signin from "./Signin";
import Signup from "./Signup";
import Policies from "./Policies";
import Sites from "./Sites";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <header>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/device/:id" component={DeviceDetails} />
            <Route path="/new-device" component={CreateDevice} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Route path="/policies" component={Policies} />
            <Route path="/sites" component={Sites} />
            <Route path="/new-site" component={CreateSite} />
          </Switch>
        </header>
      </BrowserRouter>
    );
  }
}

export default App;
