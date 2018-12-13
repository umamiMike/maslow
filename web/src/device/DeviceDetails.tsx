import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import {
  DeviceType,
  UserDict,
  PolicyDict,
  OptionType,
  TemporaryPolicyType
} from "../interfaces";
import { deleteDevice, createTemporaryPolicy } from "../store/systemActions";
import UserGravatar from "../components/UserGravatar";
import InputField from "../components/InputField";

const POLICY_DURATIONS: OptionType[] = [
  { value: 15 * 60, label: "15 min" },
  { value: 30 * 60, label: "30 min" },
  { value: 60 * 60, label: "1 hr" },
  { value: 4 * 60 * 60, label: "4 hrs" },
  { value: 4 * 60 * 60, label: "8 hrs" },
  { value: 24 * 60 * 60, label: "24 hrs" }
];
interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  device: DeviceType;
  policyDict: PolicyDict;
  userDict: UserDict;
  temporaryPolicies: TemporaryPolicyType[];

  deleteDevice: any;
  createTemporaryPolicy: any;
}

interface State {
  reload: boolean;
  selectedPolicyId: string;
  policyDuration: string;
}

class DeviceDetails extends Component<Props, State> {
  state: State = {
    reload: false,
    selectedPolicyId: "",
    policyDuration: "30 min"
  };

  deleteDevice = () => {
    this.props.deleteDevice(this.props.match.params.id);
    this.setState({ reload: true });
  };

  createTemporaryPolicy = () => {
    const temporaryPolicy: TemporaryPolicyType = {
      policyId: this.state.selectedPolicyId,
      deviceId: this.props.match.params.id + "", // For some reason TS thought this was a number
      duration: parseInt(this.state.policyDuration, 10),
      startTime: new Date()
    };
    this.props.createTemporaryPolicy(temporaryPolicy);
  };

  handleChange = (e: any) => {
    let value = e.target.value as string;
    let target = e.target.id as string;
    if (target === "selectedPolicyId")
      this.setState({ selectedPolicyId: value });
    if (target === "policyDuration") this.setState({ policyDuration: value });
  };

  calculateCurrentPolicyName = () => {
    let currentPolicyId = this.props.device.defaultPolicyId;
    if (this.props.temporaryPolicies.length) {
      currentPolicyId = this.props.temporaryPolicies[0].policyId;
    }
    return this.props.policyDict[currentPolicyId].name;
  };

  render() {
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
      const users = this.props.device.users.map(userId => {
        const user = this.props.userDict[userId] || {};
        return <UserGravatar key={userId} user={user} userId={userId} />;
      });
      const policyOptions = Object.keys(this.props.policyDict).map(policyId => {
        return { value: policyId, label: this.props.policyDict[policyId].name };
      });
      const currentPolicyName = this.calculateCurrentPolicyName();
      details = (
        <div className="flex justify-center align-center">
          <div className="mt-4 w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
            <img
              className="w-full"
              src={`/${this.props.device.model}.png`}
              alt={`${this.props.device.manufacturer} ${
                this.props.device.model
              }`}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                {this.props.device.name}
              </div>
              <p className="text-sm text-grey-dark flex items-center mb-4">
                <svg
                  className="fill-current text-grey w-3 h-3 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                </svg>
                {`Policy: ${currentPolicyName}`}
              </p>
              <p className="text-grey-darker text-base">
                {this.props.device.description}
              </p>
              <p className="text-grey text-base">{this.props.device.mac}</p>
            </div>

            <div className="ml-6">{users}</div>
          </div>
          <div className="flex flex-col justify-between items-start px-4">
            <div className="mt-4 m-2 p-2 border border-solid border-grey rounded">
              <InputField
                className="w-48 mt-4"
                id="selectedPolicyId"
                label="Select policy"
                value={this.state.selectedPolicyId}
                options={policyOptions}
                type="select"
                handleChange={this.handleChange}
              />
              <InputField
                className="w-48 mt-2"
                label="Select duration"
                id="policyDuration"
                value={this.state.policyDuration}
                options={POLICY_DURATIONS}
                type="select"
                handleChange={this.handleChange}
              />
              <button
                onClick={this.createTemporaryPolicy}
                className="bg-blue mb-4 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Grant access
              </button>
            </div>
            <button
              onClick={this.deleteDevice}
              className="bg-red mb-4 hover:bg-red-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
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
    policyDict: state.firestore.data.policies,
    temporaryPolicies: ourTemporaryPolicies
  };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {
    deleteDevice: (id: string) => dispatch(deleteDevice(id)),
    createTemporaryPolicy: (temporaryPolicy: TemporaryPolicyType) => {
      return dispatch(createTemporaryPolicy(temporaryPolicy));
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
