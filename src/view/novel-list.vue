/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：recently-read
* 模块说明：
* 修改历史：
* 2018/7/3 - lihuiming - 创建
*/
<template>
  <div class="novel-list">
    <div class="read-item">
      <div class="read-item-left"><img :src="'http://wow.drmfslx.top/'+list.img_url"></div>
      <div style="width:65%;height: 100%">
        <div class="item-center-first">{{list.works_name}}</div>
        <div style="display: flex;flex-direction: row;height: 40% ">
          <div class="read-item-center">
            <div class="item-center-second">
              <span v-if="list.works_type=='1'">小说</span>
              <span v-if="list.works_type=='0'">漫画</span>
            </div>
            <div class="item-center-third">作者：{{list.author}}</div>
          </div>
        </div>
        <div class="item-center-four">最新章节 第{{list.collect_count}}章 </div>
      </div>
    </div>
    <div class="read-chapter">
      <div class="chapter-first">
        <div class="chapter-first-left">目录</div>
        <!--<div class="chapter-first-right">
          <span>正序</span>
          <span>倒序</span>
        </div>-->
      </div>
      <div style="overflow: scroll">
        <!--<mt-loadmore :bottom-method="loadBottomUse"
                     :bottom-all-loaded="allLoaded" :bottomPullText='bottomText'
                     ref="loadmore" :autoFill="false">-->
        <div class="chapter-item" v-for="(item,index) in list2" @click="geToDetail(id,item.section_num)">
          <!--<div class="chapter-item-left">第{{index + 1}}章 {{item.title_name}}</div>-->
          <div class="chapter-item-left">{{item.title_name}}</div>
          <div class="chapter-item-right">
            <div v-if="item.is_unlock=='-1'" style="color: #9eee77">免费</div>
            <div v-if="item.is_unlock=='1'" style="color: #9eee77">已解锁</div>
            <div v-if="item.is_unlock=='0'" style="color: #ffac84">{{item.price}}书币</div>
          </div>
        </div>
        <div class="loadding" v-if="hasMore=='0'" @click="loadBottomUse">点击查看更多</div>
        <div class="loadding" v-if="hasMore=='1'">没有更多啦</div>
        <!--</mt-loadmore>-->
      </div>
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
        list3: {},
        id: '',
        type: '',
        allLoaded: false,
        bottomText: '上拉加载更多...',
        page: 1,
        hasMore: '2'
      };
    },
    methods: {
      loadBottomUse() {
        let self = this;
        this.page += 1;
        self.getCapList('scroll');
      },
      changeType(type){
        if (type == 'img') {
          this.type = 0;
        } else {
          this.type = 1;
        }
        this.page = 1;
        this.getList('new')
      },
      /*  loadBottomUse() {
       let self = this;
       this.page += 1;
       /!*if (this.pageNo == this.totalGetCount) {
       this.allLoaded = true;
       }*!/
       self.getList('scroll');
       },*/
      handleTopChange(status) {
        this.topStatus = status;
      },
      getList(){
        let self = this;
        this.$axios({
          url: `/home?works_id=${this.id}&type=${this.type}`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data} = res.data;
          if (data.works_list) {
            let len = data.works_list.length;
            this.list = data.works_list[0].child_list[0];
          }
        }).catch(error => {
        });
      },
      getCapList(type){
        let self = this;
        let list = JSON.parse(JSON.stringify(self.list2));
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        });
        this.$axios({
          url: `/home/lists?works_id=${this.id}&page=${this.page}`,
          method: "GET",
        }).then(res => {
          console.log(res)
          const {data, code} = res.data;
          if (code == '0') {
            let len = data.works_list.length;
            if (len <= 0) {
              this.hasMore = '1';
            } else {
              this.hasMore = '0';
            }
            if (type == 'new') {
              this.list3 = data.works_info;
              this.list2 = data.works_list;
            } else {
              list = list.concat(data.works_list);
              this.list2 = list;
              this.$refs.loadmore.onBottomLoaded();
            }
          }
          this.$indicator.close();
        }).catch(error => {
          this.$indicator.close();
        });
      },
      geToDetail(id, section_num){
        let self = this;
        this.$router.push({
          path: '/readContain',
          query: {
            id: id,
            num: section_num,
            type: self.type
          }
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
//      this.id = 16;
      this.getList()
      this.getCapList('new')
    }
  };
</script>
<style lang="less">
  body {
    background-color: #f2f2f2;
  }

  .novel-list {
    width: 100%;
    .read-item {
      display: flex;
      flex-direction: row;
      text-align: left;
      height: 160px;
      margin: 15px 10px;
      .read-item-left {
        width: 35%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          /*box-shadow: 5px 5px 5px #d4d4d4;*/
        }
      }

      .read-item-center {
        width: 65%;
        margin-left: 7px;
        /*padding-top: 10pt;*/
        /*.item-center-first {
          height: 4vh;
          font-size: 17pt;
          color: #545454;
          font-weight: bold;
          margin-top: 5px;
        }*/

        .item-center-second {
          margin-top: 5px;
          /*height: 6vh;*/
          span {
            color: #22ac38;
            border: solid #22ac38 1px;
            border-radius: 5px;
            padding: 3px 12px;
            font-size: 11pt;
          }
        }

        .item-center-third {
          /*height: 5vh;*/
          color: #555;
          font-size: 13px;
          margin-top: 15px;
        }
      }
      .item-center-first {
        height: 30%;
        font-size: 17pt;
        color: #545454;
        font-weight: bold;
        margin-top: 5px;
        margin-left: 7px;
      }
      .item-center-four {
        color: #bbb;
        font-size: 14px;
        margin-left: 7px;
        height: 25%;
        padding-top: 15px;
        /*margin-top: 20px;*/
        /*height: 6vh;*/
      }
      .read-item-right {
        width: 35%;
        /*padding-top: 60px;*/
        padding-top: 25px;
        color: #4A9BFF;
        font-size: 12pt;
      }
    }

    .chapter-first {
      display: flex;
      flex-direction: row;
      font-size: 15px;
      .chapter-first-left {
        width: 50%;
        text-align: left;
        padding-left: 10px;
      }

      .chapter-first-right {
        width: 50%;
        text-align: right;
        padding-right: 10px;
      }
    }
    .chapter-item {
      display: flex;
      flex-direction: row;
      margin-top: 5px;
      padding: 5px 0;
      font-size: 15px;
      .chapter-item-left {
        width: 70%;
        text-align: left;
        padding-left: 10px;
        font-size: 16px;
      }
      .chapter-item-right {
        width: 30%;
        text-align: right;
        padding-right: 10px;
      }
    }
    .loadding {
      font-size: 13px;
      text-align: center;
      height: 25px;
      /*line-height: 60px;*/
      color: #4A9BFF;
      /*background-color: rgba(255, 255, 255, 1);*/
      margin-bottom: 15px;
      margin-top: 15px;
    }
    .loadding:focus {
      outline: none;
      background-color: #FFF;
    }
  }
</style>

