import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import {
  DeviceType,
  UserDict,
  UserType,
  PolicyDict,
  PolicyType,
  TemporaryPolicyType
} from "../interfaces";
import {
  deleteDevice,
  createTemporaryPolicy,
  editDevice
} from "../store/systemActions";
import ActionPanel from "./ActionPanel";
import ExtraDetails from "./ExtraDetails";
import EditDevice from "./EditDevice";

interface ParamType {
  id: string;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  auth: any;
  match: MatchType; // From React Router
  device: DeviceType;
  policyDict: PolicyDict;
  policies: PolicyType[];
  userDict: UserDict;
  users: UserType[];
  temporaryPolicies: TemporaryPolicyType[];

  createTemporaryPolicy: any;
  deleteDevice: any;
  editDevice: any;
}

interface State {
  editing: boolean;
  reload: boolean;
}

class DeviceDetails extends Component<Props, State> {
  state: State = {
    editing: false,
    reload: false
  };

  deleteDevice = () => {
    this.props.deleteDevice(this.props.match.params.id);
    this.setState({ reload: true });
  };

  startEditDevice = () => {
    this.setState({ editing: true });
  };

  cancelEditDevice = () => {
    this.setState({ editing: false });
  };

  finishEditDevice = (device: DeviceType) => {
    this.props.editDevice(this.props.match.params.id, device);
    this.setState({ editing: false });
  };

  createTemporaryPolicy = (
    selectedPolicyId: string,
    policyDuration: string
  ) => {
    const temporaryPolicy: TemporaryPolicyType = {
      policyId: selectedPolicyId,
      deviceId: this.props.match.params.id + "", // For some reason TS thought this was a number
      duration: parseInt(policyDuration, 10),
      startTime: new Date()
    };
    this.props.createTemporaryPolicy(temporaryPolicy);
  };

  calculateCurrentPolicyName = () => {
    let currentPolicyId = this.props.device.defaultPolicyId;
    if (this.props.temporaryPolicies.length) {
      currentPolicyId = this.props.temporaryPolicies[0].policyId;
    }
    const currentPolicy = this.props.policyDict[currentPolicyId];
    return currentPolicy == null
      ? ""
      : this.props.policyDict[currentPolicyId].name;
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    const id = this.props.match.params.id;
    if (this.state.reload) return <Redirect to="/" />;
    let details = (
      <div className="container">
        <h1>Loading…</h1>
      </div>
    );
    if (
      this.props.device &&
      this.props.userDict &&
      this.props.policyDict &&
      this.props.temporaryPolicies
    ) {
      const currentPolicyName = this.calculateCurrentPolicyName();
      const panel = this.state.editing ? (
        <EditDevice
          device={this.props.device}
          id={this.props.match.params.id}
          policies={this.props.policies}
          submit={this.finishEditDevice}
          cancel={this.cancelEditDevice}
          users={this.props.users}
        />
      ) : (
        <ExtraDetails
          currentPolicyName={currentPolicyName}
          device={this.props.device}
          userDict={this.props.userDict}
        />
      );
      details = (
        <div className="flex justify-center align-center">
          {panel}
          <ActionPanel
            policyDict={this.props.policyDict}
            deleteDevice={this.deleteDevice}
            createTemporaryPolicy={this.createTemporaryPolicy}
            editDevice={this.startEditDevice}
          />
        </div>
      );
    }

    return (
      <div className="container section">
        <div className="card z-depth-0">{details}</div>
      </div>
    );
  }
}

// fixme
const mapStateToProps = (state: any, ownProps: any) => {
  const id = ownProps.match.params.id;
  const devices = state.firestore.data.devices;
  const device = devices ? devices[id] : null;
  let ourTemporaryPolicies = null;
  let temporaryPolicies = state.firestore.ordered
    .temporaryPolicies as TemporaryPolicyType[];
  if (temporaryPolicies) {
    const devicePolicies = temporaryPolicies.filter(temporaryPolicy => {
      return temporaryPolicy.deviceId === id;
    });
    ourTemporaryPolicies = devicePolicies.filter(temporaryPolicy => {
      const timestamp = temporaryPolicy.startTime as any;
      const expiration = new Date(
        (timestamp.seconds + temporaryPolicy.duration) * 1000
      );
      return expiration > new Date();
    });
  }
  return {
    device,
    userDict: state.firestore.data.users,
    users: state.firestore.ordered.users,
    policyDict: state.firestore.data.policies,
    policies: state.firestore.ordered.policies,
    temporaryPolicies: ourTemporaryPolicies,
    auth: state.firebase.auth
  };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {
    createTemporaryPolicy: (temporaryPolicy: TemporaryPolicyType) => {
      return dispatch(createTemporaryPolicy(temporaryPolicy));
    },
    deleteDevice: (id: string) => dispatch(deleteDevice(id)),
    editDevice: (id: string, device: DeviceType) => {
      return dispatch(editDevice(id, device));
    }
  };
};

// fixme
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "devices" }]),
  firestoreConnect([{ collection: "users" }]),
  firestoreConnect([{ collection: "policies" }]),
  firestoreConnect([{ collection: "temporaryPolicies" }])
)(DeviceDetails);
