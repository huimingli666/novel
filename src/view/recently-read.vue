/**
* 版权所有(C)，上海海鼎信息工程股份有限公司，1995-2017，所有权利保留。
* 项目名：my-project
* 文件名：recently-read
* 模块说明：
* 修改历史：
* 2018/7/3 - lihuiming - 创建
*/
<template>
  <div class="recently-read">
    <div v-if="recently_reads.length>0">
      <div class="read-item" v-for="(item,index) in recently_reads" :key="index">
        <div class="read-item-left"><img :src="item.img_url"></div>
        <div style="width:65%;height: 100%">
          <div class="item-center-first">{{item.works_name}}</div>
          <div style="display: flex;flex-direction: row;height: 40% ">
            <div class="read-item-center">
              <div class="item-center-second"><span>{{item.works_type == '0' ? '漫画' : '小说'}}</span></div>
              <div class="item-center-third">阅读至{{item.section_num}}章</div>
            </div>
            <div class="read-item-right" @click="goTocontinue(item.section_num,item.works_id,item.works_type)">继续阅读</div>
          </div>
          <!--<div class="item-center-four">最新章节 第1879章 </div>-->
        </div>
      </div>
    </div>
    <div v-else>
      <div style="margin-top: 40%;color: #555;font-size: 16px">暂无阅读记录</div>
      <div style="margin-top: 10px;color: #4095FF;font-size: 16px" ><span @click="goTODetail()">点击查看精彩内容</span></div>
    </div>
    <div style="height: 65px"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        recently_reads: [],
        qrcode: ''
      };
    },
    methods: {
//      获取用户预期收益
      getList(){
        let self = this;
        this.$indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        });
        this.$axios({
          url: `/home/recently_read`,
          method: "GET"
        }).then(res => {
          const {code, msg} = res.data;
          console.log(code)
          if (code == '0') {
            self.recently_reads = msg.recently_reads;
          }
          this.$indicator.close();
        }).catch(error => {
          this.$indicator.close();
        });
      },
      goTODetail(){
        this.$emit('gohome');
        this.$router.push({
          path: '/indexMain',
          query: {
            type: 'home',
          }
        })
      },
      goToHome(){
        console.log('ksjdksjdk')
        this.$router.push({
          path: '/indexMain',
          query: {
            type: 'home',
          }
        })
      },
      withDraw(){
        this.$router.push({
          path: '/applyWithdraw'
        })
      },
      goTocontinue(num, id,type){
        this.$router.push({
          path: '/readContain',
          query: {
            num: num,
            id: id,
            type: type
          }
        })
      }
    },
    mounted() {
      document.title = '哇呜阅读';
      this.getList();
    }
  };
</script>
<style lang="less">
  .recently-read {
    width: 100%;
    .read-item {
      display: flex;
      flex-direction: row;
      text-align: left;
      height: 160px;
      margin: 15pt 7pt 0 7pt;
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
          font-size: 13pt;
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
        font-size: 11pt;
        margin-left: 7px;
        height: 25%;
        padding-top: 10px;
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
  }
</style>
