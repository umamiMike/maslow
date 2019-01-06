import React, { Component } from "react";
import InputField from "../components/InputField";
import { OptionType, PolicyDict } from "../interfaces";

const POLICY_DURATIONS: OptionType[] = [
  { value: 15 * 60, label: "15 min" },
  { value: 30 * 60, label: "30 min" },
  { value: 60 * 60, label: "1 hr" },
  { value: 4 * 60 * 60, label: "4 hrs" },
  { value: 4 * 60 * 60, label: "8 hrs" },
  { value: 24 * 60 * 60, label: "24 hrs" }
];

interface Props {
  policyDict: PolicyDict;

  deleteDevice: any;
  editDevice: any;
  createTemporaryPolicy: any;
}

interface State {
  selectedPolicyId: string;
  policyDuration: string;
}

export class ActionPanel extends Component<Props, State> {
  state: State = {
    policyDuration: "30 min",
    selectedPolicyId: ""
  };

  handleChange = (e: any) => {
    let value = e.target.value as string;
    let target = e.target.id as string;
    if (target === "selectedPolicyId")
      this.setState({ selectedPolicyId: value });
    if (target === "policyDuration") this.setState({ policyDuration: value });
  };

  render() {
    const policyOptions = Object.keys(this.props.policyDict).map(policyId => {
      return { value: policyId, label: this.props.policyDict[policyId].name };
    });
    return (
      <div className="flex flex-col justify-between items-start px-4">
        <div className="mt-4 m-2 p-2 border border-solid border-grey rounded">
          <InputField
            className="w-48 mt-4"
            id="selectedPolicyId"
            label="Select policy"
            value={this.state.selectedPolicyId}
            options={policyOptions}
            type="select"
            handleChange={this.handleChange}
          />
          <InputField
            className="w-48 mt-2"
            label="Select duration"
            id="policyDuration"
            value={this.state.policyDuration}
            options={POLICY_DURATIONS}
            type="select"
            handleChange={this.handleChange}
          />
          <button
            onClick={() =>
              this.props.createTemporaryPolicy(
                this.state.selectedPolicyId,
                this.state.policyDuration
              )
            }
            className="bg-blue mb-4 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Grant access
          </button>
          <button
            onClick={this.props.editDevice}
            className="bg-blue m-4 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit
          </button>
        </div>
        <button
          onClick={this.props.deleteDevice}
          className="bg-red mb-4 hover:bg-red-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </div>
    );
  }
}

export default ActionPanel;
