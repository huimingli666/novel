/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：poster-user
* 模块说明：
* 修改历史：
* 2018/6/7 - lihuiming - 创建
*/
<template>
  <div class="poster-user">
    <div class="poster-user-header">
      <div class="header-first">
        <div class="header-first-left">
          <img :src="userInfo.headimgurl">
        </div>
        <div class="header-first-right">
          <div style="margin-top: 23px;font-size: 20px;font-weight: bold">{{userInfo.nickname}}</div>
          <!--<div class="header-first-right-text">ID 56656</div>-->
        </div>
        <div class="header-first-center">
          <span
            style="background-color: #988D86;color: #b2a8a0;padding: 3px 15px;font-size: 16px;font-weight: bold;border-radius: 5px"
            v-if="userInfo.is_vip=='0'">VIP</span>
          <span
            style="background-color: #c73931;color: #f7d560;padding: 3px 15px;font-size: 16px;font-weight: bold;border-radius: 5px"
            v-if="userInfo.is_vip=='1'">VIP</span>
        </div>
      </div>
      <div class="header-third">
        <div class="header-third-left"><span style="color: #000;font-size: 15px">书币余额</span>&nbsp;&nbsp;<span
          style="font-size: 16px">{{userInfo.balance_book}}</span></div>
        <div class="header-third-right"><span @click="goToRechage">立即充值</span></div>
      </div>
    </div>
    <div style="height: 10px;background-color: #f5f5f6"></div>
    <div class="poster-user-center">
      <div class="user-center-left">自动解锁付费章节</div>
      <div class="user-center-right">
        <mt-switch v-model="value" @change="voluntarySwitch"></mt-switch>
      </div>
    </div>
    <div v-if="userInfo.is_vip=='1'">
      <div style="height: 10px;background-color: #f5f5f6"></div>
      <div class="poster-user-earn">
        <div class="user-earn-first">
          <div class="earn-first-left">我的收益</div>
          <div class="earn-first-right" @click="goToUserCenter()">查看更多</div>
        </div>
        <div class="header-second">
          <div class="header-second-left">
            <div>今日收益（元）</div>
            <div style="color: #000;font-size: 18px;font-weight: bold">￥{{userInfoPay.today_income}}</div>
          </div>
          <!--<div style=" border-right: solid #e8e8e8 1px;margin-top: 3px;margin-bottom: 3px"></div>-->
          <div class="header-second-right">
            <div>昨日收益（元）</div>
            <div style="color: #000;font-size: 18px;font-weight: bold">￥{{userInfoPay.last_day_income}}</div>
          </div>
        </div>
      </div>
      <div style="height: 10px;background-color: #f5f5f6"></div>
      <div class="poster-user-center1">
        <div class="user-center-left">分享我的专属海报</div>
        <div class="user-center-right">
          <span style="font-size: 15px;color: #FF730B" @click="goToUserCenter()">马上赚钱</span><span
          style="font-size: 15px;margin-left: 5px">></span>
        </div>
      </div>
    </div>
    <div v-else class="gotovip" @click="goToVip()">
      <img src="../../static/img/gotovip.png">
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
            <button @click="chageMoney" :disabled="disabled">立即充值</button>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import wx from 'weixin-js-sdk'
  export default {
    data() {
      return {
        topStatus: '',
        list: [{code: '123'}, {code: '456'}],
        selected: "tab-container1",
        value: false,
        navClass: 'ticket-list-nav-re',
        qrcode: '',
        userInfo: {},
        userInfoPay: {},
        popupCenterVisible: false,
        grade: [],
        checkIndex: '',
        disabled: false
        // ...
      };
    },
    methods: {
      voluntarySwitch(checked){
        let self = this;
        console.log(checked)
        this.$axios({
          url: `/user/set_auto_pay`,
          method: "GET",
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data;
          if (code == '0') {
            /*self.moneyList = data.jsapi_params;
             this.onBridgeReady();*/
          }
        }).catch(error => {
        });
      },
      // 微信支付
      onBridgeReady () {
        let that = this;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": that.moneyList.appId,     //公众号名称，由商户传入
            "timeStamp": that.moneyList.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": that.moneyList.nonceStr, //随机串
            "package": that.moneyList.package,
            "signType": that.moneyList.signType,         //微信签名方式：
            "paySign": that.moneyList.paySign //微信签名
          },
          function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              this.popupCenterVisible = false;
              this.userInfo.is_vip = '1';
            }
          });
      },
      getChange(index){
        this.checkIndex = index;
      },
      chageMoney(){
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          this.getMoneyList();
          this.disabled = true;
        }
      },
      getMoneyList(){
        let self = this;
        let money = this.grade[this.checkIndex].money
        if (money > 0) {
          money = money * 100;
          this.$axios({
            url: `/recharge/get_recharge_params?money=${money}`,
            method: "GET",
          }).then(res => {
            console.log(res.data)
            const {code, data} = res.data;
            if (code == '0') {
              self.moneyList = data.jsapi_params;
              this.onBridgeReady();
              this.disabled = false;
            }
          }).catch(error => {
          });
        }
      },
      /*  changeMoney(){
       if (typeof WeixinJSBridge == "undefined"){
       if( document.addEventListener ){
       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
       }else if (document.attachEvent){
       document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
       }
       }else{
       this.getMoneyList();
       }
       },*/
      getGrades(){
        let self = this;
        this.$axios({
          url: `/recharge/consumption_grades`,
          method: "GET",
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data;
          if (code == '0') {
            self.grade = data;
            this.popupCenterVisible = true;
            this.popupVisible = false;
          } else {
            this.popupVisible = true;
          }
        }).catch(error => {
        });
      },
      goToVip(){
        this.$router.push({
          path: '/poster'
        })
      },
      goToUserCenter(){
        this.$router.push({
          path: '/userCenter'
        })
      },
      goToRechage(){
        this.getGrades();
      },
      handleTopChange(status) {
        this.topStatus = status;
      },
      getShare(){
        this.$axios({
          url: `/promotion/share`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data, code} = res;
          if (code == '0') {
            if (data && data.qrcode) {
              this.qrcode = data.qrcode;
              console.log(this.qrcode)
            }
          }
        }).catch(error => {
          console.log(error)
        });
      },
      getUserInfo(){
        this.$axios({
          url: `/user/get_user_info`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data, code} = res.data;
          if (code == '0') {
            this.userInfo = data.userinfo;
            if (this.userInfo.auto_pay == '0') {
              this.value = false;
            } else {
              this.value = true;
            }
            if (this.userInfo.is_vip == '1') {
              this.getUserPay();
              this.getShare();
            }
          }
        }).catch(error => {
        });
      },
      getUserPay(){
        this.$axios({
          url: `/vip/info`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data, status} = res.data;
          if (data) {
            this.userInfoPay = data;
          }
        }).catch(error => {
        });
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      this.getUserInfo()
    }
  };
