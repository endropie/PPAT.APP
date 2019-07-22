import _ from 'lodash'

export const SET_DATA = (state, { name, data }) => {
  _.set(state, name, data)
}

export const SET_CONTACTS = (state, val) => {
  state.contacts = val
}

export const SET_CONTACT = (state, val) => {
  state.contacts = val
}

export const SET_MESSAGES = (state, val) => {
  if (state.messages.length === 0) {
    state.messages = val
  } else {
    state.messages.data = val.data || []
    state.messages.loading = val.loading
    state.messages.networkStatus = val.networkStatus
    state.messages.stale = val.stale
  }
}

export const ADD_MESSAGE = (state, val) => {
  console.warn('ADD_MESSAGE', val, state.messages)
  if (!state.messages.hasOwnProperty(Number(val.to))) {
    state.messages[Number(val.to)].data = []
  }

  state.messages[Number(val.to)].data.unshift(val)
}

export const SET_MESSAGE = (state, val) => {
  if (!state.messages.hasOwnProperty(val.partner)) {
    state.messages[val.partner] = val
  } else {
    state.messages[val.partner].data = val.data || []
    state.messages[val.partner].loading = val.loading
    state.messages[val.partner].networkStatus = val.networkStatus
    state.messages[val.partner].stale = val.stale
  }
}
