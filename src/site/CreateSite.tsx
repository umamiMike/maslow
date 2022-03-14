import React, { Component } from "react";
import { createSite } from "../store/systemActions";
import { SiteType } from "../interfaces";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import SiteForm from "./SiteForm";

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

  handleSubmit = (site: SiteType) => {
    this.props.createSite(site);
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="flex justify-center align-center pt-6">
        <SiteForm site={this.state} handleSubmit={this.handleSubmit}>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create site
            </button>
          </div>
        </SiteForm>
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
