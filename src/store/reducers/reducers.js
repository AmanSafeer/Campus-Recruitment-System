import actionTypes from '../constants/constant'

const initialState = {
    menu: false,
    profile: null,
    userId: null,
    updation: null,
    signInLoader: false,

    students: [],
    companies: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SIGNIN: {
            return {
                ...state,
                profile: action.payload,
                userId: action.userId,
                menu: true
            }
        }
        case actionTypes.SIGNOUT: {
            return {
                ...state,
                profile: null,
                userId: null,
                menu: false,
            }
        }
        case actionTypes.SIGNIN_LOADER_OPEN: {
            return {
                ...state,
                signInLoader: true,
            }
        }
        case actionTypes.SIGNIN_LOADER_CLOSE: {
            return {
                ...state,
                signInLoader: false,
            }
        }
        case actionTypes.GETSTUDENTS: {
            return {
                ...state,
                students: action.payload
            }
        }
        case actionTypes.GETCOMPANIES: {
            return {
                ...state,
                companies: action.payload
            }
        }
        case actionTypes.REQUEST: {
            return {
                ...state,
                profile: action.payload,

            }
        }
        case actionTypes.REQUESTED_DATA: {
            return {
                ...state,
                updation: action.payload,

            }
        }
        case actionTypes.UPDATED: {
            return {
                ...state,
                profile: action.payload,

            }
        }
        default: return state;
    }
}
