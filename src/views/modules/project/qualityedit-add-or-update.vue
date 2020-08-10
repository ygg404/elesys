<template>
  <el-dialog
    title="编辑质检反馈"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible">
    <wang-editor :content="ueContent" :id='id' :projectNo="projectNo" @refreshContent="getReportHandle" v-loading="loading"></wang-editor>
    <span slot="footer" class="dialog-footer">
      <el-upload :action="upReportUrl" style="display:inline-block"
                 :data="{'projectNo': this.projectNo}"
                 :limit="1"
                 name="file"
                 ref="upload"
                 accept=".doc,.docx"
                 :headers="tokenHeaders"
                 :before-upload="handleBeforeUpload"
                 :on-success="handleSuccess"
                 :on-error="handleError">
          <el-button type="success" >上传Word文件</el-button>
        </el-upload>
<!--      <el-button type="success" @click="putWordHandle">上传Word文件</el-button>-->
      <el-button type="primary" @click="saveReportHandle">保 存</el-button>
      <el-button @click="closeHandle">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import WangEditor from '@/components/WangEditor'
  import Vue from 'vue'

  export default {
    name: 'qualityedit-add-or-update',
    data () {
      return {
        id: 'qualityEditor',
        ueContent: '',
        projectNo: '',
        visible: false,
        loading: false,
        upReportUrl: window.SITE_CONFIG['baseUrl'] + '/project/quality/uploadWord/',  // 合同上传地址
        tokenHeaders: { token: Vue.cookie.get('token') }  // token请求
      }
    },
    components: {
      WangEditor
    },
    methods: {
      init (content,projectNo) {
        // if (this.editor !== '') this.editor.empty()
        this.projectNo = projectNo
        this.visible = true
        this.ueContent = content
      },
      // 关闭
      closeHandle () {
        this.visible = false
        this.$emit('refreshReport', this.ueContent)
      },
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 设置报告内容
      saveReportHandle () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`/project/quality/saveTemp`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'qualityReport': this.ueContent
          })
        }).then(({data}) => {
          this.loading = false
          if (data && data.code === 0) {
            this.$message({
              message: '保存成功！',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleBeforeUpload (res) {
        this.loading = true
      },
      handleError (res) {
        this.loading = false
      },
      // 文件上传成功时的钩子
      handleSuccess (res, file, fileList) {
        this.ueContent = res.msg
        this.loading = false
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
