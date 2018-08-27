/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：read-contain
* 模块说明：
* 修改历史：
* 2018/7/3 - lihuiming - 创建
*/
<template>
  <div class="read-contain">
    <div>
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="before">
          <div @click="goToBefore()">
            上一章
          </div>
        </mt-tab-item>
        <mt-tab-item id="list">
          <div @click="goToHomeList()">目录</div>
        </mt-tab-item>
        <mt-tab-item id="next">
          <div @click="goToNext()">
            下一章
          </div>
        </mt-tab-item>
      </mt-tabbar>
    </div>
    <div class="index-main-contain" style="margin-bottom: 25px" :class="type=='1'?'read-contain-novel':''">
      <div v-if="type=='1'"
           style="color: #555;font-size: 22px;font-weight: bold;margin: 40px 0 20px 0;text-align: left">
        {{title}}
      </div>
      <mt-tab-container>
        <div class="read-contain-img" id="readImg">
          <!--<img v-for="item in list" :src="item">-->
        </div>
      </mt-tab-container>
      <div class="read-contain-end">
        <div class="read-contain-end-left"><img src="../../static/img/qrcode.jpg"></div>
        <div class="read-contain-end-right">
          <div class="end-right-first">长按二维码关注“哇呜阅读”</div>
          <div class="end-right-second">更多精彩内容等着你</div>
          <div class="end-right-third">
            <span @click="goToHome">查看首页</span>
          </div>
        </div>
      </div>
      <div style="height: 40px"></div>
    </div>

    <div>
      <mt-popup
        v-model="popupVisible"
        position="bottom" :closeOnClickModal="false" :lockScroll="true">
        <div class="mtpouup-main">
          <div class="mtpouup-main-first">解锁后继续阅读</div>
          <div class="mtpouup-main-second">书币余额：<span
            style="color:#ff9343 ">{{PayInfo.book_balace == null ? '0' : PayInfo.book_balace}}</span>书币
          </div>
          <div class="mtpouup-main-third">本章解锁：<span
            style="color:#ff9343 ">{{PayInfo.original_price}}</span>书币（VIP半价：<span
            style="color:#ff9343 ">{{PayInfo.vip_price}}</span>书币）
          </div>
          <div class="mtpouup-main-four">
            <button @click="unlock" v-if="showLock">解锁阅读下一章</button>
            <button @click="rechageUnlock" v-if="showRechage">充值并解锁</button>
          </div>
          <div class="mtpouup-main-five">
            <mt-checklist
              title="" multiple
              v-model="value"
              :options="options" @change="checkAuto">
            </mt-checklist>
          </div>
        </div>
      </mt-popup>
    </div>
    <div>
      <mt-popup
        v-model="popupCenterVisible"
        position="middle" :closeOnClickModal="true">
        <div class="mtpouup-main-middle">
          <div class="mtpouup-main-middle-first">选择充值金额</div>
          <div class="mtpouup-main-middle-second">首充优惠多</div>
          <div class="mtpouup-main-middle-list" v-for="(item,index) in grade" :key="index">
            <button @click="getChange(index)" :class="checkIndex===index?'button-check':''">
              <span style="text-align: right">{{item.money}}元</span>
              <span style="margin-left: 15px">{{item.book_coin}}书币(首充送{{item.first_give}})</span>
            </button>
          </div>
          <div class="mtpouup-main-middle-third">充值98元赠送永久VIP</div>
          <div class="mtpouup-main-middle-four">
            <button @click="chageMoney">立即充值</button>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import UserHome from '../view/home.vue'
  import RecentlyRead from './recently-read.vue'
  import UserCenter from '../view/poster-user.vue'
  import wx from 'weixin-js-sdk'
  export default {
    watch: {
      selected: function (val, oldVal) {
        // 这里就可以通过 val 的值变更来确定
        console.log(val)
      },
      popupCenterVisible: function (val, oldVal) {
        // 这里就可以通过 val 的值变更来确定
        console.log(val)
        if (!val) {
          this.checkIndex = ''
          this.popupVisible = true
        }
      }
    },
    data() {
      return {
        list: {},
        selected: 'home',
        page: 1,
        id: '',
        section_num: '',
        popupVisible: false,
        popupCenterVisible: false,
        value: true,
        grade: [],
        checkIndex: '',
        options: ['自动解锁下一章，不再提示'],
        PayInfo: {},
        showLock: false,
        showRechage: false,
        moneyList: {},
        type: '',
        title: ''
      }
    },
    components: {
      UserHome,
      RecentlyRead,
      UserCenter,
    },
    methods: {
      checkAuto(checked){
        let self = this
        console.log(checked)
        if (this.PayInfo.auto_pay == 1 && checked) {
          return
        }
        if (this.PayInfo.auto_pay == 0 && !checked) {
          return
        }
        this.$axios({
          url: `/user/set_auto_pay`,
          method: 'GET',
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data
          if (code == '0') {
            if (checked) {
              this.PayInfo.auto_pay = 1
            } else {
              this.PayInfo.auto_pay = 0
            }
          }
        }).catch(error => {
        })
      },
      // 微信支付
      onBridgeReady () {
        let that = this
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': that.moneyList.appId,     //公众号名称，由商户传入
            'timeStamp': that.moneyList.timeStamp,         //时间戳，自1970年以来的秒数
            'nonceStr': that.moneyList.nonceStr, //随机串
            'package': that.moneyList.package,
            'signType': that.moneyList.signType,         //微信签名方式：
            'paySign': that.moneyList.paySign //微信签名
          },
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              this.checkAuto(this.value)
              this.popupCenterVisible = false
              this.section_num = this.section_num - 1
              this.goToNext()
            }
          })
      },
      getChange(index){
        this.checkIndex = index
      },
      chageMoney(){
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        } else {
          this.getMoneyList()
        }
      },
      getMoneyList(){
        let self = this
        let money = this.grade[this.checkIndex].money
        if (money > 0) {
          money = money * 100
          this.$axios({
            url: `/recharge/get_recharge_params?money=${money}`,
            method: 'GET',
          }).then(res => {
            console.log(res.data)
            const {code, data} = res.data
            if (code == '0') {
              self.moneyList = data.jsapi_params
              this.onBridgeReady()
            }
          }).catch(error => {
          })
        }
      },
      unlock(){
        let params = {
          works_id: this.id,
          section_num: parseInt(this.section_num)
        }
        let self = this
        this.$axios({
          url: `/pay/chapter?works_id=${params.works_id}&section_num=${params.section_num}`,
          method: 'GET',
        }).then(res => {
          const {code, data} = res.data
          this.section_num = parseInt(this.section_num) - 1
          if (code == '0') {
            this.checkAuto(this.value)
            this.popupVisible = false
            this.goToNext()
          } else {
            this.$toast('解锁失败')
          }
        }).catch(error => {
        })
      },
      rechageUnlock(){
        this.getGrades()
      },
      goToHomeList(){
        let self = this
        this.$router.push({
          path: '/novelList',
          query: {
            id: self.id,
            type: self.type
          }
        })
      },
      goToNext(){
        this.section_num = parseInt(this.section_num) + 1
        console.log(this.section_num)
        this.getList()
      },
      getGrades(){
        let self = this
        this.$axios({
          url: `/recharge/consumption_grades`,
          method: 'GET',
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data
          if (code == '0') {
            self.grade = data
            this.popupCenterVisible = true
            this.popupVisible = false
          } else {
            this.popupVisible = true
          }
        }).catch(error => {
        })
      },
      goToBefore(){
        if (this.section_num <= 1) {
          return
        }
        this.section_num = parseInt(this.section_num) - 1
        this.getList(this.section_num)
      },
