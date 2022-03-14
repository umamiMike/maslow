import React, { Component } from "react";
import InputField from "../components/InputField";
import DropdownIcon from "../components/DropdownIcon";
import ArrayInput from "../components/ArrayInput";
import { SiteType } from "../interfaces";

interface Props {
  site: SiteType;
  handleSubmit: any;
}

interface State {
  name: string;
  description: string;
  addresses: string[];
  icon: string;
}

export default class SiteForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: props.site.name,
      description: props.site.description,
      addresses: [...props.site.addresses],
      icon: props.site.icon
    };
  }

  handleChange = (e: any) => {
    let value = e.target.value as string;
    let target = e.target.id as string;
    let index = null;
    if (target.indexOf(":") !== -1) {
      [target, index] = target.split(":");
    }
    if (target === "addresses") {
      const addresses = [...this.state.addresses];
      addresses[parseInt(index as string, 10)] = value;
      this.setState({ addresses });
      return;
    }
    if (target === "name") this.setState({ name: value });
    if (target === "description") this.setState({ description: value });
    if (target === "icon") this.setState({ icon: value });
  };

  submit = (e: any) => {
    e.preventDefault();
    const site: SiteType = {
      name: this.state.name,
      description: this.state.description,
      addresses: [...this.state.addresses],
      icon: this.state.icon
    };
    this.props.handleSubmit(site);
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
            label="Site name"
            value={this.state.name}
            handleChange={this.handleChange}
            placeholder="The Weather Channel"
            type="text"
          />
          <InputField
            id="description"
            label="Description"
            value={this.state.description}
            handleChange={this.handleChange}
            placeholder="A site that is funded on advertising that provides weather data"
            type="text"
          />

          <DropdownIcon
            value={this.state.icon}
            id="icon"
            onChange={this.handleChange}
          />
          <ArrayInput
            label="Addresses"
            value={this.state.addresses}
            id="addresses"
            placeholder=".*\.facebook\.com"
            onChange={this.handleChange}
          />
          {this.props.children}
        </form>
      </div>
    );
  }
}
