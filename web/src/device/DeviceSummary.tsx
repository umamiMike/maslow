import React from "react";
import { DeviceType, PolicyDict, UserDict } from "../interfaces";
import UserGravatar from "../components/UserGravatar";
import Card from "../components/Card";

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
    <Card backgroundImage={device.model} alt="Device" title={device.name}>
      <p className="text-grey-darker text-base">{device.description}</p>
      <p className="text-grey">{device.mac}</p>
      <p className="text-grey">
        {`Default policy: ${policyDict[device.defaultPolicyId].name}`}
      </p>
      {device.users.map(userId => {
        const user = userDict[userId] || {};
        return <UserGravatar key={userId} user={user} userId={userId} />;
      })}
    </Card>
  );
};

export default DeviceSummary;
