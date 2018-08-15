// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
// import store from '../store'
import '../static/bass.less'
import Mint from 'mint-ui'
import md5 from '../utils/md5.js'
import { Toast } from 'mint-ui'

Vue.use(Mint)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

let browser = {
  versions: (function () {
    let u = navigator.userAgent
    let app = navigator.appVersion
    return { // 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
    }
  }()),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
// 上线全局请求配置
axios.defaults.baseURL = 'http://wow.drmfslx.top'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    console.log(config)
    let url = config.url
    let arr = []
    if (url.indexOf('?') != -1) {
      arr = url.split('?')//分割域名和参数界限
    }
    let sign = ''
    if (arr && arr.length > 0) {
      arr[1] = arr[1].split('').reverse().join('')
      sign = md5.hex_md5(arr[1])
    } else {
      sign = 'fdhfjhdsjfhjdhsj'
    }
    config.headers['Content-type'] = 'application/json;chartset=utf-8'
    if (localStorage.getItem('openid')) {
      config.headers.Openid = localStorage.getItem('openid')
      config.headers.Sign = sign
      config.headers.Token = localStorage.getItem('token')
      config.headers.Timestamps = new Date().getTime()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    console.log(response)
    if (response.status == 200 && response.data != null) {
      //异常流程，重新登录
      if (response.data.code && response.data.code == '1001') {
        localStorage.removeItem('token')
        router.replace({
          path: '/q'
        })
        return response.data.message && Toast('当前用户验证失败,请重新登录。')
      } else {
        return response
      }
    } else {
      localStorage.removeItem('token')
      router.replace({
        path: '/q'
      })
      return response.data
    }
  },
  error => {
    Toast(error)
  })
/*router.beforeEach((to, from, next) => {
 console.log(to)
 if (to.name == 'page' || to.name == 'Notfound') {
 next()
 }
 if (!localStorage.getItem('userinfo')) {
 // 第一次访问
 console.log('授权登录')
 let currentUrl = window.location.href //获取当前链接
 // 跳转到微信授权页面，微信授权地址通过服务端获得
 let arr = currentUrl.split('?')//分割域名和参数界限
 if (arr.length > 1) {
 let tem = arr[1].split('=')
 if (tem[0] == 'code') {
 console.log(tem[1])
 } else {
 axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
 window.location.href = res.data.auth_url
 }).catch(error => {
 })
 }
 } else {
 axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
 window.location.href = res.data.auth_url
 }).catch(error => {
 })
 }
 } else {
 // 已经登录
 console.log('已登录')
 next()
 }
 })*/
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.name == 'page' || to.name == 'Notfound') {
    next()
  }
  if (browser.versions.mobile) { // 判断是否是移动设备打开。browser代码在下面
    let ua = navigator.userAgent.toLowerCase()// 获取判断用的对象
    // let storage = window.localStorage
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      /*  if (to.name == '/q') {
       axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
       window.location.href = res.data.auth_url
       }).catch(error => {
       })
       } else {*/
      if (!localStorage.getItem('token')) {
        // 第一次访问
        console.log('授权登录')
        let currentUrl = window.location.href //获取当前链接
        // 跳转到微信授权页面，微信授权地址通过服务端获得
        let arr = currentUrl.split('?')//分割域名和参数界限
        if (arr.length > 1) {
          let tem = arr[1].split('=')
          if (tem[0] == 'code') {
            console.log(tem[1])
            let invite_id = ''
            if (!localStorage.getItem('invite_id')) {
              invite_id = localStorage.getItem('invite_id')
            }
            axios.get(`http://wow.drmfslx.top/wx/get_user_info?code=${tem[1]}&invite_id=${invite_id}`).then(res => {
              console.log(res)
              localStorage.setItem('userinfo', res.data.data.userinfo)
              localStorage.setItem('openid', res.data.data.userinfo.openid)
              localStorage.setItem('token', res.data.data.token)
              next({path: '/indexMain'})
            }).catch(error => {
            })
          } else {
            axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
              window.location.href = res.data.auth_url
            }).catch(error => {
            })
          }
        } else {
          axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
            window.location.href = res.data.auth_url
          }).catch(error => {
          })
        }
      } else {
        // 已经登录
        console.log('已登录')


        next()
      }
    } else {
      next({path: '/page'})
    }
  } else {
    next({path: '/Notfound'})
  }
})
/*router.beforeEach((pageTo, pageFrom, next) => {
 if (browser.versions.mobile) { // 判断是否是移动设备打开。browser代码在下面
 let ua = navigator.userAgent.toLowerCase()// 获取判断用的对象
 // let storage = window.localStorage
 if (ua.match(/MicroMessenger/i) == 'micromessenger') {
 // 在微信中打开
 let currentUrl = window.location.href //获取当前链接

 let name = localStorage.getItem('nickname')
 if (name != null) {
 next()
 } else {
 let arr = currentUrl.split('?')//分割域名和参数界限
 if (arr.length > 1) {
 let tem = arr[1].split('=')
 if (tem[0] == 'code') {
 axios.get(`http://wow.drmfslx.top/wx/get_user_info?code=${tem[1]}`).then(res => {
 console.log(res)
 localStorage.setItem('nickname', res.data.data.userinfo.nickname)
 next({path: '/indexMain'})
 }).catch(error => {
 })
 } else {
 axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
 window.location.href = res.data.auth_url
 }).catch(error => {
 })
 }
 }
 else {
 axios.get('http://wow.drmfslx.top/wx/get_oauth_info?url=http://wwyd.drmfslx.top').then(res => {
 console.log(res.data)
 window.location.href = res.data.auth_url
 }).catch(error => {
 })
 }
 }

 } else {
 alert('kkkk')
 }
 } else {
 // 否则就是PC浏览器打开
 alert('kkkk')
 }
 })*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  components: {App},
  template: '<App/>'
})
