import React, { Component } from "react";
import SiteForm from "./SiteForm";
import { SiteType } from "../interfaces";

interface Props {
  editSite: any; // fixme
  site: SiteType;
}

export default class EditSite extends Component<Props> {
  render() {
    return (
      <div className="flex justify-center align-center pt-6">
        <SiteForm
          site={this.props.site}
          handleSubmit={(site: SiteType) => this.props.editSite(site)}
        >
          <div className="flex items-center justify-between">
            <button
              className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
        </SiteForm>
      </div>
    );
  }
}
