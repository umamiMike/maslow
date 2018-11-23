import { DeviceState, SystemState } from "../interfaces";

interface RootState {
  auth: any;
  system: SystemState;
}

// TODO: Fix typing.
// Try https://github.com/reduxjs/redux-thunk/blob/master/test/typescript.ts
// maybe: http://blog.krawaller.se/posts/a-redux-typescript-setup/
// or mostly: https://github.com/reduxjs/redux-thunk/issues/213#issuecomment-413906217
//
// import { Dispatch } from "redux";
// import { ThunkAction } from "redux-thunk";
// type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>;
// export const createDevice: ThunkResult<Promise<boolean>> = (device: DeviceState) => {
//   return Promise.resolve(true)
// }
//
export const createDevice: any = (device: DeviceState) => {
  return (dispatch: any) => {
    dispatch({ type: "CREATE_DEVICE", device });
  };
};
