import * as actions from '../actions/types'

const initialState = {
    userPosts : null 

}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case actions.SET_USER_POSTS:
        return { ...state, userPosts: payload }

    default:
        return state
    }
}
