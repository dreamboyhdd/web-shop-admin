import { put, takeEvery, take, cancel, delay, takeLatest } from 'redux-saga/effects';
import { mainTypes } from "../Actions";
import { APIKey, API_END_POINT } from "../../Services/Api";
import { api, API_END_POINT_APP } from '../../Services';
import { EN, VN, LANE } from '../../Enum';
import { getData } from '../../Utils/Storage';
import I18n from '../../Language'
import { param } from 'jquery';

export function* LOADING(action) {
    try {
        delay(300);
        const IsLoading = action && action.params.IsLoading;
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: IsLoading });
    }
    catch (e) {
    }
}
export function* API_spCallServer(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        //params received
        const params = action && action.params
        params.API_key = APIKey;
        /// catch api die
        yield delay(300);
        //Check select data redis
        switch (params.func) {
            case "CPN_spLocationCheckCustomer":
                params.func = "CPN_spLocationCheckCustomer"
                break;

            case "CPN_spLading_PriceMain":
                params.func = "CPN_spLading_PriceMain"
                break;

            case "CPN_spLadingGetAnotherServiceMoney":
                params.func = "CPN_spLadingGetAnotherServiceMoney"
                break;

            case "CPN_spLading_Save":
                params.func = "CPN_spLading_Save_V3"
                break;

            case "CPN_spLading_CreateCode":
                params.func = "CPN_spLading_CreateCode_V3"
                break;

            case "CPN_spLading_Upload_Excel":
                params.func = "CPN_spLading_Upload_Excel_V3"
                break;

            case "CPN_spLocation_GET":
                params.func = "CPN_spLocation_GET"
                break;

            case "WH_spWareHouse_Area_List_V1":
                params.func = "WH_spWareHouse_Area_List_V1"
                break;

            default:
                break;
        }
        //End check select data redis
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/API_spCallServer/", params)
        // check call api success

        if (respone && respone.status === 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)
    }
}
export function* API_spCallServerNoSQL(action) {
    try {
        const params = action && action.params
        params.API_key = APIKey;
        /// catch api die
        yield delay(300);
        //Check select data redis
        switch (params.func) {
            case "CPN_spPayment_COD_Customer_SendMail":
                params.func = "CPN_spPayment_COD_Customer_SendMail"
                break;

            default:
                break;
        }
        //End check select data redis
        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + params.func, params)
        // check call api success
        if (respone && respone.status == 200) {
            respone.data === "" ? action.resolve([]) : action.resolve(JSON.parse(respone.data))
        }
        else {
            // api call fail
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });

        }
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export function* changeLanguage(action) {
    try {
        const language = action.params.language;
        const Type = action.params.Type;
        //let newLanguage = language == VN ? EN : VN;
        delay(300);
        yield put({ type: mainTypes.CHANGE_LANGUAGE_SUCCESS, payload: language })
        I18n.locale = language
        action.resolve(language)
    }
    catch (e) {
        action.reject(e)
    }
}

export function* checkLanguage(action) {
    try {
        const language = yield getData(LANE)
        const newLanguage = language !== null && language !== '' && JSON.parse(language) === 'en' ? JSON.parse(language) : 'vn'
        yield put({ type: mainTypes.CHECK_LANGUAGE_SUCCESS, payload: newLanguage })
        I18n.locale = newLanguage
    }
    catch (e) {
    }
}

export function* EncryptString(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });
        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/EncryptString", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data)
        }
        else {
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}

export function* DecryptString(action) {
    try {
        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        /// catch api die
        yield delay(300);
        // call api
        let respone = yield api.post(API_END_POINT_APP + "/DecryptString", params)
        // check call api success
        if (respone && respone.status == 200) {
            action.resolve(respone.data)
        }
        else {
            action.reject(respone)
            yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        }
    }
    catch (e) {
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}
export function* API_spCallPostFile(action) {
    try {

        //show loading
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: true });

        //params received
        const params = action && action.params
        params.API_key = APIKey;
        let FuncApi = "API_spCallPostFile";
        /// catch api die
        yield delay(300);


        // call api
        let respone = yield api.post(API_END_POINT + "/ApiMain/" + FuncApi, params)

        // check call api success

        respone.data === "" ? action.resolve([]) : action.resolve(respone.data)

        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
    }
    catch (e) {
        ///something wrong
        yield put({ type: mainTypes.LOADING_SUCCESS, payload: false });
        action.reject(e)

    }
}


export default function* watchMainActionSagas() {
    ///Watcher watch Sagas

    yield takeEvery(mainTypes.LOADING, LOADING);
    yield takeLatest(mainTypes.CHANGE_LANGUAGE, changeLanguage);
    yield takeLatest(mainTypes.CHECK_LANGUAGE, checkLanguage);
    yield takeEvery(mainTypes.EncryptString, EncryptString);
    yield takeEvery(mainTypes.DecryptString, DecryptString);
    yield takeEvery(mainTypes.API_spCallServer, API_spCallServer);
    yield takeEvery(mainTypes.API_spCallServerNoSQL, API_spCallServerNoSQL);
    yield takeEvery(mainTypes.CallPostImage, API_spCallPostFile)

}