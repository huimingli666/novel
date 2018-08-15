import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import ticketList from '../view/ticket-list.vue'
// import searchTicketList from '../view/search-ticket-list.vue'
import applyWithdraw from '../view/apply-withdraw.vue'
import userCenter from '../view/user-center.vue'
// import orderDetail from '../view/order-detail.vue'
import poster from '../view/poster.vue'
import posterUser from '../view/poster-user.vue'
import withdrawList from '../view/withdraw-list.vue'
import indexMain from '../view/index-main.vue'
import novelList from '../view/novel-list.vue'
import readContain from '../view/read-contain.vue'
import Notfound from '../view/Notfound.vue'
import page from '../view/page.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/applyWithdraw',
      name: 'applyWithdraw',
      component: applyWithdraw
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    },
    {
      path: '/poster',
      name: 'poster',
      component: poster
    },
    {
      path: '/withdrawList',
      name: 'withdrawList',
      component: withdrawList
    },
    {
      path: '/posterUser',
      name: 'posterUser',
      component: posterUser
    },
    {
      path: '/indexMain',
      name: 'indexMain',
      component: indexMain
    },
    {
      path: '/novelList',
      name: 'novelList',
      component: novelList
    },
    {
      path: '/readContain',
      name: 'readContain',
      component: readContain
    },
    {
      path: '/Notfound',
      name: 'Notfound',
      component: Notfound
    },
    {
      path: '/page',
      name: 'page',
      component: page
    }
  ]
})

