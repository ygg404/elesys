<template>
  <div>
    <div class="ef_line">
      <div style="display:flex;">
        <el-button @click="addProjectHandle(null,0)" icon="el-icon-plus" type="success">新建图层</el-button>
        <el-upload :action="upKmlUrl" style="margin-left: 10px;"
                   :limit="1"
                   name="file"
                   ref="upload"
                   accept=".kml"
                   :data="{'parentId': dataForm.parentId}"
                   :headers="tokenHeaders"
                   :before-upload="handleBeforeUpload"
                   :on-success="importKMLHandle"
                   :on-error="handleError">
          <el-button type="success" icon="el-icon-printer">导入KML</el-button>
        </el-upload>
      </div>
      <div>
        <el-input id="searchId" v-model="dataForm.key" placeholder="地址关键字搜索" prefix-icon="el-icon-map-location" clearable
                  style="width: 250px;" @input="menuVisible = false"></el-input>
        <el-button @click="searchPlaceHandle()" icon="el-icon-search" type="primary">搜索</el-button>
      </div>
    </div>
    <div>
      <div class="detail_card" :class="menuVisible? 'open_setting':'close_setting'">
        <el-button class="btn" type="primary" size="mini" @click="menuVisible = !menuVisible">
          <i class="btn_rotate el-icon-s-tools"></i>
        </el-button>
        <el-collapse v-model="activeNames" v-if="menuVisible" class="collapse_item">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="title_span">工具栏</span>
            </template>
            <el-row style="padding: 10px;">
              <el-button type="danger" icon="el-icon-location" @click="drawPoint()">点</el-button>
              <el-button type="danger" icon="el-icon-s-marketing" @click="drawPolyline()">线</el-button>
              <el-button type="danger" icon="el-icon-picture" @click="drawPolygon()">面</el-button>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <span class="title_span">标注基本信息</span>
            </template>
            <div style="padding: 5px;">
              <el-row><el-col :span="8">标题：</el-col><el-col :span="16" style="color: blue">{{selectNode.label}}</el-col></el-row>
              <el-row><el-col :span="8">绘制类型：</el-col>
                <el-col :span="16" v-if="selectNode.type == 1" style="color: blue">点</el-col>
                <el-col :span="16" v-if="selectNode.type == 2" style="color: blue">线</el-col>
                <el-col :span="16" v-if="selectNode.type == 3" style="color: blue">面</el-col>
              </el-row>
              <el-row><el-col :span="8">备注：</el-col><el-col :span="16" style="color: blue">{{selectNode.remark}}</el-col></el-row>
              <el-row><el-col :span="8">中心坐标：</el-col><el-col :span="16" style="color: blue" v-if="!stringIsNull(selectNode.lng)">
                {{selectNode.lng + ' ,  ' + selectNode.lat }}</el-col>
              </el-row>
              <el-row><el-col :span="8">创建用户：</el-col><el-col :span="16" style="color: blue">{{selectNode.createUserName}}</el-col></el-row>
              <el-row><el-col :span="8">创建时间：</el-col><el-col :span="16" style="color: blue">{{selectNode.createTime}}</el-col></el-row>

            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <span class="title_span">查找标注信息</span>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="map">
        <el-card class="map_project" :body-style="{ padding: '2px' }">
          <el-form :inline="true" :model="dataForm">
            <el-form-item>
              <el-input v-model="dataForm.labelName" placeholder="关键字搜索" clearable style="width: 145px;" @clear="pageIndex=1,getDataList()"></el-input>
              <el-button @click="pageIndex = 1,getDataList()" icon="el-icon-search" type="primary" size="small"></el-button>
            </el-form-item>
          </el-form>
          <div class="ul_line" ref="ulmap" @contextmenu.prevent.stop="rightVisible = false,ulVisible = true,rightBaseHandle(item,$event)">
            <div class="span_title">图层目录</div>
            <div><i class="el-icon-menu" @click="closeExpandHandle"></i></div>
            <!--定义菜单及菜单项的操作-->
            <div v-show = "ulVisible" ref="ulMenu" id="ulMenu" class="ul_menu">
              <bmap-umenu ref="bmapUmenu" :vueObj="this"></bmap-umenu>
            </div>
          </div>

          <div :style="'height:' + (documentClientHeight - 350) + 'px'" class="project_ul block" v-loading="loading" element-loading-text="加载中...">
            <el-tree :data="bmapList" show-checkbox node-key="id" :props="defaultProps"  highlight-current current-node-key
                     :expand-on-click-node="true" @node-contextmenu = "rightClickHandle" @node-click="rightVisible = false , ulVisible = false"
                     :indent="0" :render-content="renderContent" default-expand-all="true" ref="tree">
            </el-tree>
            <!--定义菜单及菜单项的操作-->
            <div v-show = "rightVisible" ref="rightMenu" id="rightMenu" style="display:flex;">
              <!--主面板-->
              <bmap-rmenu ref="bmapRmenu" :vueObj="this" :selectNode="selectNode" :copyItem="copyItem"></bmap-rmenu>
            </div>
          </div>
          <div class=" bot_line">
            <el-button size="mini" type="primary" :disabled="pageIndex <= 1?true:false" @click="--pageIndex,getDataList()">上一页</el-button>
            <el-select size="mini" v-model="pageIndex" style="width: 58px;" @change="getDataList()">
              <el-option v-for="item in pageList" :key="item" :label="item" :value="item" ></el-option>
            </el-select>
            <el-button size="mini" type="primary" :disabled="pageIndex >= totalPage?true:false" @click="++pageIndex,getDataList()">下一页</el-button>
          </div>
        </el-card>
        <!--地图-->
        <div id="mapId" :style="'height:' + (documentClientHeight - 200) + 'px'" v-loading="posLoading"
             :element-loading-text="loadTxt" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        </div>

      </div>
      <!-- 标注word 导出弹窗-->
      <map-word-export v-if="wordVisible" ref="mapWordExport"></map-word-export>
      <!-- 标注弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- 项目弹窗, 新增 / 修改 -->
      <map-project-add-or-update v-if="mproVisible" ref="mapProjectAddOrUpdate" @refreshDataList="getDataList"></map-project-add-or-update>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import mapProjectAddOrUpdate from './mapproject-add-or-update'
  import polyGonObj from '@/utils/aMap/customPolygon'
  import polylineObj from '@/utils/aMap/customPolyline'
  import corGps from '@/utils/aMap/corGps'
  import pointObj from '@/utils/aMap/customPoint'
  import bmapRmenu from '@/components/bmap-rmenu'
  import bmapUmenu from '@/components/bmap-umenu'
  import {stringIsNull,treeDataTranslate,checkPhone} from '@/utils'
  import mapWordExport from './map-word-export'
  import AddOrUpdate from './map-add-or-update'
  export default {
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0,
        pageList: [],
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          labelName: '',
          parentId: 0
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        bmapList: [],
        loading: true,
        loadTxt: '',
        posLoading: false,
        expanded: true,
        zoom: 13,
        BMap: '',
        map: '',
        activeNames: [],
        drawOpen: false,
        // 被选中的节点
        selectNode: {
          id: '',
          type: ''
        },
        searchMarker: '',   // 搜索地址
        copyItem: {
          data: '',
          type: ''
        },  // 复制剪切对象(数据集、类型剪切粘贴)
        contextMenu: '',  // 标注右键菜单
        menuVisible: false,
        ulVisible: false,
        rightVisible: false,
        wordVisible: false,
        drawingManager: '',
        addOrUpdateVisible: false,
        mproVisible: false,  // 添加项目可视图
        upKmlUrl: window.SITE_CONFIG['baseUrl'] + '/dop/bmap/upKmlFile/',  // 合同上传地址
        tokenHeaders: { token: Vue.cookie.get('token') }  // token请求
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    components: {
      AddOrUpdate,
      mapProjectAddOrUpdate,
      bmapRmenu,
      bmapUmenu,
      mapWordExport
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let that = this
        // 右键菜单取消
        document.addEventListener('click', function (e) {
          that.ulVisible = false
          that.rightVisible = false
        })
        // 地图等级
        var satellite = new AMap.TileLayer.Satellite()
        var roadNet = new AMap.TileLayer.RoadNet({
          opacity: 0.5
        })
        // 楼块图层
        var buildings = new AMap.Buildings({
          zooms: [16, 20],
          zIndex: 10,
          heightFactor: 2 // 2倍于默认高度，3D下有效
        })
        var map = new AMap.Map('mapId', {
          zoom: 16,
          pitch: 0,
          showBuildingBlock: true,
          mapStyle: 'amap://styles/light',
          center: [116.72, 23.37],
          viewMode: '3D',
          resizeEnable: true,
          expandZoomRange: true,
          buildingAnimation: true, // 楼块出现是否带动画
          zooms: [3, 21],
          layers: [
            satellite,
            roadNet,
            buildings
          ]
        })

        // 添加范围控件
        map.addControl(new AMap.Scale())
        // 添加 3D 罗盘控制
        map.addControl(new AMap.ControlBar({
          position: {
            right: '5px',
            bottom: '0px'
          },
          showControlButton: true})
        )
        // 定位控件
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,          // 超过10秒后停止定位，默认：5s
          buttonPosition: 'RB',    // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true   // 定位成功后是否自动调整地图视野到定位点
        })
        map.addControl(geolocation)
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            console.log(result)
          } else {
            that.$message.error('定位失败！')
          }
        })
        // 输入提示
        var autoOptions = {
          input: 'searchId'
        }
        var auto = new AMap.Autocomplete(autoOptions)
        // 构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          map: map
        })
        AMap.event.addListener(auto, 'select', function (e) {
          placeSearch.setCity(e.poi.adcode)
          placeSearch.search(e.poi.name)  // 关键字查询查询
        }) // 注册监听，当选中某条记录时会触发

        this.map = map
        this.getDataList()
      },
      // 树状显示列表
      renderContent (h, {node, data, store}) {
        // 高亮显示
        let flag = (this.dataForm.labelName.trim() !== '') && (data.label.indexOf(this.dataForm.labelName.trim()) !== -1)
        return h('span', {
          domProps: {
            className: data.parentId === 0 ? 'main_ul fh' : 'other_ul fh'
          },
          id: data.id,
          style: {
            opacity: this.copyItem.data.id === data.id ? 0.7 : 1,
            color: flag ? 'white' : '',
            backgroundColor: flag ? 'red' : ''
          }
        }, [h('i', {
          domProps: {
            className: data.icon
          }}), data.label])
      },
      // 获取所有标注列表
      getBampList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/dop/bmap/page'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'key': this.dataForm.labelName.trim(),
              'sidx': this.dataForm.sidx,
              'order': this.dataForm.order
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.page)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 展开(收缩)列表
      closeExpandHandle () {
        this.expanded = !this.expanded
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.expanded
        }
      },
      // 获取标注数据并绘制
      getDataList () {
        this.loading = true
        this.expanded = true
        this.map.clearMap()
        this.getBampList().then(page => {
          this.totalPage = page.totalPage
          this.totalCount = page.totalCount
          this.pageList = Array.from(new Array(page.totalPage), (item, index) => index + 1)
          let polyList = []
          let corlist = []
          for (let bPoint of page.list) {
            switch (bPoint.type) {
              // 点
              case 1:
                bPoint.icon = 'el-icon-s-opportunity'
                var point = new pointObj()
                point.init(bPoint, this)
                break
              // 线
              case 2:
                bPoint.icon = 'el-icon-s-marketing'
                var polyline = new polylineObj()
                polyline.init(bPoint, this)
                break
              // 面
              case 3:
                bPoint.icon = 'el-icon-picture'
                var polygon = new polyGonObj()
                polygon.init(bPoint, this)
                break
              default:
                bPoint.icon = 'el-icon-folder'
                break
            }
          }
          this.bmapList = treeDataTranslate(page.list)
          this.loading = false
        })
      },
      // 右键点击事件 (目录菜单)
      rightBaseHandle (item, event) {
        let ulMenu = document.querySelector('#ulMenu')
        ulMenu.style.cssText = 'position: fixed; left: ' + (event.clientX) + 'px' + '; top: ' + (event.clientY) + 'px; z-index: 999; cursor:pointer;'
      },
      // 右键点击事件 (标注菜单)
      rightClickHandle (event, object, value, element) {
        this.ulVisible = false
        this.rightVisible = true
        let menu = document.querySelector('#rightMenu')
        let rect = element.$el.getClientRects()[0]
        menu.style.cssText = 'position: fixed; left: ' + (event.clientX) + 'px' + '; top: ' + rect.top + 'px; z-index: 999; cursor:pointer;'
        this.selectNode = value.data
      },
      // 图形编辑之后执行的数据库更新操作
      updateAfterGraEdit (eachPoint) {
        this.$http({
          url: this.$http.adornUrl('/dop/bmap/update'),
          method: 'post',
          data: this.$http.adornData({
            'dopBmapEntity': eachPoint
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.visible = false
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改 项目
      addProjectHandle (id,pId) {
        let item = {
          id: id,
          parentId: pId
        }
        this.mproVisible = true
        this.$nextTick(() => {
          this.$refs.mapProjectAddOrUpdate.init(item)
        })
      },
      // 导出word
      exportWordHandle (id) {
        this.wordVisible = true
        this.$nextTick(() => {
          this.$refs.mapWordExport.init(this.selectNode)
        })
      },
      // 删除标注点事件
      delDimHandle (item) {
        let tip = '此操作将永久删除名称为  [' + item.label + ']   的' + (item.type === 0 ? '项目' : '标注点') + '信息, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/dop/bmap/delete/${item.id}`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 上传KML文件  上传成功时的钩子
      importKMLHandle (res, file, fileList) {
        this.loading = false
        this.$message({
          message: 'Kml文件上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
            this.getDataList()
          }
        })
      }
    }
  }
</script>

<style>
  .fh{
    display: inline-block;
    max-width:220px;
    word-wrap:break-word;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .fh:hover{
    white-space:normal;
    overflow:auto;
    color: #0000ff;
  }
  .main_ul {
    color: #00a0e9;
    font-weight: 700;
    font-size: 13pt;
  }
  .other_ul {
    font-size: 10pt;
  }
</style>

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
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
  .pos_card {
    position: absolute;
    right: 25px;
    z-index: 1000;
    bottom:120px;
  }
  .detail_card {
    position: absolute;
    right: 20px;
    background: #2BCBBBaf;
    color: white;
    z-index: 1000;
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

  }
  .collapse_item /deep/ {
    .el-collapse-item__wrap {
      background-color:rgba($--color-primary,0.2);
      border-bottom: 0px;
    }
    .el-collapse-item__content {
      font-weight:600;
      color: black;
    }
    .el-collapse-item__header {
      color: black;
      background-color:rgba($--color-primary,0.7);
      border-bottom: 0px;
      &:hover {
        color: black;
        background-color:rgba($--color-primary,0.9);
      }
    }
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

  .ef_line{
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .map {
    display: flex;
    justify-content: flex-start;
  }
  .map #mapId{
    width: 100%;
    margin-left: 5px;
  }
  .map_project {
    width: 275px;
    display: inline-block;
  }
  .map .ul_line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed rgba($--color-primary,0.7);
    border-top: 1px dashed rgba($--color-primary,0.7);
    background-color: $--color-primary;
    color: whitesmoke;
  }
  .map .ul_menu{
    position:absolute;
    display:flex;
    z-index: 1001;
  }
  .map .ul_line i{
    padding: 6px;
    font-size: 13pt;
    cursor: pointer;
  }
  .map .span_title {
    font-weight: 700;
    font-size: 13pt;
    padding: 5px;
    width: 80%;
    cursor: pointer;
  }
  .map .project_ul {
    overflow-y: auto;
    -ms-overflow-y: auto;
    overflow-x: hidden;
    font-size: 11pt;
    border: 1px solid $--color-primary;
  }
  .map .bot_line {
    margin-top: 8px;
  }
  .map .project_ul /deep/{
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 8px;
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    .el-tree-node__expand-icon.is-leaf{
      display: none;
    }
    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node :last-child:before {
      height: 38px;
    }

    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .el-tree-node:before {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:after {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }

    .el-tree-node:before {
      border-left: 1px dashed rgba($--color-primary,0.7);
      bottom: 0px;
      height: 100%;
      top: -26px;
      width: 1px;
    }

    .el-tree-node:after {
      border-top: 1px dashed rgba($--color-primary,0.7);
      height: 20px;
      top: 12px;
      width: 11px;
    }
  }
  .map .project_ul .el-tree-node__content {
    .el-checkbox .el-checkbox__inner{
      width: 18px;
      height: 18px;
    }
  }
  .map .project_ul .el-tree--highlight-current /deep/ .el-tree-node.is-checked > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
    color: $navbar--background-color;
  }
</style>
