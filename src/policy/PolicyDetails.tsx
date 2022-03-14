import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { PolicyType, SiteDict } from "../interfaces";
import { deletePolicy, editPolicy } from "../store/systemActions";
import ExtraPolicyDetails from "./ExtraPolicyDetails";
import EditPolicy from "./EditPolicy";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  policy: PolicyType;
  siteDict: SiteDict;

  deletePolicy: any;
  editPolicy: any;
}

interface State {
  editing: boolean;
  reload: boolean;
}

class PolicyDetails extends Component<Props, State> {
  state: State = {
    editing: false,
    reload: false
  };

  deletePolicy = () => {
    this.props.deletePolicy(this.props.match.params.id);
    this.setState({ reload: true });
  };

  editPolicy = (policy: PolicyType) => {
    this.props.editPolicy(this.props.match.params.id, policy);
    this.setState({ editing: false });
  };

  render() {
    const id = this.props.match.params.id;
    if (this.state.reload) return <Redirect to="/policy" />;
    let details = (
      <div className="container">
        <h1>Loading…</h1>
      </div>
    );
    const panel = this.state.editing ? (
      <EditPolicy
        siteDict={this.props.siteDict}
        policy={this.props.policy}
        handleSubmit={this.editPolicy}
      />
    ) : (
      <ExtraPolicyDetails
        policy={this.props.policy}
        siteDict={this.props.siteDict}
      />
    );
    if (this.props.policy && this.props.siteDict) {
      details = (
        <div className="flex justify-center align-center">
          {panel}
          <div className="flex flex-col items-start">
            <button
              onClick={() => this.setState({ editing: true })}
              className="bg-blue m-4 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Edit
            </button>
            <button
              onClick={this.deletePolicy}
              className="bg-red m-4 hover:bg-red-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
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
  const policies = state.firestore.data.policies;
  const policy = policies ? policies[id] : null;
  return { policy, siteDict: state.firestore.data.sites };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {
    deletePolicy: (id: string) => dispatch(deletePolicy(id)),
    editPolicy: (id: string, policy: PolicyType) =>
      dispatch(editPolicy(id, policy))
  };
};

// fixme
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "policies" }]),
  firestoreConnect([{ collection: "sites" }])
)(PolicyDetails);
