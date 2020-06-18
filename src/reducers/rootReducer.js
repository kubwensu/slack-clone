import { combineReducers } from "redux";
import userReducer from "./userReducer";
import channelReducer from "./channelReducer";
import userPosts from './userPosts'
import colorReducer from './colorReducer'

const rootReducer = combineReducers({
    user: userReducer,
    channel: channelReducer,
    topPosts: userPosts,
    colors: colorReducer
})

export default rootReducer;