import * as actions from '../actions/types'


const initialState = {
    currentChannel: null,
    isPrivateChannel: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case actions.SET_CURRENT_CHANNEL:
        return { ...state, currentChannel: payload.currentChannel }

    case actions.SET_PRIVATE_CHANNEL:
        return{...state, isPrivateChannel : payload.isPrivateChannel}

    default:
        return state
    }
}
