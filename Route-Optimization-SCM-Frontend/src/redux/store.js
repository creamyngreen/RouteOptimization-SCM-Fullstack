import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer/rootReducer";
import { injectStore } from "./../setup/axios";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["account", "optimize"], // only persist account and optimize reducers
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// Create persistor
export const persistor = persistStore(store);

injectStore(store);
export default store;
