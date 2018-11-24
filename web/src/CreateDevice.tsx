import React, { Component } from "react";
import { createDevice } from "./store/deviceActions";
import { DeviceState } from "./interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import InputField from "./InputField";

interface Props {
  createDevice: any; // fixme
  auth: any; // fixme
}

// FIXME: any for state should be DeviceType
class CreateDevice extends Component<Props, any> {
  state: DeviceState = {
    name: "",
    description: "",
    mac: ""
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
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDevice: (device: DeviceState) => dispatch(createDevice(device))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDevice);
