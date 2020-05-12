<template>
  <el-dialog
    :title="!dataForm.id ? '新增快捷短语' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="短语内容" prop="shortcutNote">
        <el-input v-model="dataForm.shortcutNote" placeholder="短语内容"></el-input>
      </el-form-item>
      <el-form-item label="短语类型" prop="shortcutTypeId">
        <el-select v-model="dataForm.shortcutTypeId" placeholder="请选择短语类型" multiple clearable="true" style="width: 100%;">
          <el-option
            v-for="item in shortTypeList"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型" >
        <el-select v-model="dataForm.projectTypeIdList" outlined multiple placeholder="请选择项目类型" style="width: 100%;">
          <el-option
            v-for="item in projectTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {stringIsNull} from '@/utils'

  export default {
    data () {
      return {
        visible: false,
        projectTypeList: [],
        dataForm: {
          id: 0,
          shortcutName: '',
          shortcutNote: '',
          shortcutTypeId: '',
          projectTypeIdList: '',
          projectType: ''
        },
        value: '',
        dataRule: {
          shortcutName: [
            { required: true, message: '短语类型不能为空', trigger: 'blur' }
          ],
          shortcutNote: [
            { required: true, message: '短语内容不能为空', trigger: 'blur' }
          ],
          shortcutTypeId: [
            { required: true, message: '短语类型Id不能为空', trigger: 'blur' }
          ]
        },
        shortTypeList: []
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getProjectTypeListFromApi()
          this.getShortTypeList().then(success => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/set/wpshortcut/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.shortcutName = data.wpShortcut.shortcutName
                  this.dataForm.shortcutNote = data.wpShortcut.shortcutNote
                  this.dataForm.shortcutTypeId = data.wpShortcut.shortcutTypeId.split(',').map(function (data) {return +data})
                  this.dataForm.projectTypeIdList = stringIsNull(data.wpShortcut.projectTypeId) ? [] : data.wpShortcut.projectTypeId.split(',').map(function (data) {return +data} )
                }
              })
            }
          })
        })
      },
      // 获取短语类型列表
      getShortTypeList () {
        return new Promise(resolve => {
          this.$http({
            url: this.$http.adornUrl('/set/shorttype/list'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.shortTypeList = data.list
              resolve(data.list)
            } else {
              this.dataList = []
            }
          })
        })

      },
      // 从后台获得下拉列表内容  填充至选项
      getProjectTypeListFromApi () {
        return new Promise((resolve,reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/projecttype/selectprojecttype'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypeList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        // 短语类型名称
        this.dataForm.shortcutName = []
        for (let shortcut of this.shortTypeList) {
          for (let shortId of this.dataForm.shortcutTypeId) {
            if (shortId === shortcut.id) {
              this.dataForm.shortcutName.push(shortcut.typeName)
            }
          }
        }
        // 项目类型名称
        console.log(this.dataForm.projectTypeIdList)
        this.dataForm.projectType = []
        for (let projecttype of this.projectTypeList) {
          for (let typeId of this.dataForm.projectTypeIdList) {
            if (typeId === projecttype.id) {
              this.dataForm.projectType.push(projecttype.name)
            }
          }
        }
        // this.dataForm.shortcutName = this.shortTypeList.find(item => item.id === this.dataForm.shortcutTypeId)['typeName']
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/wpshortcut/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'shortcutNote': this.dataForm.shortcutNote,
                'shortcutName': this.dataForm.shortcutName.join(','),
                'shortcutTypeId': this.dataForm.shortcutTypeId.join(','),
                'projectType': this.dataForm.projectType.join(','),
                'projectTypeId': this.dataForm.projectTypeIdList.join(',')
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
