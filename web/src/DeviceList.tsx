import React from "react";
import DeviceSummary from "./DeviceSummary";
import { DeviceState } from "./interfaces";
import { Link } from "react-router-dom";

const ProjectList = ({ devices }: { devices: DeviceState[] }) => {
  const summaries =
    devices &&
    devices.map(device => {
      return (
        <Link
          className="no-underline mt-2"
          key={device.id}
          to={`/device/${device.id}`}
        >
          <DeviceSummary device={device} />
        </Link>
      );
    });
  return <React.Fragment>{summaries}</React.Fragment>;
};

export default ProjectList;
