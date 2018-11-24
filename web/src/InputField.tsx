import React from "react";

interface Props {
  id?: string;
  label: string;
  value: string;
  handleChange: (e: any) => void;
  type: string;
  placeholder: string;
}

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
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
};

export default InputField;
