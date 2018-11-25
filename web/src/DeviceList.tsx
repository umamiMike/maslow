import React from "react";
import DeviceSummary from "./DeviceSummary";
import { DeviceState } from "./interfaces";
import { Link } from "react-router-dom";

const ProjectList = ({ devices }: { devices: DeviceState[] }) => {
  const summaries =
    devices &&
    devices.map(device => {
      return (
        <Link key={device.id} to={`/device/${device.id}`}>
          <DeviceSummary device={device} />
        </Link>
      );
    });
  return <div className="project-list section">{summaries}</div>;
};

export default ProjectList;
