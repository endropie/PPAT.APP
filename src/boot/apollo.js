import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

import { Notify } from 'quasar'

const httpLink = createHttpLink({ uri: 'http://localhost:8000/graphql', fetch: fetch })

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler ({ graphQLErrors, networkError }) {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, locations, path
        )
        Notify.create(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      })
    }
    if (networkError) {
      console.warn(`[Network error]: ${networkError}`)
    }
  }
})

// "async" is optional
export default async ({ app, store, Vue }) => {
  Vue.use(VueApollo)
  Vue.prototype.gql = gql
  // app.apolloProvider = provider
  app.apolloProvider = apolloProvider
}
