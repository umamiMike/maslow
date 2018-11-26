import React from "react";
import { Link } from "react-router-dom";
import DeviceSummary from "./DeviceSummary";
import { DeviceState } from "../interfaces";
import NewButton from "../components/NewButton";

const DeviceList = ({ devices }: { devices: DeviceState[] }) => {
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
      <NewButton to="/new-device" />
    </div>
  );
};

export default DeviceList;
