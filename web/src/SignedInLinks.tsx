import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "./store/authActions";

// fixme
const generateInitials = (profile: any) => {
  if (profile == null) return null;
  if (profile.lastName == null || profile.firstName == null) return null;
  return `${profile.firstName[0]} ${profile.lastName[0]}`;
};

// Fixme
const SignedInLinks = (props: any) => {
  const initials = generateInitials(props.profile);
  return (
    <ul className="right">
      <li>
        <NavLink to="/">Devices</NavLink>
      </li>
      <li>
        <NavLink to="/">Users</NavLink>
      </li>
      <li>
        <NavLink to="/">Policies</NavLink>
      </li>
      <li>
        <a onClick={props.signOut}>Log Out</a>
      </li>
      <li>
        <NavLink to="/" className="btn btn-floating pink lighten-1">
          {initials}
        </NavLink>
      </li>
    </ul>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SignedInLinks);
