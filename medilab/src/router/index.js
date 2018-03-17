import Vue from 'vue'
import VueRouter from 'vue-router'
import Guard from '../services/middleware'

import Landing from '@/components/Landing'
import Stations from '@/components/Stations'
import Patients from '@/components/Patients'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/stations',
      name: 'Stations',
      component: Stations,
      beforeEnter: Guard.auth
    },
    {
      path: '/patients',
      name: 'Patients',
      component: Patients,
      beforeEnter: Guard.auth
    }
  ]
})
