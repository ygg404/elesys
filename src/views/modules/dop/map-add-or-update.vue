<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="95%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px">
      <el-row :gutter="24">
        <el-col :span="9">
          <el-form-item label="名称:" prop="label">
            <el-input v-model="dataForm.label" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label="面积(平方米):" prop="area">
            <span>{{dataForm.area}}</span>
          </el-form-item>
          <el-form-item label="绘制类型:" prop="type">
            <el-select v-model="dataForm.type"  style="width: 110px;" disabled>
              <el-option v-for="item in drawList" :label="item.drawItem" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="中心坐标:" >
            <span>{{dataForm.lng + '  ,   ' + dataForm.lat}}</span>
          </el-form-item>
          <el-form-item label="各点经纬度:" prop="coordinate">
            <table border="1" cellspacing="0" cellpadding="0" class="cor_table">
              <tr>
                <th>经度</th><th>纬度</th>
              </tr>
              <tr v-for="item in dataForm.coordinate.split(';')">
                <td class="cor_td">{{item.split(',')[0]}}</td>
                <td class="cor_td">{{item.split(',')[1]}}</td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="创建用户名:" prop="createUserName">
            <span>{{dataForm.createUserName}}</span>
          </el-form-item>
          <el-form-item label="创建时间:" prop="createTime">
            <span>{{dataForm.createTime}}</span>
          </el-form-item>
          <el-form-item label="修改时间:" prop="modifyTime">
            <span>{{dataForm.modifyTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template slot="title">
                <span class="title_span">基本信息</span>
              </template>
              <el-card>
                <el-row class="line">
                  <div class="property_span">点名：</div>
                  <div><el-input v-model="dataForm.label" size="small"></el-input></div>
                </el-row>
                <el-row class="line"><div class="property_span">来源：</div>
                  <div>
                    <el-autocomplete v-model="dataForm.origin" :fetch-suggestions="queryOriginSearch" @select="handleOrginSelect" size="small">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </div>
                </el-row>
                <el-row class="line">
                  <div class="property_span">测绘人员：</div>
                  <div>
                    <el-input v-model="dataForm.surveyor" size="small"></el-input>
                  </div>
                </el-row>
                <el-row class="line">
                  <div class="property_span">测定方法：</div>
                  <div>
                    <el-autocomplete v-model="dataForm.posMethod" :fetch-suggestions="queryPosSearch" @select="handlePosSelect" size="small">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </div>
                </el-row>
              </el-card>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <span class="title_span">坐标信息</span>
              </template>
              <el-card>
                <el-row class="line">
                  <div class="property_span">坐标系统：</div>
                  <div>
                    <el-autocomplete v-model="dataForm.corSystem" :fetch-suggestions="queryCorSearch" @select="handleCorSelect" size="small">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </div>
                </el-row>
                <el-row class="line">
                  <div class="property_span">精确坐标：</div>
                  <table border="1" cellspacing="0">
                    <tr><td class="property_td">X</td><td><el-input v-model="dataForm.corX" type="number" size="mini" style="padding: 3px;"></el-input></td></tr>
                    <tr><td class="property_td">Y</td><td><el-input v-model="dataForm.corY" type="number" size="mini" style="padding: 3px;"></el-input></td></tr>
                    <tr><td class="property_td">H</td><td><el-input v-model="dataForm.corH" type="number" size="mini" style="padding: 3px;"></el-input></td></tr>
                  </table>
                </el-row>
              </el-card>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template slot="title">
                <span class="title_span">点之记</span>
              </template>
              <el-card>
                <table border="1" cellspacing="0">
                  <tr>
                    <td class="td_span" colspan="1">点名</td>
                    <td colspan="2"><el-input v-model="dataForm.label" size="small"></el-input></td>
                    <td class="td_span" colspan="1">类别</td>
                    <td colspan="3">
                      <el-autocomplete v-model="dataForm.posCate" :fetch-suggestions="queryCateSearch" @select="handleCateSelect" size="small">
                        <template slot-scope="{ item }">
                          <div class="name">{{ item.nameItem }}</div>
                        </template>
                      </el-autocomplete>
                    </td>
                    <td class="td_span" colspan="1">所在图幅</td><td colspan="4"><el-input v-model="dataForm.sheet" size="small"></el-input></td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">所在地</td>
                    <td colspan="5"><el-input size="small" v-model="dataForm.location"></el-input></td>
                    <td class="td_span" colspan="1">概略位置</td><td colspan="5"><el-input size="small" v-model="dataForm.outline"></el-input></td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">地 类</td><td colspan="2"><el-input size="small" v-model="dataForm.cake"></el-input></td>
                    <td class="td_span" colspan="1">土 质</td><td colspan="2"><el-input size="small" v-model="dataForm.soil"></el-input></td>
                    <td class="td_span" colspan="1">冻土深度</td><td colspan="2"><el-input size="small" disabled></el-input></td>
                    <td class="td_span" colspan="1">解冻深度</td><td colspan="2"><el-input size="small" disabled></el-input></td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">本点交通概况</td>
                    <td colspan="5"><el-input size="small" v-model="dataForm.transport" type="textarea" rows="8"></el-input></td>
                    <td class="td_span" colspan="1">本点交通线图</td>
                    <td colspan="5">
                      <div class="map_cut">
                        <div class="map_backImg" v-if="stringIsNull(dataForm.transImg)">
                          <i class="el-icon-picture-outline"></i>
                          <div style="font-size: 9pt">请从百度地图截取图片</div>
                          <div style="font-size: 9pt">或从本地文件选择png、jpeg、bmp文件</div>
                        </div>
                        <img class="map_img" :src="imgTrans" v-else/>
                        <div class="btn_card">
                          <div class="btn_line"><el-button type="primary" icon="el-icon-crop" @click="cropperMapHandle">地图截取</el-button></div>
                          <div class="btn_line" style="top: 38%">
                            <input type="file" class="card_detail_img_input" accept="image/*" id="trans" @change="compressImgHandle"/>
                            <el-button type="primary" icon="el-icon-picture">本地文件</el-button>
                          </div>
                          <div class="btn_line" style="top: 61%">
                            <el-button type="danger" icon="el-icon-delete" @click="dataForm.transImg = '',imgTrans = ''">清空图片</el-button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">现场近照</td>
                    <td colspan="5" style="text-align: left">
                      <div class="card_detail_img">
                        <img :src="imgScene" class="card_detail_img_content" v-if="!stringIsNull(dataForm.photoScene)"/>
                        <div class="card_detail_img_add"><i class="el-icon-plus addplus"></i></div>
                        <input type="file" class="card_detail_img_input" accept="image/*" id="scene" @change="compressImgHandle"/>
                      </div>
                    </td>
                    <td class="td_span" colspan="1">现场远照</td>
                    <td colspan="5">
                      <div class="card_detail_img">
                        <img :src="imgFar" alt="" class="card_detail_img_content" v-if="!stringIsNull(dataForm.photoFar)"/>
                        <div class="card_detail_img_add"><i class="el-icon-plus addplus"></i></div>
                        <input type="file" class="card_detail_img_input" accept="image/*" id="far" @change="compressImgHandle"/>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="6" style="text-align: center">点 位 说 明</td>
                    <td class="td_span" colspan="6" style="text-align: center">点 位 略 图</td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="6" style="text-align: center">选 点 埋 石 情 况</td>
                    <td class="td_span" colspan="6" style="text-align: center">标 石 断 面 图</td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">单 位</td><td colspan="5"><el-input size="small" v-model="dataForm.unit"></el-input></td>
                    <td colspan="6" rowspan="4" style="text-align: center"><img src="~@/assets/img/mapImg/point.png" /></td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="1">选点员</td><td colspan="2"><el-input size="small" v-model="dataForm.pointPerson"></el-input></td>
                    <td class="td_span" colspan="1">埋石日期</td>
                    <td colspan="2"><el-date-picker v-model="dataForm.stoneTime"  value-format="yyyy-MM-dd" size="small" style="max-width: 140px;"></el-date-picker></td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="4">是否联测Ⅳ等水准</td>
                    <td colspan="2">
                      <el-select v-model="dataForm.unitMeasure" size="small">
                        <el-option v-for="item in measureList"  :label="item.nameItem" :key="item.id" :value="item.id"></el-option>
                      </el-select>
                    </td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="6">备注：
                      <div><el-input v-model="dataForm.remark" type="textarea" rows="4"></el-input></div>
                    </td>
                  </tr>
                  <tr>
                    <td class="td_span" colspan="6"></td>
                    <td class="td_span" colspan="1">编制</td>
                    <td class="td_span" colspan="2"><el-input v-model="dataForm.authMan" size="small"></el-input></td>
                    <td class="td_span" colspan="1">校核</td>
                    <td class="td_span" colspan="2"><el-input v-model="dataForm.checkMan" size="small"></el-input></td>
                  </tr>
                </table>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getMapDrawingItem,getPosMethodItem,getOrginItem,getCorSysItem,getPosCateItem,getMeasureItem} from '@/utils/selectedItem'
  import {stringIsNull} from '@/utils'
  import moment from 'moment'
  import html2canvas from 'html2canvas'
  import lrz from 'lrz'

  export default {
    data () {
      return {
        activeNames: [ '1' ],
        visible: false,
        measureList: getMeasureItem(),
        drawList: getMapDrawingItem(),
        imgFar: '',
        imgScene: '',
        imgTrans: '',
        dataForm: {
          id: 0,
          label: '',
          labelLng: '',
          labelLat: '',
          lng: '',
          lat: '',
          coordinate: '',
          area: '',
          type: '',
          origin: '',
          surveyor: '',
          posMethod: '',
          corSystem: '',
          corX: '',
          corY: '',
          corH: '',
          posCate: '',
          sheet: '',
          location: '',
          outline: '',
          cake: '平地、山地',
          soil: '水泥、土质',
          transport: '',
          transImg: '',
          photoScene: '',
          photoFar: '',
          unit: '广东杰信测绘科技有限公司',
          pointPerson: '',
          stoneTime: moment(new Date()).format('YYYY-MM-DD'),
          unitMeasure: '',
          remark: '',
          authMan: '',
          checkMan: '',
          createUserId: '',
          createUserName: '',
          createTime: '',
          modifyTime: '',
          parentId: ''
        },
        dataRule: {
          label: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          coordinate: [
            { required: true, message: '经纬度（格式： xx,xx；xx,xx ）不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '面积不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型（1-点；2-线；3-面）不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm.id = item.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/dop/bmap/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.label = data.dopBmap.label
                this.dataForm.labelLng = data.dopBmap.labelLng
                this.dataForm.labelLat = data.dopBmap.labelLat
                this.dataForm.lng = data.dopBmap.lng
                this.dataForm.lat = data.dopBmap.lat
                this.dataForm.coordinate = data.dopBmap.coordinate
                this.dataForm.area = data.dopBmap.area
                this.dataForm.type = data.dopBmap.type
                this.dataForm.origin = data.dopBmap.origin
                this.dataForm.surveyor = data.dopBmap.surveyor
                this.dataForm.posMethod = data.dopBmap.posMethod
                this.dataForm.corSystem = data.dopBmap.corSystem
                this.dataForm.corX = data.dopBmap.corX
                this.dataForm.corY = data.dopBmap.corY
                this.dataForm.corH = data.dopBmap.corH
                this.dataForm.posCate = data.dopBmap.posCate
                this.dataForm.sheet = data.dopBmap.sheet
                this.dataForm.location = data.dopBmap.location
                this.dataForm.outline = data.dopBmap.outline
                this.dataForm.cake = data.dopBmap.cake
                this.dataForm.soil = data.dopBmap.soil
                this.dataForm.transport = data.dopBmap.transport
                this.dataForm.transImg = data.dopBmap.transImg
                this.dataForm.photoScene = data.dopBmap.photoScene
                this.dataForm.photoFar = data.dopBmap.photoFar
                this.dataForm.unit = data.dopBmap.unit
                this.dataForm.stoneTime = data.dopBmap.stoneTime
                this.dataForm.unitMeasure = data.dopBmap.unitMeasure
                this.dataForm.remark = data.dopBmap.remark
                this.dataForm.createUserId = data.dopBmap.createUserId
                this.dataForm.createUserName = data.dopBmap.createUserName
                this.dataForm.createTime = data.dopBmap.createTime
                this.dataForm.modifyTime = data.dopBmap.modifyTime
                this.dataForm.parentId = data.dopBmap.parentId
                this.imgFar = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.dopBmap.photoFar
                this.imgScene = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.dopBmap.photoScene
                this.imgTrans = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.dopBmap.transImg
              }
            })
          } else {
            let coordinate = ''
            let lngall = 0
            let latall = 0
            switch (item.type) {
              // 点
              case 1:
                this.dataForm.lng = item.labelLng
                this.dataForm.lat = item.labelLat
                coordinate = item.labelLng + ',' + item.labelLat
                break
              // 线和面
              case 2:
                console.log(item.lay)
                for (let point of item.lay) {
                  coordinate += point.lng + ',' + point.lat + ';'
                  lngall += point.lng
                  latall += point.lat
                }
                coordinate = coordinate.substring(0, coordinate.length - 1)
                this.dataForm.lng = (lngall / item.lay.length).toFixed(6)
                this.dataForm.lat = (latall / item.lay.length).toFixed(6)
                break
              case 3:
                // 计算中心坐标
                for (let point of item.lay.Ao) {
                  coordinate += point.lng + ',' + point.lat + ';'
                  lngall += point.lng
                  latall += point.lat
                }
                coordinate = coordinate.substring(0, coordinate.length - 1)
                this.dataForm.lng = (lngall / item.lay.Ao.length).toFixed(6)
                this.dataForm.lat = (latall / item.lay.Ao.length).toFixed(6)
                break
              default:
                break
            }
            this.dataForm.coordinate = coordinate
            this.dataForm.label = ''
            this.dataForm.area = item.area
            this.dataForm.type = item.type
            this.dataForm.labelLng = item.labelLng
            this.dataForm.labelLat = item.labelLat
            this.dataForm.parentId = item.parentId
            this.findLocationName(item.labelLng , item.labelLat)
          }
        })
      },
      // 通过经纬度查找地址
      findLocationName (lng , lat) {
        var that = this
        var point = new BMap.Point(lng , lat) // 用所定位的经纬度查找所在地省市街道等信息
        var gc = new BMap.Geocoder()
        gc.getLocation(point, function (rs) {
          that.dataForm.location = rs.address
        })
      },
      // 来源选项
      queryOriginSearch (queryString, cb) {
        var list = getOrginItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 定位选项
      queryPosSearch (queryString, cb) {
        var list = getPosMethodItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 坐标选项
      queryCorSearch (queryString, cb) {
        var list = getCorSysItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 类级选项
      queryCateSearch (queryString, cb) {
        var list = getPosCateItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.nameItem.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handlePosSelect (item) {
        this.dataForm.posMethod = item.nameItem
      },
      handleOrginSelect (item) {
        this.dataForm.origin = item.nameItem
      },
      handleCorSelect (item) {
        this.dataForm.corSystem = item.nameItem
      },
      handleCateSelect (item) {
        this.dataForm.posCate = item.nameItem
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dop/bmap/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'dopBmapEntity': this.dataForm
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 图片压缩处理 (图片类)
      compressImgHandle (e) {
        let that = this
        if (e.target.files && e.target.files.length === 1) {
          let options = {
            quality: 0.5,
            width: 850,
            height: 850
          }
          lrz(e.target.files[0], options)
            .then(function (rst) {
              // 成功时执行
              that.upImgToApi(rst,e.target.id)
            }).catch(function (error) {
            // 失败时执行
            that.$message.error('上传图片有误，请重新上传！')
          }).always(function () {
            // 不管成功或失败，都会执行
          })
        }
      },
      // 百度地图截取
      cropperMapHandle () {
        console.log(this.$el.parentElement.querySelector('#mapId'))
        html2canvas(this.$el.parentElement.querySelector('#mapId'), {})
          .then((canvas) => {
            let imgData = canvas.toDataURL('image/png') // 将canvas转成base64图片格式
          })
      },
      upImgToApi (rst, imgType) {
        this.$http({
          url: this.$http.adornUrl(`/dop/bmap/upBmapImg`),
          method: 'post',
          data: this.$http.adornData({
            'imgCode': rst.base64,
            'imgType': imgType
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '提交图片成功！',
              type: 'success',
              duration: 1500
            })
            switch (imgType) {
              case 'trans':
                this.dataForm.transImg = data.imgPath
                this.imgTrans = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.imgPath
                break
              case 'scene':
                this.dataForm.photoScene = data.imgPath
                this.imgScene = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.imgPath
                break
              case 'far':
                this.dataForm.photoFar = data.imgPath
                this.imgFar = window.SITE_CONFIG['uploadUrl'] + 'bmap/' + data.imgPath
                break
              default:
                break
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cor_table{
    text-align: center;
  }
  .cor_td {
    padding: 0px 6px 0px 6px;
  }
  .title_span {
    color: green;
    font-weight: 700;
    font-size: 12pt;
  }
  .title_span :hover {
    color: greenyellow;
  }
  .line {
    display: flex;
    margin-top: 2px;
    .property_span {
      font-weight: 700;
      line-height: 200%;
      font-size: 12pt;
      width: 130px;
    }
    .property_td {
      width: 20px;
      text-align: center;
    }
  }
  .td_span {
    font-weight: 700;
  }

  .card_detail_img {
    margin-left: 25%;
    width: 160px;
    height: 213px;
    position: relative;
    border: 2px solid green;
    border-radius: 10px;
  }

  .card_detail_img_content {
    text-align: center;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  .card_detail_img_add {
    transform: translate(+0%,0%);
    height: 40px;
    width: 159px;
    position: absolute;
    margin-left: -2px;
    bottom: 0px;
    z-index: 2;
    background: #3b4249;
    opacity: 0.5;
    border-radius: 0px 0px 10px 10px;
    -moz-border-radius-bottomleft: 10px;
    -moz-border-radius-bottomright: 10px;
    text-align: center;
    vertical-align: center;
  }
  .card_detail_img_add .addplus {
    color: white;
    width: 30px;
    height: 30px;
    font-weight: 700;
    font-size: 25pt;
    vertical-align: center;
  }
  .card_detail_img_input {
    width: 100%;
    height: 100%;
    z-index: 3;
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  .card_detail_input {
    width: 200px;
  }

  .map_cut{
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10%;
    width: 80%;
    max-width: 250px;
    height: 250px;
    text-align: center;
    vertical-align: center;
    cursor: pointer;
    color: green;
    border: 2px dotted green;
    position: relative;
    .map_backImg{
      font-size: 70pt;
      position: absolute;
      width: 100%;
      height: 100%;
      vertical-align: center;
      z-index: 1;
    }
    .map_img {
      object-fit: contain;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      z-index: 1
    }
    .btn_card {
      background-color: #0c0c0c9f;
      position: absolute;
      height: 100%;
      width: 100%;
      display: none;
      z-index: 3;
      .btn_line {
        padding: 10px;
        vertical-align: middle;
        position: absolute;
        top:15%;
        width: 100%;
      }
    }
  }
  .map_cut:hover .btn_card {
    display: block;
    background-color: #0c0c0c9f;
    position: absolute;
    height: 100%;
    width: 100%;
  }
</style>
