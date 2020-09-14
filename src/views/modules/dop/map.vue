<template>
  <div>
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input id="searchId" v-model="dataForm.key" placeholder="地址关键字搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPlaceHandle()" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="detail_card" :class="menuVisible? 'open_setting':'close_setting'">
        <el-button class="btn" type="primary" size="mini" @click="menuVisible = !menuVisible">
          <i class="btn_rotate el-icon-s-tools"></i>
        </el-button>
        <el-collapse v-model="activeNames" @change="handleChange" style="opacity: 0.7" v-if="menuVisible">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="title_span">工具栏</span>
            </template>
            <el-row style="padding: 10px;">
              <el-button type="danger">标注点</el-button>
            </el-row>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <span class="title_span">标注基本信息</span>
            </template>
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <span class="title_span">查找标注信息</span>
            </template>
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <baidu-map :center="center" :zoom="zoom" @ready="initBmap" :style="'height:' + (documentClientHeight - 200) + 'px'"
                 @click="getClickInfo" :scroll-wheel-zoom='true'>
      </baidu-map>
    </div>
  </div>
</template>

<script>
  import BaiduMap from 'vue-baidu-map'
  import Vue from 'vue'

  Vue.use(BaiduMap, {
    ak: 'i4pCU0hVhxbLTnWjTW31iuEkKtUrwBOR'
  })
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        loading: true,
        zoom: 14,
        BMap: '',
        map: '',
        activeNames: [],
        menuVisible: false
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      },
    },
    methods: {
      // 百度地图初始化
      initBmap ({BMap, map}) {
        let that = this
        this.loading = true
        this.BMap = BMap
        this.map = map
        // 建立一个自动完成的对象
        var ac = new BMap.Autocomplete({'input': 'searchId', 'location': map})
        ac.addEventListener('onconfirm', function (e) {
          var _value = e.item.value
          that.dataForm.key = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          that.searchPlaceHandle()
        })

        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (res) {
          that.loading = false
          if (this.getStatus() === BMAP_STATUS_SUCCESS) {
            var marker = new BMap.Marker(res.point)
            map.addOverlay(marker)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
            map.panTo(res.point)
            map.setMapType(BMAP_HYBRID_MAP)
          } else {
            that.$message.error('获取地理位置失败！')
          }
        },{enableHighAccuracy: true})
      },
      getClickInfo () {

      },
      // 地址搜索
      searchPlaceHandle () {
        let that = this
        this.map.clearOverlays()    // 清除地图上所有覆盖物
        var local = new this.BMap.LocalSearch(this.map, { // 智能搜索
          onSearchComplete: function (e) {
            let searchPoint = local.getResults().getPoi(0).point
            that.map.centerAndZoom(searchPoint, 16)
            that.map.addOverlay(new that.BMap.Marker(searchPoint))    // 添加标注
          }
        })
        local.search(this.dataForm.key)
      }
    }
  }
</script>

<style scoped>
  .detail_card {
    position: absolute;
    right: 21px;
    background: #2BCBBBaf;
    color: white;
    z-index: 1000;
  }
  .open_setting {
    width: 350px;
    -webkit-transition: width .3s;
    transition: width .3s;
  }
  .close_setting {
    width: 1px;
    -webkit-transition: width .3s;
    transition: width .3s;
  }
  .detail_card .title_span {
    margin-left: 20px;
    color: #0000cc;
    font-size: 12pt;
    font-weight: 700;
    font-family: "BankGothic Lt BT";
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .detail_card .btn {
    position: absolute;
    left: -47px;
    top:50px;
    z-index: 100;
    font-size: 12pt;
    opacity: 0.9;
  }
  @-webkit-keyframes rotate{
    from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
  }
  @-moz-keyframes rotate{
    from{-moz-transform: rotate(0deg)}
    to{-moz-transform: rotate(360deg)}
  }
  @-o-keyframes rotate{
    from{-o-transform: rotate(0deg)}
    to{-o-transform: rotate(360deg)}
  }
  @keyframes rotate{
    from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
  }
  .btn_rotate{
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 2s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 2s;
    -webkit-animation: rotate 2s linear infinite;
    -moz-animation: rotate 2s linear infinite;
    -o-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
  }
</style>
