/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：poster
* 模块说明：
* 修改历史：
* 2018/6/7 - lihuiming - 创建
*/
<template>
  <div class="poster">
    <!--<div class="poster-header">-->
    <!--抢好友，赚钱花-->
    <!--</div>-->
    <div class="poster-middle-vip">
      <img src="../../static/img/vip.png">
    </div>
    <div class="poster-middle">
      <div class="poster-middle-text">
        <div style="text-align: center">
          <span class="text-title">省</span>
        </div>
        <div class="text-msg">开通VIP，所有付费章节半价！！！</div>
      </div>
      <div class="poster-middle-text">
        <div style="text-align: center">
          <span class="text-title">赚</span>
        </div>
        <div class="text-msg">获得专属二维码，好友通过扫码进入哇呜阅读，即成为您的书友，书友所有<span style="color: #feb37c">充值的50%</span>奖励给您，书友的书友所有<span style="color: #feb37c">充值的25%</span>也会奖励给您。</div>
      </div>
    </div>
    <div class="poster-button" v-if="type!='vip'">
      <button @click="rechageUnlock">充值980书币（98元）开通VIP</button>
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
  export default {
    data() {
      return {
        topStatus: '',
        list: {},
        list2: [],
        id: '',
        type: '',
        popupVisible: false,
        popupCenterVisible: false,
        value: '',
        grade: [],
        checkIndex: '',
      };
    },
    methods: {
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
              this.$router.push({
                path: '/posterUser'
              })
            }
          });
      },
      getChange(index){
        this.checkIndex = index;
      },
      chageMoney(){
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
      },
      getMoneyList(){
        let self = this;
        let money=this.grade[self.checkIndex].money
        if(money>0) {
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
            }
          }).catch(error => {
          });
        }
      },
      unlock(){

      },
      rechageUnlock(){
        this.getGrades();
      },
      goToNext(){
        this.section_num = this.section_num + 1;
        console.log(this.page)
        this.getList(this.section_num);
      },
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
    },
    mounted() {
      document.title = '哇呜阅读';
      this.type = this.$route.query.type;
    }
  };
</script>
<style lang="less">
  body {
    background-color: #fff !important;
  }

  .poster {
    width: 100%;
    background-color: white;
    padding-bottom: 35px;
    .poster-header {
      background: url("../../static/img/bg1.png") no-repeat;
      height: 25vh;
      vertical-align: middle;
      color: #fff;
      font-size: 3rem;
      line-height: 24vh;
    }
    .poster-middle {
      margin: -20px 20px 20px 8px;
      .poster-middle-text {
        padding: 10px 10px;
        text-align: left;
        .text-msg {
          font-size: 1.3rem;
          margin-left: 20px;
          margin-top: 10px;
          color: #8b8b8b;
        }
        .cell {
          width: 10px;
          height: 10px;
          background: #f00;
          border-radius: 50%;
          margin-top: 13px;

        }
        .text-title {
          margin-left: 10px;
          font-size: 2.2rem;
          text-align: center
        }
      }
    }
    .poster-button {
      width: 100%;
      button {
        width: 70%;
        background-color: #FF9343;
        color: #fff;
        border: solid #FF9343 1px;
        border-radius: 2px;
        line-height: 2.5;
        font-size: 1.5rem;
      }
    }

    .poster-middle-vip {
      /*margin-top: 10px;*/
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
  }
</style>
