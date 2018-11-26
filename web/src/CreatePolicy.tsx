import React, { Component } from "react";
import { createPolicy } from "./store/systemActions";
import { OptionType, PolicyType, SiteDict } from "./interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import InputField from "./InputField";
import DropdownIcon from "./DropdownIcon";
import ArrayInput from "./ArrayInput";

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

  handleChange = (e: any) => {
    let value = e.target.value as string;
    let fieldName = e.target.id as string;
    let index = null;
    if (fieldName.indexOf(":") !== -1) {
      [fieldName, index] = fieldName.split(":"); // FIXME: not index
    }
    if (fieldName === "siteIds") {
      const siteIds = [...this.state.siteIds];
      siteIds[parseInt(index as string, 10)] = value;
      this.setState({ siteIds });
      return;
    }
    if (fieldName === "name") this.setState({ name: value });
    if (fieldName === "description") this.setState({ description: value });
    if (fieldName === "icon") this.setState({ icon: value });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.createPolicy(this.state);
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/policies" />;
    let siteChoices: OptionType[] = [];
    if (this.props.siteDict) {
      siteChoices = Object.keys(this.props.siteDict).map(siteId => {
        return { value: siteId, label: this.props.siteDict[siteId].name };
      });
    }
    return (
      <div className="flex justify-center align-center pt-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={this.handleSubmit}
            className="bg-yellow-lightest shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <InputField
              id="name"
              label="Policy name"
              value={this.state.name}
              handleChange={this.handleChange}
              placeholder="Guest"
              type="text"
            />
            <InputField
              id="description"
              label="Description"
              value={this.state.description}
              handleChange={this.handleChange}
              placeholder="The policy that is applied to all unknown devices"
              type="text"
            />
            <DropdownIcon
              value={this.state.icon}
              id="icon"
              onChange={this.handleChange}
            />
            <ArrayInput
              value={this.state.siteIds}
              id="siteIds"
              onChange={this.handleChange}
              choices={siteChoices}
            />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create policy
              </button>
            </div>
          </form>
        </div>
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
