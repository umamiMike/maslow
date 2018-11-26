import React from "react";
import { Link } from "react-router-dom";
import { PolicyType, SiteDict } from "./interfaces";
import Icon from "./Icon";

const PolicySummary = ({
  policy,
  siteDict
}: {
  policy: PolicyType;
  siteDict: SiteDict;
}) => {
  let siteData = null;
  if (policy.siteIds) {
    siteData = policy.siteIds.map(siteId => {
      const site = siteDict[siteId];
      if (site == null) return null;
      return (
        <div className="flex flex-row mr-2" key={siteId}>
          <Icon icon={site.icon} className="mr-2" />
          <p key={siteId}>{site.name}</p>
        </div>
      );
    });
  }
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      <Icon
        icon={policy.icon}
        className="text-5xl mt-8 h-48 lg:h-auto lg:w-48 bg-blue-lightest bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
      />
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <div className="text-black font-bold text-xl mb-2">{policy.name}</div>
        <p className="text-grey-darker text-base">{policy.description}</p>
        {siteData}
      </div>
    </div>
  );
};

export default PolicySummary;
