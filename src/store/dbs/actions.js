import axios from 'axios'
import _ from 'lodash'

export const load = (context, name) => {
  console.warn('name', name)
  const modul = _.get(context.state, name, null)
  console.warn('schema', context.state, modul)
  return axios.get(modul.api).then((response) => {
    console.log(response)
    context.commit('SET_DATA', {
      name: name,
      data: response.data.data
    })
  })
}
