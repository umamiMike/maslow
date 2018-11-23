import React from "react";
import { NavLink } from "react-router-dom";

const SignedInLinks = () => {
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
        <NavLink to="/">Log Out</NavLink>
      </li>
      <li>
        <NavLink to="/" className="btn btn-floating pink lighten-1">
          PB
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedInLinks;
