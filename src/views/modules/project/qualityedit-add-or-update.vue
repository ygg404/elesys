<template>
  <el-dialog
    title="编辑质检反馈"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible">
    <wang-editor :content="ueContent" :id='id' :projectNo="projectNo" @refreshContent="getReportHandle"></wang-editor>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle">取 消</el-button>
      <el-button type="primary" @click="setReportHandle">确 定</el-button>
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
        visible: false
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
      },
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 设置报告内容
      setReportHandle () {
        this.visible = false
        this.$emit('refreshReport', this.ueContent)
      }
    }
  }
</script>

<style scoped>

</style>
