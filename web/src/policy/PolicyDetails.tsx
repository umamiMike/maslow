import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { PolicyType, SiteDict } from "../interfaces";
import { deletePolicy } from "../store/systemActions";
import Icon from "../components/Icon";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  policy: PolicyType;
  deletePolicy: any;
  siteDict: SiteDict;
}

interface State {
  reload: boolean;
}

class PolicyDetails extends Component<Props, State> {
  state: State = {
    reload: false
  };

  deletePolicy = () => {
    this.props.deletePolicy(this.props.match.params.id);
    this.setState({ reload: true });
  };

  render() {
    const id = this.props.match.params.id;
    if (this.state.reload) return <Redirect to="/policy" />;
    let details = (
      <div className="container">
        <h1>Loading…</h1>
      </div>
    );
    if (this.props.policy && this.props.siteDict) {
      details = (
        <div className="flex justify-center align-center">
          <div className="mt-4 w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
            <Icon
              icon={this.props.policy.icon}
              className="text-5xl mt-8 h-48 lg:h-auto lg:w-48 bg-blue-lightest bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                {this.props.policy.name}
              </div>
              <p className="text-grey-darker text-base">
                {this.props.policy.description}
              </p>
              <div className="text-grey-darker text-base mt-4">
                <ul>
                  {this.props.policy.siteIds.map(siteId => (
                    <li key={siteId}>
                      <div className="flex flex-row">
                        <Icon
                          className="mr-2"
                          icon={this.props.siteDict[siteId].icon}
                        />
                        {this.props.siteDict[siteId].name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <button
              onClick={() => undefined}
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
    deletePolicy: (id: string) => dispatch(deletePolicy(id))
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
