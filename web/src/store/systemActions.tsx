// TODO: Rename to systemActions

import { DeviceState, SystemState, SiteType, PolicyType } from "../interfaces";

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
  return (dispatch: any, getState: any, { getFirebase, getFirestore }: any) => {
    const firestore = getFirestore();
    firestore
      .collection("devices")
      .add(device)
      .then(() => {
        dispatch({ type: "CREATE_DEVICE", device });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not create device" });
      });
  };
};

export const createSite: any = (site: SiteType) => {
  return (dispatch: any, getState: any, { getFirebase, getFirestore }: any) => {
    const firestore = getFirestore();
    firestore
      .collection("sites")
      .add(site)
      .then(() => {
        dispatch({ type: "CREATE_SITE", site });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not create site" });
      });
  };
};

export const createPolicy: any = (policy: PolicyType) => {
  return (dispatch: any, getState: any, { getFirebase, getFirestore }: any) => {
    const firestore = getFirestore();
    firestore
      .collection("policies")
      .add(policy)
      .then(() => {
        dispatch({ type: "CREATE_POLICY", policy });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not create policy" });
      });
  };
};

export const deleteDevice: any = (id: string) => {
  return (dispatch: any, getState: any, { getFirestore }: any) => {
    const firestore = getFirestore();
    return firestore
      .collection("devices")
      .doc(id)
      .delete()
      .then(() => {
        dispatch({ type: "DELETE_DEVICE", id });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not delete device" });
      });
  };
};

export const deleteSite: any = (id: string) => {
  // TODO: Ensure that the site does not belong to any policies before deleting
  return (dispatch: any, getState: any, { getFirestore }: any) => {
    const firestore = getFirestore();
    return firestore
      .collection("sites")
      .doc(id)
      .delete()
      .then(() => {
        dispatch({ type: "DELETE_SITE", id });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not delete site" });
      });
  };
};

export const deletePolicy: any = (id: string) => {
  return (dispatch: any, getState: any, { getFirestore }: any) => {
    const firestore = getFirestore();
    return firestore
      .collection("policies")
      .doc(id)
      .delete()
      .then(() => {
        dispatch({ type: "DELETE_POLICY", id });
      })
      .catch((e: any) => {
        console.error(e);
        dispatch({ type: "ERROR", message: "Could not delete policy" });
      });
  };
};
