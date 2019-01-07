import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { SiteType } from "../interfaces";
import { deleteSite } from "../store/systemActions";
import ExtraDetails from "./ExtraDetails";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  site: SiteType;
  deleteSite: any;
}

interface State {
  editing: boolean;
  reload: boolean;
}

class SiteDetails extends Component<Props, State> {
  state: State = {
    editing: false,
    reload: false
  };

  deleteSite = () => {
    this.props.deleteSite(this.props.match.params.id);
    this.setState({ reload: true });
  };

  render() {
    const id = this.props.match.params.id;
    if (this.state.reload) return <Redirect to="/sites" />;
    let details = (
      <div className="container">
        <h1>Loading…</h1>
      </div>
    );
    const panel = this.state.editing ? (
      <h1>editing</h1>
    ) : (
      <ExtraDetails site={this.props.site} />
    );
    if (this.props.site) {
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
              onClick={this.deleteSite}
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
  const sites = state.firestore.data.sites;
  const site = sites ? sites[id] : null;
  return { site };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {
    deleteSite: (id: string) => dispatch(deleteSite(id))
  };
};

// fixme
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "sites" }])
)(SiteDetails);
