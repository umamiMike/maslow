import { DeviceState } from "../interfaces";

const initState = {
  devices: [
    {
      id: "1",
      name: "glyph",
      description: "Peter's iPhone",
      mac: "00:50:f1:80:00:00"
    },
    {
      id: "2",
      name: "zorro",
      description: "wireless scale",
      mac: "dc:a9:04:76:06:c2"
    }
  ]
};

interface Action {
  type: string;
  device?: DeviceState;
}

const systemReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "CREATE_DEVICE":
      console.log("created device", action.device);
  }
  return state;
};

export default systemReducer;
