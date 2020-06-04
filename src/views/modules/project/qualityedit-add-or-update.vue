<template>
  <el-dialog
    title="编辑质检反馈"
    :close-on-click-modal="false"
    width="80%" v-loading="loading"
    :visible.sync="visible">
    <wang-editor :content="ueContent" :id='id' :projectNo="projectNo" @refreshContent="getReportHandle"></wang-editor>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle">返 回</el-button>
      <el-button type="primary" @click="saveReportHandle">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import WangEditor from '@/components/WangEditor'

  export default {
    name: 'qualityedit-add-or-update',
    data () {
      return {
        id: 'qualityEditor',
        ueContent: '',
        projectNo: '',
        visible: false,
        loading: false
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
      }
    }
  }
</script>

<style scoped>

</style>
