import React from "react";
import MaslowNavLink from "./MaslowNavLink";
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
    <div className="w-full justify-between block flex-grow lg:flex lg:items-center lg:w-auto">
      <div className="flex justify-end lg:flex-grow">
        <MaslowNavLink to="/">Devices</MaslowNavLink>
        <MaslowNavLink to="/policies">Policies</MaslowNavLink>
        <MaslowNavLink to="/sites">Sites</MaslowNavLink>
        <button
          className="no-underline block mt-4 lg:inline-block lg:mt-0 text-yellow-darkest hover:text-white mr-4"
          onClick={props.signOut}
        >
          Log Out
        </button>
        <MaslowNavLink to="/">{initials}</MaslowNavLink>
      </div>
    </div>
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
