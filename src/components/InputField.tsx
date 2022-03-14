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
  className?: string;
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

  const value = props.options.find(option => option.value === props.value);

  return (
    <Select
      id={id}
      className="w-full"
      options={props.options}
      onChange={selectChange}
      placeholder={props.placeholder}
      value={value}
    />
  );
};

const InputField = (props: Props) => {
  const id = props.id || props.label.replace(/\s/g, "").toLowerCase();
  let className = props.className || "";
  className += " mb-4";
  return (
    <div className={className}>
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