//      获取用户预期收益
      getList(){
        let params = {
          works_id: this.id,
          section_num: parseInt(this.section_num)
        }
        let self = this
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.$axios({
          url: `/home/detail?works_id=${params.works_id}&section_num=${params.section_num}`,
          method: 'GET',
//          data: {params}
        }).then(res => {
          const {code, data} = res.data
          if (code == '0') {
            self.list = []
            this.section_num = parseInt(data.section_num)
            document.body.scrollTop = document.documentElement.scrollTop = 0
            if (self.type == '0') {
              self.list = data.works_detail
              this.dealImg()
            } else {
              this.title = data.title
              document.getElementById('readImg').innerHTML = data.works_detail
            }
          }
          if (code == '-1') {
            self.getPayInfo()
          }
          this.$indicator.close()
        }).catch(error => {
          this.$indicator.close()
        })
      },
      dealImg(){
        console.time('统计时间')
        document.getElementById('readImg').innerHTML = ''
        let len = this.list.length
        if (this.list.length > 0) {
          let h = ``
          for (let i = 0; i < len; i++) {
            h += '<img  src="' + this.list[i] + '">'
          }
          document.getElementById('readImg').innerHTML = h
          console.timeEnd('统计时间')
        }
      },
      getPayInfo(){
        let self = this
        let params = {
          works_id: this.id,
          section_num: parseInt(this.section_num)
        }
        this.$axios({
          url: `/pay/get_pay_info?works_id=${params.works_id}&section_num=${params.section_num}`,
          method: 'GET',
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data
          if (code == '0') {
            self.PayInfo = data
            self.dealPayInfo()
            self.popupVisible = true
            /* if (self.PayInfo.auto_pay == '1') {
             if (this.PayInfo.book_balace != null) {
             if (this.PayInfo.is_vip) {
             if (this.PayInfo.book_balace > this.PayInfo.vip_price) {
             this.unlock();
             } else {
             self.dealPayInfo();
             self.popupVisible = true;
             }
             } else {
             if (this.PayInfo.book_balace > this.PayInfo.original_price) {
             this.unlock();
             } else {
             self.dealPayInfo();
             self.popupVisible = true;
             }
             }
             }
             } else {
             self.dealPayInfo();
             //            self.section_num = self.section_num - 1;
             self.popupVisible = true;
             }*/
          } else {
            self.popupVisible = true
          }
        }).catch(error => {
        })
      },
      dealPayInfo(){
        if (this.PayInfo.book_balace != null) {
          if (this.PayInfo.is_vip) {
            if (this.PayInfo.book_balace > this.PayInfo.vip_price) {
              this.showLock = true
              this.showRechage = false
            } else {
              this.showLock = false
              this.showRechage = true
            }
          } else {
            if (this.PayInfo.book_balace > this.PayInfo.original_price) {
              this.showLock = true
              this.showRechage = false
            } else {
              this.showLock = false
              this.showRechage = true
            }
          }
        } else {
          this.showLock = false
          this.showRechage = true
        }
        if (this.PayInfo.auto_pay == '0') {
          this.value = false
        } else {
          this.value = true
        }

      },
      goToHome(){
        this.$router.push({
          path: '/indexMain',
          query: {
            type: 'home'
          }
        })
      },
      goTODetail(){
        this.$router.push({
          path: '/orderDetail'
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读'
      this.id = this.$route.query.id
      this.type = this.$route.query.type
      this.section_num = this.$route.query.num
//      this.section_num = 1;
      this.getList()
    }
  }
</script>
<style lang="less" type="text/less">
  .read-contain {
    height: 100%;
    .read-contain-novel {
      padding: 0 10px;
      background-color: #F4F0EA;
      overflow: scroll;
      margin-top: -20px;
    }

    .mint-tabbar {
      padding: 10px 0;
      border-top: solid #000 1px;
      z-index: 2000;
      .mint-tab-item-label {
        font-size: 16px;
      }
      .mint-tab-item.is-selected {
        background-color: transparent;
        color: #FF730B;
      }
    }

    .tab-selected {
      color: #FF730B;
    }
    .tab-unselected {
      color: #999;
    }
    .read-contain-img {
      width: 100%;
      margin-bottom: 50px;
      img {
        width: 100%;
        margin: -2px 0;
      }
      p {
        text-align: left;
        text-indent: 2em;
        font-size: 19px;
        line-height: 1.7;
        letter-spacing: 2px
      }
    }
    .mtpouup-main {
      height: 180px;
      background-color: #fff;
      z-index: 9999;
      width: 100%;
      color: #555;
      .mtpouup-main-first {
        margin-top: 12px;
        font-size: 15px;
      }

      .mtpouup-main-second {
        margin-top: 12px;
        text-align: left;
        margin-left: 5%;
        font-size: 16px;
      }

      .mtpouup-main-third {
        margin-top: 2px;
        text-align: left;
        margin-left: 5%;
        font-size: 16px;
      }

      .mtpouup-main-four {
        button {
          width: 90%;
          background-color: #ff9343;
          border: solid 1px #ff9343;
          border-radius: 3px;
          /*border-color: #ff9343;
          border-radius: 3px;*/
          padding: 10px 0;
          color: #fff;
          margin-top: 5px;
          /*margin-bottom: 5px;*/
        }
      }

      .mtpouup-main-five {
        text-align: left;
        margin-left: 5%;
        font-size: 16px;
        margin-bottom: 10px;
      }
    }

    .mtpouup-main-middle {
      min-height: 150px;
      .mtpouup-main-middle-first {
        margin-top: 12px;
        font-size: 18px;
      }

      .mtpouup-main-middle-second {
        font-size: 15px;
        color: #ff9343;
      }

      .mtpouup-main-middle-list {
        margin-bottom: 3px;
        button {
          width: 90%;
          background-color: #fff;
          border: solid 1px #b8b8b8;
          border-radius: 3px;
          padding: 6px 10px;
          color: #808080;
          text-align: justify;
          margin-top: 5px;
          font-size: 15px;
        }
        .button-check {
          background-color: #ffe3ce;
          border: solid 1px #ff9343;
        }
      }

      .mtpouup-main-middle-third {
        font-size: 15px;
        color: #ff9343;
        margin-top: 10px;
      }

      .mtpouup-main-middle-four {
        button {
          width: 90%;
          background-color: #ff9343;
          border: solid 1px #ff9343;
          border-radius: 3px;
          /*border-color: #ff9343;
          border-radius: 3px;*/
          padding: 7px 0;
          color: #fff;
          margin-top: 5px;
          margin-bottom: 20px;
          font-size: 15px;
        }
      }
    }
    .mint-popup-middle {
      width: 80%;
    }
    .mint-popup-bottom {
      width: 100%;
    }
    .mint-cell-wrapper {
      padding: 0 0;
      line-height: 0;
      font-size: 14px;
      background-image: none;
    }
    .mint-cell {
      min-height: 0;
    }
    .mint-checklist-label {
      padding: 0 0;
    }
    .mint-cell:last-child {
      background-image: none;
    }

    .read-contain-end {
      display: flex;
      flex-direction: row;
      height: 115px;
      margin-bottom: 25px;
      .read-contain-end-left {
        width: 35%;
        padding: 0 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .read-contain-end-right {
        width: 65%;
        color: #555;
        font-size: 15px;
        text-align: left;
        font-weight: bold;
        .end-right-first {
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .end-right-second {
          margin-bottom: 15px;
        }

        .end-right-third {
          span {
            width: 50%;
            text-align: center;
            border: solid #FF730B 1px;
            color: #FF730B;
            border-radius: 3px;
            font-size: 16px;
            padding: 7px 13px;
          }
        }
      }
    }
  }
</style>
