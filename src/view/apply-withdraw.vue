/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：apply-withdraw
* 模块说明：
* 修改历史：
* 2018/6/7 - lihuiming - 创建
*/
<template>
  <div class="apply-withdraw">
    <div class="withdraw-count">
      <div class="withdraw-count-left">提现至微信零钱</div>
    </div>
    <div class="withdraw-count">
      <div class="withdraw-count-second" style="margin-top: 10px">提现金额</div>
    </div>
    <div class="apply-withdraw-input-main">
      <div style="width: 10%;font-size: 26px;font-weight: bold">￥</div>
      <div style="width: 90%"><input class="apply-withdraw-input" placeholder="输入提现金额" v-model="money"
                                     @change="moneyChange()" type="number"/></div>
    </div>
    <div style="text-align: left;color: #9a9a9a;margin-top: 10px;font-size: 14px;margin-left: 15px">可提现金额 {{balance}}元
    </div>
    <div style="margin-top: 5vh;">
      <button @click="goWithdraw()">提现</button>
    </div>
    <div class="apply-withdraw-foot" @click="goToWithdrawlist()">提现记录</div>
  </div>
</template>
<script>
  export default {
    watch: {
      money: function (val, oldVal) {
        // 这里就可以通过 val 的值变更来确定
        let reg = new RegExp("(^[0-9]+(.[0-9]{2})?$)");
        if (reg.test(val)) {
          if (val > this.balance) {
            this.money = this.balance
          }
        } else {
          let a = Math.floor(val * 100) / 100
          if (a > this.balance) {
            this.money = this.balance
          } else {
            this.money = a;
          }
        }
      }
    },
    data() {
      return {
        list: {},
        money: '',
        balance: 0
      };
    },
    methods: {
      goWithdraw(){
        let self = this;
        this.$axios({
          url: `/user/withdraw?money=${self.money}`,
          method: "GET",
//          data: {params}
        }).then(res => {
          console.log(res.data)
          const {code, msg} = res.data;
          console.log(code)
          if (code == '0') {
            this.$toast(msg);
            this.$router.push({
              path: '/posterUser'
            })
          } else {
            this.$toast('提现失败');
          }
        }).catch(error => {
        });
      },
      moneyChange(val){
        console.log(val)
      },
      goToWithdrawlist(){
        this.$router.push({
          path: '/withdrawList'
        })
      },
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
            self.balance = self.list.balance;
          }
        }).catch(error => {
        });
      },
    },
    mounted() {
      document.title = '哇呜阅读'
      this.getList();
    }
  };
</script>
<style lang="less" type="text/less">
  .apply-withdraw {
    width: 100%;
    /*margin-left: 10%;*/
    padding: 20px 0;
    background-color: #fff;
    .withdraw-count {
      display: flex;
      flex-direction: row;
      color: #555;
      padding-left: 15px;
      .withdraw-count-left {
        width: 50%;
        text-align: left;
        font-size: 20px;
        font-weight: bold;
      }
      .withdraw-count-right {
        width: 50%;
        text-align: right;
      }
      .withdraw-count-second {
        font-size: 16px;
      }
    }
    button {
      font-size: 16px;
      color: #fff;
      background-color: #FF9343;
      border: solid #FF9343 1px;
      height: 50px;
      width: 90%;
      border-radius: 5px;
    }
    .apply-withdraw-input {
      width: 95%;
      border: none;
      border-radius: 5px;
      height: 35px;
      /*padding-right: 10px;*/
    }

    .apply-withdraw-input:focus {
      outline: none;
    }
    .apply-withdraw-foot {
      /*background: #fff;*/
      bottom: 70px;
      position: absolute;
      width: 100%;

    }

    .apply-withdraw-input-main {
      margin-top: 5vh;
      display: flex;
      flex-direction: row;
      border-bottom: solid #999 1px;
      margin-left: 15px;
      margin-right: 15px;
      text-align: left;
    }
  }
</style>

