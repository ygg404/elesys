<template>
  <div  class="index_content">
    <div class="site_content">
      <div class="site_header">广东杰信测绘科技有限公司</div>
      <div>
        <template>
          <el-carousel :height="heightStr" :interval="4000" arrow="always">
            <el-carousel-item v-for="item in images" :key="item" >
              <div style="width:100%;height:100%;">
                <img :src="item" width="100%" height="100%"/>
              </div>
            </el-carousel-item>
          </el-carousel>
        </template>
      </div>
      <div class="sys_link">系统链接</div>
      <div class="sys_item">
        <el-card @click.native="gotoUrl('https://www.gdjxch.cn/#/login')" class="item_url">
          <img src="~@/assets/img/project.png" />
          <div class="sys_name_font">项目管理</div>
        </el-card>
        <el-card @click.native="gotoUrl('https://ren.gdjxch.cn/#/login')" class="item_url">
          <img src="~@/assets/img/ren.png" />
          <div class="sys_name_font">人事管理</div>
        </el-card>
      </div>
      <div class="sys_link">关于杰信</div>
      <div style="margin-top:10px;">
        <p>公司于2012年06月21日在汕头市工商行政管理局注册成立 现办公地点位于杰思信息大厦902. 主要经营测绘技术、计算机系统的研究、开发;仪器仪表、测绘产品及软件、计算机软硬件、电子产品、数码产品的研发、销售、维修及维护；货物进出口、技术进出口。
          我们有好的产品和专业的销售和技术团队 始终为客户提供好的产品和技术支持、健全的售后服务</p>
      </div>
      <div class="site-bottom">
        <div>Copyright © 2020 gdjxch.cn All rights reserved.</div>
        <div><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
      </div>
    </div>
    <div class="sys_code">
      <img :src="require('@/assets/img/code.png')" style="width: 200px;height: 198px" />
      <div class="code_title">扫码登录</div>
      <div class="code_title">杰信测绘小程序</div>
    </div>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        heightStr: '350px',
        images: [
          'https://www.gdjxch.cn/uploadFile/ren/img/compic1.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic2.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic3.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic4.jpg'
        ]
      }
    },
    activated () {},
    methods: {
      gotoUrl (url) {
        window.location.href = url
      }
    }
  }
</script>

<style lang="scss">
  .index_content{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgb(27,101,119);
    /*background-color:lightskyblue;*/
  }
  .site_content{
    min-height:100%;
    width: 970px;
    margin:0 auto;
    background-color: #f6f9f4;
  }
  .site_content .site_header{
    color: white;
    background-color: #3b97d7;
    text-align: center;
    font-size: 25pt;
    font-weight: 700;
    padding: 10px;
  }
  .tac{
    text-align:center;
  }
  .sys_link{
    color: #3b97d7;
    margin: 7px;
    font-weight:600;
    font-size:25px;
    padding-bottom:5px;
    margin-top:20px;
    border-bottom:2px solid #3b97d7;
  }
  .sys_name_font{
    font-weight:600;font-size:20px;
  }
  p{
    font-size:18px;
    text-indent:2em;
    letter-spacing:1px;
  }
  .gw-bottom{
    margin-top:20px;
  }
  .site-bottom{
    margin-top: 100px;
    text-align: center;
    color: #827b7b;
    font-size: 11pt;
    font-weight: 500;
    width: 100%;
    position: relative;
    bottom: 0px;
  }
  .site-bottom a{
    color: #827b7b;
  }
  .sys_item {
    display: flex;
    justify-content: space-around;
    margin-top:10px;
  }
  .sys_item .item_url{
    cursor: pointer;
    width: 300px;
    text-align: center;
    color: #3b97d7;
  }
  .sys_item .item_url img{
    width: 170px;
    height: 170px;
  }
  .sys_item .item_url :hover{
    color: whitesmoke;
    background-color: #3b97d7;
  }
  .sys_code {
    position:fixed;
    border:solid 1px #3b97d7;
    box-shadow: 3px 3px 3px 3px #137cb35f;
    -webkit-box-shadow: 3px 3px 3px 3px #137cb35f;
    bottom:50px;
    right:20px;
    animation: floatMove 12s infinite;
  }
  .sys_code .code_title{
    color: #3b97d7;
    font-size: 12pt;
    background-color: white;
    text-align: center;
    font-weight: 500;
  }
  @keyframes floatMove {
    0% {
      bottom: 50px;
      right: 45px;
    }
    15% {
      bottom: 90px;
      right: 30px;
    }
    30% {
      bottom: 60px;
      right: 20px;
    }
    50% {
      bottom: 85px;
      right: 33px;
    }
    70% {
      bottom: 60px;
      right: 45px;
    }
    88% {
      bottom: 80px;
      right: 50px;
    }
    100% {
      bottom: 50px;
      right: 45px;
    }
  }
</style>
