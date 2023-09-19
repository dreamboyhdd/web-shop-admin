import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import rootReducer from "../Reducers";
import rootSaga from "../Sagas";


const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
    // middlewares.push(logger);
}

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middlewares),
    ),
);

sagaMiddleware.run(rootSaga);

export default store;
