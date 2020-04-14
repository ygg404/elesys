<template>
  <div style="text-align:left"  :id="id" :ref="id"></div>
</template>

<script>
  import E from 'wangeditor'

  export default {
    name: 'wang-editor',
    props: {
      // 编辑器内容
      content: {
        type: String,
        default: ''
      },
      // 编辑器id
      id: {
        type: String,
        default: 'WeditorId'
      }
    },
    data () {
      return {
        editor: ''
      }
    },
    mounted () {
      this.initEditor()
    },
    activated () {
      // keep-alive 进入时创建
      this.initEditor()
    },
    deactivated () {
      // keep-alive 离开时移除
      // this.$refs.WeditorId.empty()
    },
    beforeDestroy () {
      // 实例销毁之前移除
      // this.$refs.WeditorId.empty()
    },
    methods: {
      initEditor () {
        this.editor = new E('#' + this.id)
        this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        // this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024 // 将图片大小限制为 1M
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        this.editor.customConfig.onchange = (html) => {
          this.content = html
          this.$emit('refreshContent', html)
        }
        this.editor.create()  // 生成编辑器
        this.editor.$textContainerElem.css('height', '500px') // 设置高度
        this.editor.txt.html(this.content)
      }
    }
  }
</script>

<style scoped>

</style>
