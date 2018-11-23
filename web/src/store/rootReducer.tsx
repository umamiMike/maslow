import authReducer from "./authReducer";
import systemReducer from "./systemReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  system: systemReducer
});

export default rootReducer;
