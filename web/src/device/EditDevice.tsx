import React, { Component } from "react";
import { DeviceType, PolicyType, OptionType, UserType } from "../interfaces";
import { Redirect } from "react-router-dom";
import DeviceForm from "./DeviceForm";

interface Props {
  id: string;
  device: DeviceType;
  policies: PolicyType[];
  submit: any;
  cancel: any;
  users: UserType[];
}

interface State {
  device: DeviceType;
}

class EditDevice extends Component<Props, State> {
  render() {
    return (
      <div className="flex justify-center align-center pt-6">
        <div className="w-full max-w-xs">
          <DeviceForm
            device={this.props.device}
            policies={this.props.policies}
            users={this.props.users}
            submit={this.props.submit}
          >
            <div className="flex items-center justify-between">
              <button
                className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Save
              </button>
              <button
                onClick={this.props.cancel}
                className="bg-grey hover:bg-grey-dark text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                cancel
              </button>
            </div>
          </DeviceForm>
        </div>
      </div>
    );
  }
}

export default EditDevice;
