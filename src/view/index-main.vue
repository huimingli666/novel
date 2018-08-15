/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：index-main
* 模块说明：
* 修改历史：
* 2018/7/3 - lihuiming - 创建
*/
<template>
  <div class="index-main">
    <div class="index-main-tabbar">
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="recent">
          最近阅读
        </mt-tab-item>
        <mt-tab-item id="home">
          首页
        </mt-tab-item>
        <mt-tab-item id="my">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
    <div class="index-main-contain">
      <mt-tab-container style="height: auto">
        <user-center v-if="selected=='my'"></user-center>
        <recently-read v-if="selected=='recent'"  @gohome="noread"></recently-read>
        <user-home v-if="selected=='home'"></user-home>
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
  import UserHome from '../view/home.vue'
  import RecentlyRead from './recently-read.vue'
  import UserCenter from '../view/poster-user.vue'
  export default {
    watch: {
      selected: function (val, oldVal) {
        // 这里就可以通过 val 的值变更来确定
        console.log(val)
      }
    },
    data() {
      return {
        list: {},
        selected: 'home',
        he: ''
        // ...
      };
    },
    components: {
      UserHome,
      RecentlyRead,
      UserCenter,
    },
    methods: {
      noread(){
        this.selected ='home'
      }
    },
    mounted() {
      document.title = '哇呜阅读'
      this.he = document.body.scrollHeight;
      if (this.$route.query.type) {
        this.selected = this.$route.query.type;
      }
    }
  };
</script>
<style lang="less">
  .index-main {
    height: 100%;
    .index-main-contain {
      height: 80%;
    }
  }

  .index-main-tabbar {
    .mint-tabbar {
      padding: 10px 0;
      border-top: solid #555 1px;
      z-index: 2000;
      .mint-tab-item-label {
        font-size: 16px;
      }
      .mint-tab-item.is-selected {
        /*background-color: transparent;*/
        background-color: #fafafa;
        color: #FF730B;

      }
    }
    .mint-tab-item-label:focus {
      outline: none;
    }
    .tab-selected {
      color: #FF730B;
    }
    .tab-unselected {
      color: #999;
    }
  }
</style>
