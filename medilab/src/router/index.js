import Vue from 'vue'
import Router from 'vue-router'
import StationLayout from '@/components/StationLayout'
import Patients from '@/components/Patients'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Station Layout',
      component: StationLayout
    },
    {
      path: '/patients',
      name: 'Patients',
      component: Patients
    }
  ]
})
