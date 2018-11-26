import React from "react";
import { DeviceType, PolicyDict, UserDict } from "../interfaces";
import UserGravatar from "../components/UserGravatar";

const DeviceSummary = ({
  device,
  userDict,
  policyDict
}: {
  device: DeviceType;
  userDict: UserDict;
  policyDict: PolicyDict;
}) => {
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      <div
        className="h-48 lg:h-auto lg:w-48 bg-blue-lightest flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{
          backgroundImage: `url('/${device.model}.png')`
        }}
        title="Device"
      />
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <div className="text-black font-bold text-xl mb-2">{device.name}</div>
        <p className="text-grey-darker text-base">{device.description}</p>
        <p className="text-grey">{device.mac}</p>
        <p className="text-grey">
          {`Default policy: ${policyDict[device.defaultPolicyId].name}`}
        </p>
        {device.users.map(userId => {
          const user = userDict[userId] || {};
          return <UserGravatar key={userId} user={user} userId={userId} />;
        })}
      </div>
    </div>
  );
};

export default DeviceSummary;
