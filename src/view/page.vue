<template>
  <div >
    <h1 class="animated flipInX">微信扫码关注公众号</h1>
    <div class="poster-middle-vip">
      <img src="../../static/img/qrcode.jpg">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'notfound',
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped lang="less" type="text/less">
  h1 {
    text-align: center;
    font-size:4em;
    font-family: fantasy;
    color: #475669;
    letter-spacing: 5px;
  }

  .back {
    padding-right: 3em;
    text-align: right;
    i {
      font-size: 2em;
      color: #475669;
      &:hover {
        cursor: pointer;
        color: #324057;
      }
    }
  }
  .poster-middle-vip {
    margin-top: 10px;
    img {
      width: 50%;
      height: 50%;
    }
  }
</style>
