import { combineReducers } from "redux";

import MainActionReducer from "../Reducers/MainAction";
const rootReducer = combineReducers({
    MainAction:MainActionReducer,
});

export default rootReducer;
