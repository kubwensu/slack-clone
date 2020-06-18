import * as actions from '../actions/types'


const initialState = {
    currentUser:  null,
    isLoading: true 

};

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case actions.SET_USER:
        return { currentUser: payload.currentUser, isLoading: false }

    case actions.CLEAR_USER:
        return{ ...state, isLoading: false}

    default:
        return state
    }
}