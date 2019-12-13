<template>
  <el-dialog title="项目返修内容" :close-on-click-modal="false" :visible.sync="visible">
    <el-table :data="dataList">
      <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
      <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" ></el-table-column>
      <el-table-column prop="submitNote" header-align="center" align="center" label="修改说明"></el-table-column>
      <el-table-column header-align="center" align="center"  label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addNoteHandle(scope.row)" v-if="scope.row.submitNote == null">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>

    <el-dialog title="回复内容" :close-on-click-modal="false" :visible.sync="noteVisible" append-to-body>
      <!--<el-select  placeholder="返修意见快捷输入" v-model="repairValue" style="width: 100%" multiple collapse-tags  @change="repairNoteHandler()" >-->
        <!--<el-option v-for="item in repairNotelist" :label="item.shortcutNote" :key="item.id" :value="item.id"  ></el-option>-->
      <!--</el-select>-->
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" class="form_class">
        <el-form-item prop="submitNote">
          <el-input type="textarea" placeholder="请输入提交内容" maxlength="1000" size="large" show-word-limit rows="4"   v-model="dataForm.submitNote" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteVisible = false">取消</el-button>
        <el-button @click="dataFormSubmit" type="primary">确定</el-button>
      </span>
    </el-dialog>

  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        noteVisible: false,
        dataForm: {
          id: 0,
          projectno: '',
          backnote: '',
          backcreatetime: '',
          submitNote: '',
          submitcreatetime: '',
          backstage: '',
          backdatenum: '',
          groupid: ''
        },
        dataRule: {
          submitNote: [
            { required: true, message: '提交内容不能为空', trigger: 'blur' }
          ]
        },
        dataList: []
      }
    },
    methods: {
      init (projectNo) {
        this.visible = true
        this.$nextTick(() => {
          if (projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.list
              }
            })
          }
        })
      },
      // 添加提交内容
      addNoteHandle (item) {
        console.log(item)
        this.dataForm.id = item.id
        this.dataForm.projectNo = item.projectNo
        this.noteVisible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/backwork/update`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'projectNo': this.dataForm.projectNo,
                'submitNote': this.dataForm.submitNote,
                'backStage': 1
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.noteVisible = false
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
