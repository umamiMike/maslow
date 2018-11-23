import React from "react";
import DeviceSummary from "./DeviceSummary";
import { DeviceState } from "./interfaces";

const ProjectList = ({ devices }: { devices: DeviceState[] }) => {
  const summaries =
    devices &&
    devices.map(device => <DeviceSummary key={device.id} device={device} />);
  return <div className="project-list section">{summaries}</div>;
};

export default ProjectList;
