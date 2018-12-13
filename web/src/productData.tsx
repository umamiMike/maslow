import { OptionType } from "./interfaces";

export const manufacturerOptions: OptionType[] = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "google", label: "Google" },
  { value: "amazon", label: "Amazon" },
  { value: "roku", label: "Roku" },
  { value: "fitbit", label: "Fitbit" }
];

export const getDeviceOptions = (manufacturer: string) => {
  const deviceCatalog: { [index: string]: string[] } = {
    apple: ["iPhone", "Macbook", "iMac", "Mac mini", "Mac Pro"],
    samsung: ["Galaxy phone", "Note", "Tablet"],
    google: ["Android phone", "Chromebook", "Android tablet"],
    amazon: ["Fire stick", "Echo", "Echo dot"],
    roku: ["Express", "Express+", "Premiere", "Premiere+"],
    fitbit: ["Scale"]
  };
  const devices = deviceCatalog[manufacturer] || ["Select manufacturer first"];
  return devices.map(device => {
    return { label: device, value: device.replace(" ", "-").toLowerCase() };
  });
};
