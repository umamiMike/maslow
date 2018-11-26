import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { DeviceType, UserDict, PolicyDict } from "../interfaces";
import { deleteDevice } from "../store/systemActions";
import UserGravatar from "../components/UserGravatar";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  device: DeviceType;
  deleteDevice: any;
  policyDict: PolicyDict;
  userDict: UserDict;
}

interface State {
  reload: boolean;
}

class DeviceDetails extends Component<Props, State> {
  state: State = {
    reload: false
  };

  deleteDevice = () => {
    this.props.deleteDevice(this.props.match.params.id);
    this.setState({ reload: true });
  };

  render() {
    const id = this.props.match.params.id;
    if (this.state.reload) return <Redirect to="/" />;
    let details = (
      <div className="container">
        <h1>Loading…</h1>
      </div>
    );
    if (this.props.device && this.props.userDict && this.props.policyDict) {
      const users = this.props.device.users.map(userId => {
        const user = this.props.userDict[userId] || {};
        return <UserGravatar user={user} userId={userId} />;
      });
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
                Policy:{" "}
                {this.props.policyDict[this.props.device.defaultPolicyId].name}
              </p>
              <p className="text-grey-darker text-base">
                {this.props.device.description}
              </p>
              <p className="text-grey text-base">{this.props.device.mac}</p>
            </div>

            <div className="ml-6">{users}</div>
          </div>
          <div className="flex flex-col items-start">
            <button
              onClick={() => undefined}
              className="bg-blue m-4 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Grant access
            </button>
            <button
              onClick={this.deleteDevice}
              className="bg-red m-4 hover:bg-red-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
  return {
    device,
    userDict: state.firestore.data.users,
    policyDict: state.firestore.data.policies
  };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {
    deleteDevice: (id: string) => dispatch(deleteDevice(id))
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
  firestoreConnect([{ collection: "policies" }])
)(DeviceDetails);
