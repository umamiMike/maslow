import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { PolicyType, SiteDict } from "./interfaces";
import NewButton from "./NewButton";
import { Link } from "react-router-dom";
import PolicySummary from "./PolicySummary";

interface Props {
  policies: PolicyType[];
  siteDict: SiteDict;
}

function Policies(props: Props) {
  if (props.policies == null || props.siteDict == null) return null;
  const policyData = props.policies.map(policy => {
    return (
      <Link
        className="no-underline mt-2"
        key={policy.id}
        to={`/policy/${policy.id}`}
      >
        <PolicySummary siteDict={props.siteDict} policy={policy} />
      </Link>
    );
  });
  return (
    <div className="flex container-lg flex-col px-6 pb-2">
      <h3 className="font-sans">Policies</h3>
      {policyData}
      <NewButton to="/new-policy" />
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    siteDict: state.firestore.data.sites,
    policies: state.firestore.ordered.policies
  };
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
  firestoreConnect([{ collection: "policies" }]),
  firestoreConnect([{ collection: "sites" }])
)(Policies);
