import React from "react";
import Select from "react-select";
import Icon from "./Icon";
import { OptionType } from "../interfaces";

interface Props {
  id: string;
  value: string;
  onChange: (selected: any) => void;
}

function DropdownIcon(props: Props) {
  const options: OptionType[] = Array(375)
    .fill(null)
    .map((_: any, index: number) => {
      const strIndex = String(index + 1);
      const value = new Array(3 - strIndex.length + 1).join("0") + strIndex;
      return { value: `captainicon:icon-${value}`, label: String(index + 1) };
    });

  const onChange = (selectedOption: any) => {
    const event = { target: { id: props.id, value: selectedOption.value } };
    props.onChange(event);
  };

  const value = { value: props.value, label: props.value };
  return (
    <div className="mb-4">
      <label
        className="block text-grey-darker text-sm font-bold mb-2"
        htmlFor="icon"
      >
        Icon
      </label>
      <div className="flex flex-row w-full">
        <Icon
          icon={props.value}
          style={{ width: 20, height: 20 }}
          className="text-3xl ml-2 mr-4 mt-1 font-icon"
        />
        <Select
          value={value}
          className="w-full"
          options={options}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default DropdownIcon;
