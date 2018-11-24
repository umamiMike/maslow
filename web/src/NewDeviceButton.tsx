import React from "react";
import { Link } from "react-router-dom";

export default function NewDeviceButton() {
  return (
    <div className="flex items-center content-center self-center pt-6">
      <Link
        to="/new-device"
        className="no-underline bg-blue hover:bg-blue-dark text-white font-bold py-4 px-4 rounded-full"
      >
        <p className="font-icon icon-059" />
      </Link>
    </div>
  );
}
