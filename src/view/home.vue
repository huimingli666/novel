/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：home
* 模块说明：
* 修改历史：
* 2018/7/3 - lihuiming - 创建
*/
<template>
  <div class="home-shouye">
    <div class="navClass">
      <mt-navbar class="page-part" v-model="selected" fixed
                 style="border-bottom: solid #ddd 1px;font-size: 16px">
        <mt-tab-item id="tab-container2">
          <div @click="changeType('img')" style="font-size: 16px">漫画岛</div>
        </mt-tab-item>
        <mt-tab-item id="tab-container3">
          <div @click="changeType('novel')" style="font-size: 16px">小说城</div>
        </mt-tab-item>
      </mt-navbar>
    </div>
    <!--<div class="home-containt" :style="{'height': he}">-->
    <div class="home-containt">
      <!--<mt-loadmore :bottom-method="loadBottomUse"-->
      <!--:bottom-all-loaded="allLoaded" :bottomPullText='bottomText'-->
      <!--ref="loadmore" :autoFill="false">-->
      <div v-for="(item,index) in list" style="display: flex;flex-direction: row;margin-top: 12px">
        <div v-for="(childitem,index) in item.child_list" :key="index" style="width: 30%;padding:0 10px"
             @click="geToDetail(childitem.works_id,type)">
          <div class="containt-item-img"><img :src="'http://wow.drmfslx.top/'+childitem.img_url"></div>
          <!--<div class="containt-item-img"><img :src="childitem.info_url"></div>-->
          <div style="font-size: 13px;margin-top:8px">{{childitem.works_name}}</div>
        </div>
      </div>
      <!--</mt-loadmore>-->
    </div>
    <div class="loadding" v-if="hasMore=='0'" @click="loadBottomUse">点击查看更多</div>
    <div class="loadding" v-if="hasMore=='1'">没有更多啦</div>
    <div style="height: 25px"></div>
  </div>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
//  import store from '../../store'
  export default {
    data() {
      return {
        topStatus: '',
        list: [],
        selected: "tab-container2",
        value: '',
        navClass: 'ticket-list-nav-re',
        allLoaded: false,
        bottomText: '上拉加载更多...',
        page: 1,
        type: 0,
        scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动,
        he: '',
        hasMore: '2'
        // ...
      };
    },
    computed: {
      ...mapGetters([
        'user',
        'org',
        'menuDataCurrent'
      ]),
    },
    methods: {
      changeType(type){
        if (type == 'img') {
          this.type = 0;
        } else {
          this.type = 1;
        }
        this.list = []
        this.hasMore = '2'
        this.allLoaded = false;
        this.page = 1;
        this.getList('new')
      },
      loadBottomUse() {
        let self = this;
        this.page += 1;
        /*if (this.pageNo == this.totalGetCount) {
         this.allLoaded = true;
         }*/
        self.getList('scroll');
      },
      handleTopChange(status) {
        this.topStatus = status;
      },
      getList(type){
        let self = this;
        let list = JSON.parse(JSON.stringify(self.list));
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        });
        this.$axios({
          url: `/home?type=${this.type}&page=${this.page}`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data} = res.data;
          if (data.works_list) {
            let len = data.works_list.length;
            if (len <= 0) {
              this.allLoaded = true;
              this.hasMore = '1';
            } else {
              this.hasMore = '0';
            }
            if (type == 'new') {
              this.list = data.works_list;
            } else {
              list = list.concat(data.works_list);
              this.list = list;
              this.$refs.loadmore.onBottomLoaded();
            }
          }
          this.$indicator.close();
        }).catch(error => {
          this.$indicator.close();
        });
      },
      geToDetail(id, type){
        this.$router.push({
          path: '/novelList',
          query: {
            id: id,
            type: type
          }
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      this.getList('new')
      this.he = document.body.scrollHeight;
      document.addEventListener('WeixinJSBridgeReady', function onBridgeReady () {
        WeixinJSBridge.call('hideToolbar');
      });
    }
  };
</script>
<style lang="less" type="text/less">
  .home-shouye {
    width: 100%;
    .mint-navbar .mint-tab-item.is-selected {
      border-bottom: 3px solid #ff730b;
      color: #ff730b;
    }

    .home-containt {
      width: 100%;
      margin-top: 56px;
      /*height: 100%;*/
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      margin-bottom: 40px;

      /*flex-warp: wrap;*/
      .containt-item {
        width: 30%;
        padding-top: 10px;
      }
      .containt-item-img {
        img {
          width: 100%;
          height: 150px;
          border-radius: 5px;
          /*box-shadow: 5px 5px 5px #d4d4d4;*/
        }
      }
    }
    .content {
      width: 33%;
    }
    .loadding {
      font-size: 13px;
      text-align: center;
      height: 56px;
      /*line-height: 60px;*/
      color: #4A9BFF;
      /*background-color: rgba(255, 255, 255, 1);*/
      margin-bottom: 15px;
    }
    .loadding:focus {
      outline: none;
      background-color: #FFF;
    }
  }
</style>
