import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { DeviceState } from "./interfaces";
import { deleteDevice } from "./store/deviceActions";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  device: DeviceState;
  deleteDevice: any;
}

interface State {
  reload: boolean;
}

class ProjectDetails extends Component<Props, State> {
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
    if (this.props.device) {
      details = (
        <div className="flex justify-center align-center">
          <div className="w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
            <img className="w-full" src="/macbook.png" alt="Macbook" />
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
                Policy: Locked-down
              </p>
              <p className="text-grey-darker text-base">
                {this.props.device.description}
              </p>
              <p className="text-grey text-base">{this.props.device.mac}</p>
            </div>

            <div className="flex items-center ml-4">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg"
                alt="Avatar of Jonathan Reinink"
              />
              <div className="text-sm">
                <p className="text-black leading-none">Jonathan Reinink</p>
                <p className="text-grey-dark">Aug 18</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                #photography
              </span>
              <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">
                #travel
              </span>
              <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker">
                #winter
              </span>
            </div>
          </div>
          <div className="flex ml-4 items-center justify-between">
            <button
              onClick={this.deleteDevice}
              className="bg-red hover:bg-red-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container section project-details">
        <div className="card z-depth-0">{details}</div>
      </div>
    );
  }
}

// fixme
const mapStateToProps = (state: any, ownProps: any) => {
  console.log({ state });
  const id = ownProps.match.params.id;
  const devices = state.firestore.data.devices;
  const device = devices ? devices[id] : null;
  return { device };
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
  firestoreConnect([{ collection: "devices" }])
)(ProjectDetails);
