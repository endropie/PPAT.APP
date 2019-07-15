
export const TIMESTART = ({ commit }) => {
  setInterval(() => {
    commit('setNow')
  }, 1000 * 5)
}
