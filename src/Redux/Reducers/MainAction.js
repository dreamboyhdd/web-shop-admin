import { mainTypes } from '../Actions'
const initialState = {
    IsLoading: false
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        
        case mainTypes.LOADING_SUCCESS:
            return {
                ...state,
                IsLoading: action.payload
            }
        default:
            return state;
    }
}
