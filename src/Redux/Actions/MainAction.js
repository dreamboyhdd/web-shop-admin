import { mainTypes } from ".";

export function closeError(params, cb) {
    return {
        type: mainTypes.ERROR,
        params,
        cb,
    }
}

export function changeLanguage(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.CHANGE_LANGUAGE,
            params,
            resolve,
            reject
        })
    })
}

export function checkLanguage() {
    return {
        type: mainTypes.CHECK_LANGUAGE,
    }
}

export function LOADING(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.LOADING,
            params,
            resolve,
            reject
        })
    })
}

export function API_spCallServer(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.API_spCallServer,
            params,
            resolve,
            reject
        })
    })
}

export function API_spCallServerNoSQL(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.API_spCallServerNoSQL,
            params,
            resolve,
            reject
        })
    })
}

export function EncryptString(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.EncryptString,
            params,
            resolve,
            reject,
        });
    });
}


export function DecryptString(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.DecryptString,
            params,
            resolve,
            reject,
        });
    });
}

export function API_spCallPostImage(params, dispatch) {
    return new Promise((resolve, reject) => {
        dispatch({
            type: mainTypes.CallPostImage,
            params,
            resolve,
            reject
        })
    })
}