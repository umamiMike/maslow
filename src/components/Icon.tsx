import React from "react";

interface Props {
  icon: string;
  className?: string;
  style?: any;
}

export default function Icon(props: Props) {
  const [foundry, iconName] = props.icon.split(":");
  let iconClass = foundry === "captainicon" ? iconName : "";
  return (
    <p
      style={props.style}
      className={`font-icon ${iconClass} ${props.className}`}
    />
  );
}
