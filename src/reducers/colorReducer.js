import * as actions from '../actions/types'
const initialState = {
    colors: ['#4c3c4c' ,'#eee']
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case actions.SET_COLORS:
        return { ...state, colors: payload }

    default:
        return state
    }
}
