import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import plannerReducer from "./plannerReducer";
import optimizeReducer from "./optimizeReducer";
import userReducer from "./userReducer";
import permissionReducer from "./permissionReducer";
import roleReducer from "./roleReducer";
import vehicleReducer from "./vehicleReducer";
import parkingReducer from "./parkingReducer";
import supplierReducer from "./supplierReducer";
import auditlogReducer from "./auditlogReducer";
const rootReducer = combineReducers({
  account: accountReducer,
  planner: plannerReducer,
  optimize: optimizeReducer,
  user: userReducer,
  permission: permissionReducer,
  role: roleReducer,
  vehicle: vehicleReducer,
  parking: parkingReducer,
  supplier: supplierReducer,
  auditlog: auditlogReducer,
});

export default rootReducer;
