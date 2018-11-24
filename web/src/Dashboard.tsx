import React, { Component } from "react";
import Notifications from "./Notifications";
import DeviceList from "./DeviceList";
import { connect } from "react-redux";
import { compose } from "redux";
import { DeviceState, SystemState, RootState } from "./interfaces";
import NewDeviceButton from "./NewDeviceButton";
import { firestoreConnect } from "react-redux-firebase";

interface State {}

interface Props {
  devices: DeviceState[];
}

class Dashboard extends Component<Props, State> {
  render() {
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
    devices: state.firestore.ordered.devices
  };
};

// FIXME
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "devices" }])
)(Dashboard);
