import authReducer from "./authReducer";
import systemReducer from "./systemReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  auth: authReducer,
  system: systemReducer,
  firestore: firestoreReducer
});

export default rootReducer;
