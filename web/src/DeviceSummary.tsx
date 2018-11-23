import React from "react";
import { DeviceState } from "./interfaces";

const DeviceSummary = ({ device }: { device: DeviceState }) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title">{device.name}</span>
        <p>{device.description}</p>
        <p className="grey-text">{device.mac}</p>
      </div>
    </div>
  );
};

export default DeviceSummary;
