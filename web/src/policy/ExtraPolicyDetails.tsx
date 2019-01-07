import React from "react";
import { PolicyType, SiteDict } from "../interfaces";
import Icon from "../components/Icon";

interface Props {
  policy: PolicyType;
  siteDict: SiteDict;
}

export default function ExtraPolicyDetails(props: Props) {
  return (
    <div className="mt-4 w-1/2 rounded overflow-hidden shadow-lg bg-blue-lightest">
      <Icon
        icon={props.policy.icon}
        className="text-5xl mt-8 h-48 lg:h-auto lg:w-48 bg-blue-lightest bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.policy.name}</div>
        <p className="text-grey-darker text-base">{props.policy.description}</p>
        <div className="text-grey-darker text-base mt-4">
          <ul>
            {props.policy.siteIds.map(siteId => (
              <li key={siteId}>
                <div className="flex flex-row">
                  <Icon className="mr-2" icon={props.siteDict[siteId].icon} />
                  {props.siteDict[siteId].name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
