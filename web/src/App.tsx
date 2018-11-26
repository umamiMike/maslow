import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./Dashboard";
import DeviceDetails from "./device/DeviceDetails";
import SiteDetails from "./site/SiteDetails";
import PolicyDetails from "./policy/PolicyDetails";
import CreateDevice from "./device/CreateDevice";
import CreateSite from "./site/CreateSite";
import CreatePolicy from "./policy/CreatePolicy";
import Signin from "./Signin";
import Signup from "./Signup";
import Policies from "./policy/Policies";
import Sites from "./site/Sites";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <header>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/new-device" component={CreateDevice} />
            <Route path="/device/:id" component={DeviceDetails} />
            <Route path="/sites" component={Sites} />
            <Route path="/new-site" component={CreateSite} />
            <Route path="/site/:id" component={SiteDetails} />
            <Route path="/policies" component={Policies} />
            <Route path="/new-policy" component={CreatePolicy} />
            <Route path="/policy/:id" component={PolicyDetails} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </header>
      </BrowserRouter>
    );
  }
}

export default App;
