import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import taskSlice from "./Slices/TaskSlice";
const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["task"],
};

const rootReducer = combineReducers({
  task: taskSlice,
});

export { rootPersistConfig, rootReducer };
