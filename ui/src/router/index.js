import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'
import store from '@/vuex/auth'

// subpages
import Home from '@/pages/Home'
import Clsh from '@/pages/Clsh'
import Activites from '@/pages/Activites'
import Membres from '@/pages/Membres'
import Factures from '@/pages/Factures'

// router config
Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Dashboard,
      redirect: '/membres',
      children: [
        {
          path: 'azuroams',
          name: 'Bienvenue sur Azuroams',
          component: Home
        },
        {
          path: 'clsh',
          name: 'Gestion des centres de loisirs',
          component: Clsh
        },
        {
          path: 'activites',
          name: 'Gestion des activités',
          component: Activites
        },
        {
          path: 'membres',
          name: 'Gestion des membres',
          component: Membres
        },
        {
          path: 'factures',
          name: 'Gestion des factures',
          component: Factures
        }
      ]},
    { path: '*', component: NotFound }
  ],
  saveScrollPosition: true,
  history: true
})
router.beforeEach((to, from, next) => {
  if (!store.state.isAuthenticated && to.path !== '/login') {
    router.push('/login')
    next(false)
  } else if (store.state.isAuthenticated && to.path === '/login') {
    router.push('/')
    next(false)
  } else {
    next()
  }
})

export default router
