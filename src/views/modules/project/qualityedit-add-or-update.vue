<template>
  <el-dialog
    title="编辑质检报告"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible">
    <wang-editor ref="wangEditor" :content="ueContent" @refreshContent="getReportHandle"></wang-editor>
<!--    <div style="text-align:left"  id="editorElem"></div>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle">取 消</el-button>
      <el-button type="primary" @click="setReportHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import WangEditor from '@/components/WangEditor/index'

  export default {
    name: 'qualityedit-add-or-update',
    data () {
      return {
        ueContent: '',
        projectNo: '',
        visible: false
      }
    },
    components: {
      WangEditor
    },
    methods: {
      init (content) {
        // if (this.editor !== '') this.editor.empty()
        this.visible = true
        this.ueContent = content
        this.$refs.wangEditor.initContent(content)
        console.log(content)
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
