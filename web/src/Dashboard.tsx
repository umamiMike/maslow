import React, { Component } from "react";
import Notifications from "./Notifications";
import DeviceList from "./device/DeviceList";
import { connect } from "react-redux";
import { compose } from "redux";
import { DeviceType, PolicyDict, UserDict } from "./interfaces";
import { firestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

interface State {}

interface Props {
  devices: DeviceType[];
  auth: any;
  policyDict: PolicyDict;
  userDict: UserDict;
}

class Dashboard extends Component<Props, State> {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    if (
      this.props.devices == null ||
      this.props.userDict == null ||
      this.props.policyDict == null
    ) {
      return <h1>Loading…</h1>;
    }
    return (
      <div className="flex flex-row justify-between container">
        <DeviceList
          devices={this.props.devices}
          userDict={this.props.userDict}
          policyDict={this.props.policyDict}
        />
        <Notifications />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    devices: state.firestore.ordered.devices,
    auth: state.firebase.auth,
    userDict: state.firestore.data.users,
    policyDict: state.firestore.data.policies
  };
};

// FIXME
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "devices" }]),
  firestoreConnect([{ collection: "users" }]),
  firestoreConnect([{ collection: "policies" }])
)(Dashboard);
