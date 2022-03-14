import React from "react";
import { UserType } from "../interfaces";
import Gravatar from "react-gravatar";

interface Props {
  user: UserType;
  userId?: string;
}

export default function UserGravatar(props: Props) {
  return (
    <div className="flex items-center mb-4" key={props.user.id || props.userId}>
      <Gravatar
        className="rounded-full w-10 h-10 mr-3"
        md5={props.user.gravatar}
      />
      <div className="text-sm">
        <p className="text-black leading-none">
          {props.user.firstName} {props.user.lastName}
        </p>
      </div>
    </div>
  );
}
