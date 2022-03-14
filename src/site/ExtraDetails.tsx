import React from "react";
import Icon from "../components/Icon";
import { SiteType } from "../interfaces";

interface Prop {
  site: SiteType;
}

export default function ExtraDetails(props: Prop) {
  return (
    <div className="mt-4 w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
      <Icon
        icon={props.site.icon}
        className="text-5xl mt-8 h-48 lg:h-auto lg:w-48 bg-blue-lightest bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.site.name}</div>
        <p className="text-grey-darker text-base">{props.site.description}</p>
        <div className="text-grey-darker text-base mt-4">
          <ul>
            {props.site.addresses.map(address => (
              <li key={address}>{address}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
