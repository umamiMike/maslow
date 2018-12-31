import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { UserType } from "../interfaces";
import UserSummary from "./UserSummary";

interface Props {
  users: UserType[];
}

function Users(props: Props) {
  if (props.users == null) return null;
  const userData = props.users.map(user => {
    return (
      <div className="no-underline mt-2" key={user.id}>
        <UserSummary user={user} />
      </div>
    );
  });
  return (
    <div className="flex container-lg flex-col px-6 pb-2">
      <h3 className="font-sans">Users</h3>
      {userData}
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return { users: state.firestore.ordered.users };
};

type DispatchFunction = (f: any) => void;

const mapDispatchToProps = (dispatch: DispatchFunction) => {
  return {};
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([{ collection: "users" }])
)(Users);
