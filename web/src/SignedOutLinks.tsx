import React from "react";
import MaslowNavLink from "./components/MaslowNavLink";

const SignedOutLinks = () => {
  return (
    <div className="w-full justify-between block flex-grow lg:flex lg:items-center lg:w-auto">
      <div className="flex justify-end lg:flex-grow">
        <MaslowNavLink to="/signup">Sign up</MaslowNavLink>
        <MaslowNavLink to="/signin">Log In</MaslowNavLink>
      </div>
    </div>
  );
};

export default SignedOutLinks;
