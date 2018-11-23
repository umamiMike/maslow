import React, { Component } from "react";
import { createDevice } from "./store/deviceActions";
import { DeviceState } from "./interfaces";
import { connect } from "react-redux";

interface Props {
  createDevice: any;
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
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">New Device</h5>
          <div className="input-field">
            <label htmlFor="name">Name</label>
            <input
              value={this.state.name}
              id="name"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="description">Description</label>
            <input
              value={this.state.description}
              id="description"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="mac">Mac Address</label>
            <input
              value={this.state.mac}
              id="mac"
              onChange={this.handleChange}
            />
          </div>
          <div className="input-field">
            <input
              value="Create"
              type="submit"
              className="btn pink lighten-1 z-depth-0"
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDevice: (device: DeviceState) => dispatch(createDevice(device))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(CreateDevice);
