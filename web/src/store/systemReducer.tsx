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
  message?: any;
}

const systemReducer = (state = initState, action: Action) => {
  switch (action.type) {
    case "CREATE_DEVICE":
      return state;
    case "ERROR":
      console.log(action.message);
    default:
      // console.log("INVALID ACTION", action.type);
      return state;
  }
};

export default systemReducer;
