import { fork } from "redux-saga/effects";

import watchMainActionSagas from "./MainAction";

export default function* rootSaga() {
    yield fork(watchMainActionSagas);
}
