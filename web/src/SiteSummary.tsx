import React from "react";
import { SiteType } from "./interfaces";

const SiteSummary = ({ site }: { site: SiteType }) => {
  const [foundry, iconName] = site.icon.split(":");
  let iconClass = foundry === "captainicon" ? iconName : "";
  const regexCount = site.addresses.length;
  return (
    <div className="max-w w-full lg:flex p-1 border-r bg-blue-lightest border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light ">
      <div
        className={`${iconClass} text-5xl mt-8 h-48 lg:h-auto lg:w-48 bg-blue-lightest bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden}`}
        title="Site"
      />
      <div className="lg:w-64 bg-blue-lightest p-4 flex flex-col justify-between leading-normal">
        <div className="text-black font-bold text-xl mb-2">{site.name}</div>
        <p className="text-grey-darker text-base">{site.description}</p>
        <p className="grey-text">{regexCount} addresses</p>
      </div>
    </div>
  );
};

export default SiteSummary;
