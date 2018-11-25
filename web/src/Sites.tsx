import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { SiteType } from "./interfaces";
import { Link } from "react-router-dom";
import SiteSummary from "./SiteSummary";
import NewDeviceButton from "./NewDeviceButton";

interface Props {
  sites: SiteType[];
}

function Sites(props: Props) {
  if (props.sites == null) return null;
  const siteData = props.sites.map(site => {
    return (
      <Link className="no-underline mt-2" key={site.id} to={`/site/${site.id}`}>
        <SiteSummary site={site} />
      </Link>
    );
  });
  return (
    <div className="flex container-lg flex-col px-6 pb-2">
      <h3 className="font-sans">Sites</h3>
      {siteData}
      <NewDeviceButton to="/new-site" />
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return { sites: state.firestore.ordered.sites };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {};
};

// fixme
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "sites" }])
)(Sites);
