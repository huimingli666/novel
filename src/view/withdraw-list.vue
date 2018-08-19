/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：apply-withdraw
* 模块说明：
* 修改历史：
* 2018/6/7 - lihuiming - 创建
*/
<template>
  <div class="withdraw-list" >
    <div v-if="list.length>0">
      <div class="list-item" v-for="(item,index) in list" :key="index">
        <div class="list-item-left">
          <div style="color: #000;font-weight: bold">提现{{item.money}}</div>
          <div style="margin-top: 5px">{{item.created_at}}</div>
        </div>
        <div class="list-item-right">
          {{item.status}}
        </div>
      </div>
    </div>
    <div v-else>
      <div style="margin-top: 40%;color: #555;font-size: 16px">暂无提现记录</div>
      <div style="margin-top: 10px;color: #4095FF;font-size: 16px" ><span @click="goTODetail()">点击查看收益</span></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: {}
      };
    },
    methods: {
//      获取用户预期收益
      getList(){
        let self = this;
        this.$axios({
          url: `/withdraw/log`,
          method: "GET",
        }).then(res => {
          const {code, data} = res.data;
          if (code == '0') {
            self.list = data.logs;
          }
        }).catch(error => {
        });
      },
      goTODetail(){
        this.$router.push({
          path: '/userCenter'
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      this.getList()
    }
  };
</script>
<style lang="less" type="text/less">
  .withdraw-list {
    .list-item {
      display: flex;
      flex-direction: row;
      margin: 0 10px;
      padding: 10px 0;
      border-bottom: solid #e8e8e8 1px;
      font-size: 15px;
      color: #98999a;
      .list-item-left {
        width: 60%;
        text-align: left;
      }
      .list-item-right {
        width: 40%;
        text-align: right;
        margin-top: 8px;
      }
    }
  }
</style>
