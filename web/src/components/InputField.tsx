import React from "react";
import { OptionType } from "../interfaces";
import Select from "react-select";

interface Props {
  id?: string;
  label: string;
  value: string;
  handleChange: (e: any) => void;
  type: string;
  placeholder?: string;
  options?: OptionType[];
}

const makeControl = (props: Props, id: string) => {
  if (props.options == null) {
    return (
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
    );
  }
  const selectChange = (event: any) => {
    props.handleChange({
      target: { value: event.value, id: props.id }
    });
  };

  return (
    <Select
      id={id}
      className="w-full"
      options={props.options}
      onChange={selectChange}
      placeholder={props.placeholder}
    />
  );
};

const InputField = (props: Props) => {
  const id = props.id || props.label.replace(/\s/g, "").toLowerCase();
  return (
    <div className="mb-4">
      <label
        className="block text-grey-darker text-sm font-bold mb-2"
        htmlFor={id}
      >
        {props.label}
      </label>
      {makeControl(props, id)}
    </div>
  );
};

export default InputField;
