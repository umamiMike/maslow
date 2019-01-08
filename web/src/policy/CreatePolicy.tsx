import React, { Component } from "react";
import { createPolicy } from "../store/systemActions";
import { OptionType, PolicyType, SiteDict } from "../interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import PolicyForm from "./PolicyForm";

interface Props {
  createPolicy: any; // fixme
  auth: any; // fixme
  siteDict: SiteDict;
}

class CreatePolicy extends Component<Props, PolicyType> {
  state: PolicyType = {
    name: "",
    description: "",
    siteIds: [""],
    icon: "icon-001"
  };

  handleSubmit = (policy: PolicyType) => {
    this.props.createPolicy(policy);
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/policies" />;
    let siteOptions: OptionType[] = [];
    if (this.props.siteDict) {
      siteOptions = Object.keys(this.props.siteDict).map(siteId => {
        return { value: siteId, label: this.props.siteDict[siteId].name };
      });
    }
    return (
      <div className="flex justify-center align-center pt-6">
        <PolicyForm
          handleSubmit={this.handleSubmit}
          policy={this.state}
          siteOptions={siteOptions}
        >
          <div className="flex items-center justify-between">
            <button
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create policy
            </button>
          </div>
        </PolicyForm>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    siteDict: state.firestore.data.sites,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createPolicy: (policy: PolicyType) => dispatch(createPolicy(policy))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "sites" }])
)(CreatePolicy);
