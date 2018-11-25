import React, { Component } from "react";
import Notifications from "./Notifications";
import DeviceList from "./DeviceList";
import { connect } from "react-redux";
import { compose } from "redux";
import { DeviceState, SystemState, RootState } from "./interfaces";
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
      <div className="flex flex-row justify-between container">
        <DeviceList devices={this.props.devices} />
        <Notifications />
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
