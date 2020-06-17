<template>
  <div style="weight:100%;height:100%;background-color:#f6f6f6;">
    <div  class="index_content">
      <div style="height:100%;width: 1200px;margin:0 auto;background-color:white;">
        <div style="padding-top:30px;">
          <template>
            <el-carousel :height="heightStr" :interval="4000" arrow="always">
              <el-carousel-item v-for="item in images" :key="item">
                <div style="width:100%;height:100%;">
                  <img :src="item" width="100%" height="100%"/>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
        </div>
        <div class="sys_link">
          系统链接
        </div>
        <el-row style="margin-top:10px;">
          <el-col :span="12" class="tac">
            <div @click="gotoUrl('https://m.gdjxch.cn/#/login')">
              <img src="~@/assets/img/project.png" style="width:200px;height:200px;"/>
              <div class="sys_name_font">项目管理</div>
            </div>
          </el-col>
          <el-col :span="12" class="tac">
            <div @click="gotoUrl('https://mren.gdjxch.cn/#/login')">
              <img src="~@/assets/img/ren.png" style="width:200px;height:200px;"/>
              <div class="sys_name_font">人事管理</div>
            </div>
          </el-col>
        </el-row>

        <div class="sys_link">
          关于杰信
        </div>
        <div style="margin-top:10px;">
          <p>公司于2012年06月21日在汕头市工商行政管理局注册成立 现办公地点位于杰思信息大厦902. 主要经营测绘技术、计算机系统的研究、开发;仪器仪表、测绘产品及软件、计算机软硬件、电子产品、数码产品的研发、销售、维修及维护；货物进出口、技术进出口。
            我们有好的产品和专业的销售和技术团队 始终为客户提供好的产品和技术支持、健全的售后服务</p>
        </div>
        <div class="site-bottom">
          <div>Copyright © 2020 gdjxch.cn All rights reserved.</div>
          <div><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
        </div>

      </div>

      <!----->
      <div style="position:absolute;height:200px;width:200px;border:solid 1px blue;top:500px;left:1600px;">
        二维码
      </div>
      <!---->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        heightStr: '300px',
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
    background-color: transparent;
    /*background-color:lightskyblue;*/
  }
  .tac{
    text-align:center;
  }
  .sys_link{
    font-weight:600;font-size:25px;padding-bottom:5px;margin-top:20px;border-bottom:1px solid #b5c4e8;
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
    padding-top:90px;
    text-align: center;
    color: #827b7b;
    font-size: 11pt;
    font-weight: 500;
    width: 100%;
    top: 800px;
  }
  .site-bottom a{
    color: #827b7b;
  }
</style>
