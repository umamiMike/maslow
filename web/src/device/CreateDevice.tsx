import React, { Component } from "react";
import { createDevice } from "../store/systemActions";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { DeviceType, PolicyType, OptionType, UserType } from "../interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import InputField from "../components/InputField";
import ArrayInput from "../components/ArrayInput";
import { getDeviceOptions, manufacturerOptions } from "../productData";

interface Props {
  createDevice: any; // fixme
  auth: any; // fixme
  policies: PolicyType[];
  users: UserType[];
}

// FIXME: any for state should be DeviceType
class CreateDevice extends Component<Props, any> {
  state: DeviceType = {
    name: "",
    description: "",
    mac: "",
    manufacturer: "",
    model: "",
    defaultPolicyId: "",
    users: [""]
  };

  handleChange = (e: any) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.createDevice(this.state);
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    if (this.props.policies == null || this.props.users == null) {
      return <h1>Loading…</h1>;
    }
    const policyOptions: OptionType[] = this.props.policies.map(policy => {
      return { label: policy.name, value: policy.id || "" };
    });
    const userOptions: OptionType[] = this.props.users.map(user => {
      return {
        label: `${user.firstName} ${user.lastName}`,
        value: user.id || ""
      };
    });
    return (
      <div className="flex justify-center align-center pt-6">
        <div className="w-full max-w-xs">
          <form
            onSubmit={this.handleSubmit}
            className="bg-yellow-lightest shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <InputField
              id="name"
              label="Device name"
              value={this.state.name}
              handleChange={this.handleChange}
              placeholder="Joe's iPhone X"
              type="text"
            />
            <InputField
              id="description"
              label="Description"
              value={this.state.description}
              handleChange={this.handleChange}
              placeholder="This device is Joe's secondary iPhone that he keeps for children who are visiting"
              type="text"
            />
            <InputField
              id="mac"
              label="MAC Address"
              value={this.state.mac}
              handleChange={this.handleChange}
              placeholder="dc:a9:04:76:06:c2"
              type="text"
            />
            <InputField
              id="manufacturer"
              label="Manufacturer"
              value={this.state.manufacturer}
              handleChange={this.handleChange}
              type="select"
              options={manufacturerOptions}
            />
            <InputField
              id="model"
              label="Device model"
              value={this.state.model}
              handleChange={this.handleChange}
              type="select"
              options={getDeviceOptions(this.state.manufacturer)}
            />
            <InputField
              id="defaultPolicyId"
              label="Default policy"
              value={this.state.defaultPolicyId}
              handleChange={this.handleChange}
              type="select"
              options={policyOptions}
            />
            <ArrayInput
              value={this.state.users}
              label="Users of this device"
              id="users"
              onChange={this.handleChange}
              options={userOptions}
            />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create device
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
    policies: state.firestore.ordered.policies,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDevice: (device: DeviceType) => dispatch(createDevice(device))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "policies" }]),
  firestoreConnect([{ collection: "users" }])
)(CreateDevice);
