import Vue from 'vue'
import App from './App'
import router from './router'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import VueApollo from 'vue-apollo'
import BootstrapVue from 'bootstrap-vue'
import VueYouTubeEmbed from 'vue-youtube-embed'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons'

const uris = {
  dev: 'localhost:3000',
  prod: 'medilab-api.mybluemix.net'
}

const httpLink = new HttpLink({
  uri: (window.location.hostname === 'localhost') ? `http://${uris.dev}/graphql` : `https://${uris.prod}/graphql`
})

const wsLink = new WebSocketLink({
  uri: (window.location.hostname === 'localhost') ? `ws://${uris.dev}/subscriptions` : `wss://${uris.prod}/subscriptions`,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  }
}

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: apolloOptions
})

Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.use(VueYouTubeEmbed)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue()

router.beforeEach((to, from, next) => {
  // console.log('Global -- beforeEach - fired')
  if (to.path === '/foo') next('/')
  // else if (to.path === '/error') {
  //   const err = new Error('My Error Message')
  //   next(err)
  // }
  else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
  render: h => h(App)
})
