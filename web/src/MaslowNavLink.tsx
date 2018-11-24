import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: any;
}
const MaslowNavLink = (props: Props) => {
  return (
    <NavLink
      className="no-underline block mt-4 lg:inline-block lg:mt-0 text-yellow-darkest hover:text-white mr-4"
      to={props.to}
    >
      {props.children}
    </NavLink>
  );
};

export default MaslowNavLink;
