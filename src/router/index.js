import Vue from 'vue'
import Router from 'vue-router'
import Login from 'pages/login'
import Index from 'pages/index'
import User from 'components/user'
import Config from 'components/config'
import Log from 'components/log'
import Sim from 'components/simcard'
import Map from 'components/map'
import Parking from 'components/parking'
import ControlCard from 'components/controlCard'
import Program from 'components/program'
import InducePlate from 'components/inducePlate'
import Repeater from 'components/repeater'
import Screen from 'components/screen'
import GeoSensor from 'components/geoSensor'
import Gateway from 'components/gateway'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      redirect: '/map',
      component: Index,
      beforeEnter: (to, from, next) => {
        function getId() {
          return Cookies.get('id')
        }
        if (getId()) {
          next()
        }else {
          next({path: '/login'})
        }
      },
      children: [
        {
          path: '/map',
          component: Map
        },
        {
          path: '/user',
          component: User
        },
        {
          path: '/log',
          component: Log
        },
        {
          path: '/config',
          component: Config
        },
        {
          path: '/sim',
          component: Sim
        },
        {
          path: '/parking',
          component: Parking
        },
        {
          path: '/controlCard',
          component: ControlCard
        },
        {
          path: '/program',
          component: Program
        },
        {
          path: '/inducePlate',
          component: InducePlate
        },
        {
          path: '/repeater',
          component: Repeater
        },
        {
          path: '/screen',
          component: Screen
        },
        {
          path: '/geoSensor',
          component: GeoSensor
        },
        {
          path: '/gateway',
          component: Gateway
        }
      ]
    }
  ]
})

