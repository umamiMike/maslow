import React from "react";
import MaslowNavLink from "./components/MaslowNavLink";
import { connect } from "react-redux";
import { signOut } from "./store/authActions";
import { UserType } from "./interfaces";
import Gravatar from "react-gravatar";

interface Props {
  profile: UserType;
  signOut: () => void;
}

const SignedInLinks = (props: Props) => {
  return (
    <div className="w-full justify-between block flex-grow lg:flex lg:items-center lg:w-auto">
      <div className="flex items-center justify-end lg:flex-grow">
        <MaslowNavLink to="/">Devices</MaslowNavLink>
        <MaslowNavLink to="/policies">Policies</MaslowNavLink>
        <MaslowNavLink to="/sites">Sites</MaslowNavLink>
        <MaslowNavLink to="/users">Users</MaslowNavLink>
        <div className="border-grey-dark border-solid border-l mr-12" />
        <button
          className="no-underline block mt-4 lg:inline-block lg:mt-0 text-yellow-darkest hover:text-white mr-4"
          onClick={props.signOut}
        >
          Log Out
        </button>
        <MaslowNavLink to="/">
          <Gravatar
            className="rounded-full w-8 h-8"
            md5={props.profile.gravatar}
          />
        </MaslowNavLink>
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
