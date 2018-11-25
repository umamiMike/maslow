import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import DeviceDetails from "./DeviceDetails";
import CreateDevice from "./CreateDevice";
import Signin from "./Signin";
import Signup from "./Signup";

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
          </Switch>
        </header>
      </BrowserRouter>
    );
  }
}

export default App;
