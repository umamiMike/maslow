import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: any;
  className?: string;
}
const MaslowNavLink = (props: Props) => {
  let className = props.className;
  className +=
    " no-underline block mt-4 lg:inline-block lg:mt-0 text-yellow-darkest hover:text-white mr-4";
  return (
    <NavLink className={className} to={props.to}>
      {props.children}
    </NavLink>
  );
};

export default MaslowNavLink;
