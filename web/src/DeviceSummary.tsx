import React from "react";
import { DeviceState } from "./interfaces";

const DeviceSummary = ({ device }: { device: DeviceState }) => {
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      <div
        className="h-48 lg:h-auto lg:w-48 bg-blue-lightest flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: "url('/macbook.png')"
        }}
        title="Device"
      />
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <div className="text-black font-bold text-xl mb-2">{device.name}</div>
        <p className="text-grey-darker text-base">{device.description}</p>
        <p className="grey-text">{device.mac}</p>
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg"
            alt="Avatar of Jonathan Reinink"
          />
          <div className="text-sm">
            <p className="text-black leading-none">Jonathan Reinink</p>
            <p className="text-grey-dark">Aug 18</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSummary;
