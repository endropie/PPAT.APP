import _ from 'lodash'

export const SET_DATA = (state, { name, data }) => {
  _.set(state, name, data)
}

export const setPageShow = (state, val) => {
  state.PAGE.show = val
}
