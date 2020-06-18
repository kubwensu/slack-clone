import * as types from "./types";

export const setUser = (user) => ({
  type: types.SET_USER,
  payload: {
    currentUser: user,
  },
});

export const clearUser = (payload) => ({
  type: types.CLEAR_USER,
});

export const setCurrentChannel = (channel) => ({
  type: types.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  },
});

export const setPrivateChannel = (payload) => ({
  type: types.SET_PRIVATE_CHANNEL,
  payload: {
    isPrivateChannel : payload
  }
})

export const setUserPosts = (payload) => ({
  type: types.SET_USER_POSTS,
  payload : payload
})

export const setColors = (payload) => ({
  type: types.SET_COLORS,
  payload : payload
})


