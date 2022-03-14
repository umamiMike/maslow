import authReducer from "./authReducer";
import systemReducer from "./systemReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  system: systemReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;
