import React from "react";
import { Link } from "react-router-dom";
import DeviceSummary from "./DeviceSummary";
import { DeviceState } from "./interfaces";
import NewDeviceButton from "./NewDeviceButton";

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
  return (
    <div className="flex container-lg flex-col pl-6 pb-2">
      <h3 className="font-sans">Devices</h3>
      {summaries}
      <NewDeviceButton to="/new-device" />
    </div>
  );
};

export default ProjectList;
