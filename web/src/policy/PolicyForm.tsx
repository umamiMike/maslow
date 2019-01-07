import React, { Component } from "react";
import InputField from "../components/InputField";
import DropdownIcon from "../components/DropdownIcon";
import ArrayInput from "../components/ArrayInput";
import { PolicyType, OptionType } from "../interfaces";

interface Props {
  handleSubmit: any;
  policy: PolicyType;
  siteOptions: OptionType[];
}

export default class ExtraPolicyDetails extends Component<Props, PolicyType> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: this.props.policy.name,
      description: this.props.policy.description,
      siteIds: [...this.props.policy.siteIds],
      icon: this.props.policy.icon
    };
  }

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

  submit = (e: any) => {
    e.preventDefault();
    const policy = {
      name: this.state.name,
      description: this.state.description,
      siteIds: [...this.state.siteIds],
      icon: this.state.icon
    };
    this.props.handleSubmit(policy);
  };

  render() {
    return (
      <div className="w-full max-w-md">
        <form
          onSubmit={this.submit}
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
            label="Sites that comprise this policy"
            value={this.state.siteIds}
            id="siteIds"
            onChange={this.handleChange}
            options={this.props.siteOptions}
          />
          {this.props.children}
        </form>
      </div>
    );
  }
}
