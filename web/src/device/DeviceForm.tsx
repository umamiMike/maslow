import React, { Component } from "react";
import { getDeviceOptions, manufacturerOptions } from "../productData";
import { DeviceType, PolicyType, UserType, OptionType } from "../interfaces";
import ArrayInput from "../components/ArrayInput";
import InputField from "../components/InputField";

interface Props {
  submit: any; // fixme
  device: DeviceType;
  policies: PolicyType[];
  users: UserType[];
  children: any;
}

// FIXME: any for state should be DeviceType
class DeviceForm extends Component<Props, DeviceType> {
  constructor(props: Props) {
    super(props);
    const users = this.props.device.users || []
    this.state = {
      name: this.props.device.name,
      description: this.props.device.description,
      mac: this.props.device.mac,
      manufacturer: this.props.device.manufacturer,
      model: this.props.device.model,
      defaultPolicyId: this.props.device.defaultPolicyId,
      users: [...users]
    };
  }

  handleChange = (e: any) => {
    switch (e.target.id) {
      case "name":
        this.setState({ name: e.target.value });
        break;
      case "description":
        this.setState({ description: e.target.value });
        break;
      case "mac":
        this.setState({ mac: e.target.value });
        break;
      case "manufacturer":
        this.setState({ manufacturer: e.target.value });
        break;
      case "model":
        this.setState({ model: e.target.value });
        break;
      case "defaultPolicyId":
        this.setState({ defaultPolicyId: e.target.value });
        break;
      case "users":
        this.setState({ users: e.target.value });
        break;
    }
  };

  submit = (e: any) => {
    e.preventDefault();
    this.props.submit(this.state);
  };

  render() {
    if (this.state == null) return null;
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
      <form
        onSubmit={this.submit}
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
        {this.props.children}
      </form>
    );
  }
}

export default DeviceForm;
