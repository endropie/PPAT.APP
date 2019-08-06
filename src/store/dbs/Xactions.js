import _ from 'lodash'
import axios from 'axios'
import gql from 'graphql-tag'
import { apolloClient } from '@/boot/apollo'

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

const QUE_CONTACTS = gql`
  query contactList ($id: ID){
    contacts (id: $id){
      id
      name
      email
    }
  }`

export const FETCH_CONTACTS = async (context) => {
  const response = await apolloClient.query({
    query: QUE_CONTACTS,
    variables: {
      id: context.rootGetters['admin/USER'].id || context.rootState.admin.USER.id
    }
  })

  if (!response.data) {
    console.error('[STORE]', 'actions FETCH_CONTACTS has errors!')
    return false
  }
  for (let i = 0; i < response.data.contacts.length; i++) {
    const contact = response.data.contacts[i]
    context.dispatch('FETCH_MESSAGE', { partner: contact.id })
  }

  context.commit('SET_CONTACTS', {
    ...response,
    data: response.data.contacts
  })
  // console.log('FETCH_CONTACTS', response)
}

export const FETCH_MESSAGES = async (context) => {
  const response = await apolloClient.query({
    query: gql` query messageUserList ($where: WhereConstraints){
      messages (where: $where){
        id to from text
        user_to { name }
        user_from { name }
      }
    }`,
    variables: {
      user: context.rootGetters['admin/USER'].id
    }
  })

  context.commit('SET_MESSAGES', {
    ...response,
    data: response.data.messages.map(x => {
      x.partner = Number(x.to) === Number(context.rootGetters['admin/USER'].id) ? x.from : x.to
      return x
    })
  })
  console.log('FETCH_MESSAGES', response)
}

export const FETCH_MESSAGE = async (context, val) => {
  // console.warn('FETCH_MESSAGE', context.rootGetters['admin/USER'].id, val.partner)

  const response = await apolloClient.query({
    query: gql` query messageUserList ($user: ID, $partner: ID){
      messages (
        user: $user, partner: $partner
        orderBy: {field: "created_at", order:DESC}
      ){
        id to from text
        user_to { name }
        user_from { name }
      }
    }`,
    variables: {
      user: context.rootGetters['admin/USER'].id,
      partner: val.partner
    }
  })
  // console.warn(response)
  context.commit('SET_MESSAGE', {
    ...response,
    partner: val.partner,
    data: response.data.messages.map(x => {
      x.isme = Number(x.from) === Number(context.rootGetters['admin/USER'].id)
      return x
    })
  })
  // console.log('SET_MESSAGE', response)
}
