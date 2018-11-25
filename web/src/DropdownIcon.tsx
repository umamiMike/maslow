import React from "react";

function DropdownIcon() {
  const options = Array(375)
    .fill(null)
    .map((_: any, index: number) => {
      return <option value={`icon-${index}`}>{index}</option>;
    });
  return <select>{options}</select>;
}

export default DropdownIcon;
