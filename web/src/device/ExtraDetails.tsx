import React from "react";
import UserGravatar from "../components/UserGravatar";
import { DeviceType, UserDict } from "../interfaces";

interface Props {
  currentPolicyName: string;
  device: DeviceType;
  userDict: UserDict;
}

export default function ExtraDetails(props: Props) {
  const users =
    props.device.users != null
      ? props.device.users.map(userId => {
          const user = props.userDict[userId] || {};
          return <UserGravatar key={userId} user={user} userId={userId} />;
        })
      : null;
  return (
    <div className="mt-4 w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
      <img
        className="w-full"
        src={`/${props.device.model}.png`}
        alt={`${props.device.manufacturer} ${props.device.model}`}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.device.name}</div>
        <p className="text-sm text-grey-dark flex items-center mb-4">
          <svg
            className="fill-current text-grey w-3 h-3 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
          </svg>
          {`Policy: ${props.currentPolicyName}`}
        </p>
        <p className="text-grey-darker text-base">{props.device.description}</p>
        <p className="text-grey text-base">{props.device.mac}</p>
      </div>

      <div className="ml-6">{users}</div>
    </div>
  );
}
