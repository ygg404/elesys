<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px">
      <el-form-item label="标题:" prop="label">
        <el-input v-mlodel="dataForm.label" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="面积(平方米):" prop="area">
        <span>{{dataForm.area}}</span>
      </el-form-item>
      <el-form-item label="绘制类型:" prop="type">
        <el-select v-model="dataForm.type"  style="width: 110px;" disabled>
          <el-option v-for="item in drawList" :label="item.drawItem" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="经度（中心坐标）:" prop="lng">
        <el-input v-model="dataForm.lng" placeholder="经度（中心坐标）" disabled></el-input>
      </el-form-item>
      <el-form-item label="纬度（中心坐标）:" prop="lat">
        <el-input v-model="dataForm.lat" placeholder="纬度（中心坐标）" disabled></el-input>
      </el-form-item>
      <el-form-item label="各点经纬度:" prop="coordinate">
        <span>{{dataForm.coordinate}}</span>
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
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getMapDrawingItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        visible: false,
        drawList: getMapDrawingItem(),
        dataForm: {
          id: 0,
          label: '',
          lng: '',
          lat: '',
          coordinate: '',
          area: '',
          type: '',
          remark: '',
          createUserId: '',
          createUserName: '',
          createTime: '',
          modifyTime: ''
        },
        dataRule: {
          label: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          lng: [
            { required: true, message: '经度（中心坐标）不能为空', trigger: 'blur' }
          ],
          lat: [
            { required: true, message: '纬度（中心坐标）不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/set/dopbmap/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.label = data.dopbmap.label
                this.dataForm.lng = data.dopbmap.lng
                this.dataForm.lat = data.dopbmap.lat
                this.dataForm.labelLng = data.dopbmap.labelLng
                this.dataForm.labelLat = data.dopbmap.labelLat
                this.dataForm.coordinate = data.dopbmap.coordinate
                this.dataForm.area = data.dopbmap.area
                this.dataForm.type = data.dopbmap.type
                this.dataForm.remark = data.dopbmap.remark
                this.dataForm.createUserId = data.dopbmap.createUserId
                this.dataForm.createUserName = data.dopbmap.createUserName
                this.dataForm.createTime = data.dopbmap.createTime
                this.dataForm.modifyTime = data.dopbmap.modifyTime
              }
            })
          } else {
            let coordinate = ''
            let lngall = 0
            let latall = 0
            // 计算中心坐标
            for (let point of item.lay.Ao) {
              coordinate += point.lng + ',' + point.lat + ';'
              lngall += point.lng
              latall += point.lat
            }
            this.dataForm.lng = (lngall / item.lay.Ao.length).toFixed(6)
            this.dataForm.lat = (latall / item.lay.Ao.length).toFixed(6)
            this.dataForm.coordinate = coordinate
            this.dataForm.area = item.area
            this.dataForm.type = item.type
            this.dataForm.labelLng = item.labelLng
            this.dataForm.labelLat = item.labelLat
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/dop/bmap/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'label': this.dataForm.label,
                'labelLng': this.dataForm.labelLng,
                'labelLat': this.dataForm.labelLat,
                'lng': this.dataForm.lng,
                'lat': this.dataForm.lat,
                'coordinate': this.dataForm.coordinate,
                'area': this.dataForm.area,
                'type': this.dataForm.type,
                'remark': this.dataForm.remark
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
      }
    }
  }
</script>
