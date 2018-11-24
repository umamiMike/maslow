import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { DeviceState } from "./interfaces";

interface ParamType {
  id: Number;
}

interface MatchType {
  params: ParamType;
}

interface Props {
  match: MatchType; // From React Router
  device: DeviceState;
}

function ProjectDetails(props: Props) {
  const id = props.match.params.id;
  let details = (
    <div className="card-content">
      <span className="card-title">Loading…</span>
    </div>
  );
  if (props.device) {
    details = (
      <React.Fragment>
        <div className="card-content">
          <span className="card-title">
            {props.device.name} {id}
          </span>
          <p>{props.device.description}</p>
        </div>
        <div className="card-action grey lighten-4 grey-text">
          <div>{props.device.mac}</div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="container section project-details">
      <div className="card z-depth-0">{details}</div>
    </div>
  );
}

// fixme
const mapStateToProps = (state: any, ownProps: any) => {
  const id = ownProps.match.params.id;
  const devices = state.firestore.data.devices;
  const device = devices ? devices[id] : null;
  return { device };
};

// fixme
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "devices" }])
)(ProjectDetails);