</script>
<style lang="less">
  body {
    background-color: #f2f2f2 !important;
  }

  .poster-user {
    height: 100%;
    width: 100%;
    .poster-user-header {
      /*padding: 10px 10px;*/
    }
    .header-first {
      display: flex;
      flex-direction: row;
      border-bottom: solid #f5f5f6 1px;
      padding: 15px 0;
      background: -webkit-linear-gradient(right, #f94b30, #ffa124); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #f94b30, #ffa124); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #f94b30, #ffa124); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #f94b30, #ffa124); /* 标准的语法（必须放在最后） */
      .header-first-left {
        width: 30%;
        img {
          width: 70%;
          height: 96%;
          border-radius: 50%;
        }
      }
      .header-first-right {
        width: 50%;
        text-align: left;
        color: #fff;
        .header-first-right-text {
          width: 50%;
          /*border: solid  #ff8584 1px;*/
          border-radius: 4px;
          /*padding: 2px 6px;*/
          margin-top: 5px;
        }
      }
      .header-first-center {
        width: 20%;
        padding-top: 30px;
        padding-right: 10px;
      }
    }
    .header-second {
      display: flex;
      flex-direction: row;
      padding: 15px 0;
      border-bottom: solid #f5f5f6 1px;
      color: #8d8e8f;
      font-size: 15px;
      text-align: left;
      .header-second-left {
        width: 50%;
        padding-left: 10px;
      }
      .header-second-right {
        width: 50%;
        padding-left: 10px;
      }
    }
    .poster-user-center {
      display: flex;
      flex-direction: row;
      background-color: white;
      padding: 10px 10px;
      .user-center-left {
        width: 80%;
        text-align: left;
        font-size: 15px;
        padding-top: 5px;
      }
      .user-center-right {
        width: 20%;
        text-align: right;
      }
    }

    .poster-user-center1 {
      display: flex;
      flex-direction: row;
      background-color: white;
      padding: 10px 10px;
      .user-center-left {
        width: 60%;
        text-align: left;
        font-size: 15px;
      }
      .user-center-right {
        width: 40%;
        text-align: right;
      }
    }
    .header-third {
      color: #FF730B;
      /*padding-top: 5px;*/
      display: flex;
      flex-direction: row;
      padding: 15px 10px;
      background-color: white;
      .header-third-left {
        width: 50%;
        text-align: left;
      }
      .header-third-right {
        width: 50%;
        text-align: right;
        span {
          border: solid #FF730B 1px;
          border-radius: 3px;
          padding: 7px 10px;
          font-size: 16px;
        }
      }
    }
    .poster-user-earn {
      background-color: white;
      /*margin-top: 10px;*/
      .user-earn-first {
        display: flex;
        flex-direction: row;
        padding: 10px 10px;
        .earn-first-left {
          width: 50%;
          text-align: left;
          font-size: 14px;
        }
        .earn-first-right {
          width: 50%;
          text-align: right;
          font-size: 14px;
        }
      }
    }

    .mint-switch-input:checked + .mint-switch-core {
      border-color: #4BD662;
      background-color: #4BD662;
    }

    .gotovip {
      img {
        width: 100%;
        height: 100%;
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
          margin-bottom: 10px;
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
  }
</style>
