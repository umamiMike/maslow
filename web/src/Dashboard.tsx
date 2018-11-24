import React, { Component } from "react";
import Notifications from "./Notifications";
import DeviceList from "./DeviceList";
import { connect } from "react-redux";
import { compose } from "redux";
import { DeviceState, SystemState, RootState } from "./interfaces";
import NewDeviceButton from "./NewDeviceButton";
import { firestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

interface State {}

interface Props {
  devices: DeviceState[];
  auth: any;
}

class Dashboard extends Component<Props, State> {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m6">
            <DeviceList devices={this.props.devices} />
            <NewDeviceButton />
          </div>
          <div className="col s12 m5 offset-m1">
            <Notifications />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    devices: state.firestore.ordered.devices,
    auth: state.firebase.auth
  };
};

// FIXME
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "devices" }])
)(Dashboard);
