import React from "react";
import { SiteDict, PolicyType } from "../interfaces";
import PolicyForm from "./PolicyForm";

interface Props {
  siteDict: SiteDict;
  policy: PolicyType;
  handleSubmit: any;
}

export default function EditPolicy(props: Props) {
  const siteOptions = Object.keys(props.siteDict).map(siteId => {
    return { value: siteId, label: props.siteDict[siteId].name };
  });
  return (
    <div className="flex justify-center align-center pt-6">
      <PolicyForm
        handleSubmit={props.handleSubmit}
        policy={props.policy}
        siteOptions={siteOptions}
      >
        <div className="flex items-center justify-between">
          <button
            className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
        </div>
      </PolicyForm>
    </div>
  );
}
