// import _ from 'lodash'

export const CONTACTS = (state) => {
  return state.contacts.data
}

export const CONTACT = (state) => {
  let contact = {}
  state.contacts.data.map(e => {
    contact[Number(e.id)] = e
  })

  return contact
}

export const MESSAGES = (state) => {
  return state.messages
}

export const MESSAGE_LASTEST = (state) => {
  let message = []
  const objMessage = state.messages

  console.warn('start->objMessage', objMessage, Object.values(objMessage))
  for (const i in objMessage) {
    console.warn('objMessage', objMessage[i])
    if (objMessage.hasOwnProperty(i) && objMessage[i].data) {
      message.push(objMessage[i].data[0])
    }
  }
  return message
}
