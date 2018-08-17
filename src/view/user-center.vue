/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：user-center
* 模块说明：
* 修改历史：
* 2018/6/7 - lihuiming - 创建
*/
<template>
  <div class="user-center">
    <div class="center-header">
      <div class="header-left">
        <div>可提现金额</div>
        <div style="margin-top: 8px"><span style="font-weight: bold;font-size: 20px">{{list.balance}}</span>元</div>
      </div>
      <div class="header-right">
        <button @click="withDraw" v-if="list.balance>0">提现</button>
      </div>
    </div>
    <div>
      <div class="center-second">
        <div class="second-left">
          <div style="color: #797979">今日收益（元）</div>
          <div style="margin-top: 3vh">￥<span style="font-size: 24px;font-weight: bold;">{{list.today_income}}</span>
          </div>
        </div>
        <div class="second-center">
          <div style="color: #797979">昨日收益（元）</div>
          <div style="margin-top: 3vh">￥<span style="font-size: 24px;font-weight: bold">{{list.last_day_income}}</span>
          </div>
        </div>
        <div class="second-right">
          <div style="color: #797979">累计收益（元）</div>
          <div style="margin-top: 3vh">￥<span style="font-size: 24px;font-weight: bold">{{list.total_income}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="center-text">
      <div style="color: #999;margin-bottom: 10px">已招募{{list.pu_count}}位书友，{{list.small_pu_count}}位小书友</div>
      <div style="color: #555;font-size: 15px;margin-bottom: 10px">长按下方图片转发给好友即可招募书友</div>
      <div v-if="qrcode!=''" class="center-text-img"><img :src="qrcode"></div>
      <div style="color: #4A9BFF;margin-top: 5px" @click="goToVip">vip介绍</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: {},
        qrcode: ''
      };
    },
    methods: {
//      获取用户预期收益
      getList(){
        let self = this;
        this.$axios({
          url: `/vip/info`,
          method: "GET"
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data;
          console.log(code)
          if (code == '0') {
            self.list = data;
          }
        }).catch(error => {
        });
      },
      getshareList(){
        let params = {
          uid: 6
        };
        let self = this;
        this.$axios({
          url: `/promotion/share`,
          method: "GET"
        }).then(res => {
          console.log(res.data)
          const {code, data} = res.data;
          console.log(code)
          if (code == '0') {
            self.qrcode = data.qrcode;
          }
        }).catch(error => {
        });
      },
      goTODetail(){
        this.$router.push({
          path: '/orderDetail'
        })
      },
      withDraw(){
        this.$router.push({
          path: '/applyWithdraw'
        })
      },
      goToVip(){
        this.$router.push({
          path: '/poster',
          query: {
            type: 'vip'
          }
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      this.getList();
      this.getshareList();
    }
  };
</script>
<style lang="less" type="text/less">
  .user-center {
    background-color: #f6f6f6;
    height: 100%;
    .center-header {
      display: flex;
      flex-direction: row;
      background: -webkit-linear-gradient(right, #f94b30, #ffa124); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #f94b30, #ffa124); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #f94b30, #ffa124); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right, #f94b30, #ffa124); /* 标准的语法（必须放在最后） */
      /*height: 18vh;*/
      height: 20%;
      .header-left {
        width: 50%;
        text-align: left;
        padding-top: 8%;
        padding-left: 20px;
        color: white;
        font-size: 16px
      }
      .header-right {
        width: 50%;
        text-align: right;
        padding-top: 12%;
        padding-right: 20px;
        button {
          border-radius: 20px;
          color: #fff;
          background: none;
          border: solid #fff 1px;
          font-size: 16px;
          padding: 5px 25px;
          outline: none;
        }
      }
    }
    .center-second {
      display: flex;
      flex-direction: row;
      background-color: #fff;
      height: 17vh;
      font-size: 2vh;
      .second-left {
        width: 33.33%;
        text-align: left;
        padding-left: 20px;
        padding-top: 4vh;
      }
      .second-right {
        width: 33.33%;
        text-align: left;
        padding-left: 20px;
        padding-top: 4vh;
      }
      .second-center {
        width: 33.33%;
        text-align: left;
        padding-left: 20px;
        padding-top: 4vh;
      }
    }
    .center-text {
      padding: 10px 0;
      font-size: 14px;
    }
    .center-list {
      background-color: white;
      .list-head {
        border-bottom: solid #cbcacf 1px;
        height: 8vh;
        display: flex;
        flex-direction: row;
        .list-head-left {
          width: 10%;
          padding: 15px 0;
          text-align: left;
          padding-left: 20px;
          img {
            width: 25px;
            height: 25px;
          }
        }
        .list-head-center {
          width: 85%;
          padding: 15px 0;
          text-align: left;
          font-size: 18px;
        }
        .list-head-right {
          width: 5%;
          text-align: right;
          padding-right: 20px;
          padding-top: 15px;
          font-size: 18px;
          color: orange;
        }
      }
      .list-second {
        display: flex;
        flex-direction: row;
        height: 25vh;
        padding-top: 5vh;
        font-size: 16px;
        .second-left {
          width: 50%;
          text-align: center;
        }
        .second-right {
          width: 50%;
          text-align: center;
        }
      }
    }

    .center-text-img {
      img {
        width: 55%;
      }
    }
  }
</style>
