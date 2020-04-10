<template>
  <el-dialog title="项目返修内容" :close-on-click-modal="false" :visible.sync="visible" :before-close="reportDialogClose" width="80%">
    <el-table :data="dataList">
      <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
      <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="checkReportHandle(scope.row)">查看内容</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="submitNote" header-align="center" align="center" label="修改说明"></el-table-column>
      <el-table-column header-align="center" align="center"  label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addNoteHandle(scope.row)" v-if="scope.row.submitNote == null">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 质检反馈报告-->
    <el-card :class="reportVisible? 'anim_report_view' : 'anim_not_view' " class="quality_card">
      <div class="quality_card_title">{{reportTitle}}</div>
      <div ref="reportId" class="quality_report"></div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,reportVisible = false">取消</el-button>
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
        reportVisible: false,
        reportTitle: '',
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
                this.$refs.reportId.innerHTML = ''
              }
            })
          }
        })
      },
      // 查看质检反馈内容
      checkReportHandle (item) {
        this.reportVisible = true
        this.reportTitle = '质检反馈报告（ 日期：' + item.backCreateTime + ')'
        this.$refs.reportId.innerHTML = item.backNote
      },
      // 返修列表关闭事件
      reportDialogClose () {
        this.reportVisible = false
        this.visible = false
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

<style scoped>
  .quality_card{
    margin-top: 15px;
  }
  .quality_card .quality_card_title{
    font-weight: 700;
    font-size: 13pt;
    border-bottom: 1px solid #00a0e93f;
  }
  .quality_report{
    overflow: auto;
    max-height: 500px;
    padding: 8px;
  }
  .anim_not_view{
    opacity: 0;
  }
  /* 下拉动画 */
  .anim_report_view{
    display: block;
    animation:2s report_view 0s;
  }

  @keyframes report_view{
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
  }
</style>
