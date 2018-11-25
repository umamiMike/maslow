import { AuthState, User } from "../interfaces";

// fixme typings
export const signIn = (credentials: AuthState) => {
  return (
    dispatch: any,
    getState: any,
    { getFirebase }: { getFirebase: any }
  ) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((error: any) => {
        dispatch({ type: "LOGIN_FAILED", error });
      });
  };
};

// fixme typings
export const signOut = () => {
  return (
    dispatch: any,
    getState: any,
    { getFirebase }: { getFirebase: any }
  ) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "LOG_OUT" });
      });
  };
};

export const signUp = (newUser: User) => {
  return (
    dispatch: any,
    getState: any,
    { getFirebase, getFirestore }: { getFirebase: any; getFirestore: any }
  ) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((response: any) => {
        return firestore
          .collection("users")
          .doc(response.user.uid)
          .set({
            firstName: newUser.firstName,
            lastName: newUser.lastName
          });
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch((error: any) => {
        dispatch({ type: "SIGNUP_ERROR", error });
      });
  };
};
