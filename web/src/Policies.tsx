import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

function Policies() {
  return <div />;
}

const mapStateToProps = (state: any) => {
  const policies = state.firestore.data.policies;
  return { policies };
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
  firestoreConnect([{ collection: "policies" }])
)(Policies);
