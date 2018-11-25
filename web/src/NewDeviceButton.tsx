import React from "react";
import { Link } from "react-router-dom";

export default function NewDeviceButton() {
  return (
    <Link to="/new-device" className="btn pink white-text lighten-1 z-depth-0">
      Add ➕
    </Link>
  );
}
