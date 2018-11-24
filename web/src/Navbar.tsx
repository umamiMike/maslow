import React from "react";
import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";

// fixme props
const Navbar = (props: any) => {
  const { auth, profile } = props;
  const links = auth.uid ? (
    <SignedInLinks profile={profile} />
  ) : (
    <SignedOutLinks />
  );
  return (
    <nav className="flex items-center justify-between flex-wrap bg-yellow-dark p-6 shadow mb-2">
      <div className="flex w-full items-center flex-no-shrink text-white mr-6">
        <Link
          to="/"
          className="no-underline font-semibold text-xl tracking-tight text-yellow-darkest"
        >
          {/* TODO: turn off decoration */}
          Maslow
        </Link>
        {links}
      </div>
    </nav>
  );
};

const mapStateToProps = (state: any) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Navbar);
