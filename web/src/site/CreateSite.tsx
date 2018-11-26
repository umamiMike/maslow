import React, { Component } from "react";
import { createSite } from "../store/systemActions";
import { SiteType } from "../interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import InputField from "../components/InputField";
import DropdownIcon from "../components/DropdownIcon";
import ArrayInput from "../components/ArrayInput";

interface Props {
  createSite: any; // fixme
  auth: any; // fixme
}

class CreateSite extends Component<Props, SiteType> {
  state: SiteType = {
    name: "",
    description: "",
    addresses: [""],
    icon: "icon-001"
  };

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

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.createSite(this.state);
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="flex justify-center align-center pt-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={this.handleSubmit}
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
              value={this.state.addresses}
              id="addresses"
              onChange={this.handleChange}
            />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create site
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
    createSite: (site: SiteType) => dispatch(createSite(site))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateSite);
