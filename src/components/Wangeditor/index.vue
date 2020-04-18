<template>
  <div style="text-align:left"  :id="id" :ref="id" v-loading="loadingVisible" element-loading-text="图片上传中......">
<!--    <el-dialog append-to-body :visible="loadingVisible" style="opacity: 0.8">-->
<!--      <div style="text-align: center;">-->
<!--&lt;!&ndash;        <el-progress type="circle" :percentage="curRate"></el-progress>&ndash;&gt;-->
<!--        <div style="color: #00b7ee"> 图片上传中 {{'。。。。。。' .substring(0,value)}}</div>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>

</template>

<script>
  import E from 'wangeditor'
  import Vue from 'vue'

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
      },
      // 编辑的项目编号
      projectNo: {
        type: String,
        default: 'No'
      }
    },
    data () {
      return {
        editor: '',
        loadingVisible: false,
        timer: '',
        value: 0
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
        let that = this
        this.editor = new E('#' + this.id)
        this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
        this.editor.customConfig.uploadImgServer = window.SITE_CONFIG['baseUrl'] + '/project/quality/uploadEditorImg'
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 // 将图片大小限制为 3M
        this.editor.customConfig.uploadImgTimeout = 2 * 60 * 1000 // 设置超时时间
        this.editor.customConfig.uploadImgParams = {
          projectNo: this.projectNo
        }
        this.editor.customConfig.uploadImgHeaders = {
          'token': Vue.cookie.get('token')
        }
        this.editor.customConfig.onchange = (html) => {
          this.content = html
          this.$emit('refreshContent', html)
        }
        // 设置上传本地图片的钩子事件
        this.editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
            that.value = 0
            that.timer = setInterval(function () {
              that.value += 1
            }, 200)
            that.loadingVisible = true
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            that.editor.cmd.do('insertHtml', '<img src="' + window.SITE_CONFIG['uploadUrl'] + 'report/' + result.imgName + '" style="max-width:100%;"/>')
            that.$message('上传图片成功！')
            that.loadingVisible = false
            clearInterval(that.timer)
          },
          fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            that.$message.error('上传图片失败！')
            that.loadingVisible = false
            clearInterval(that.timer)
          },
          error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            that.$message.error('上传图片失败！')
            that.loadingVisible = false
            clearInterval(that.timer)
          },
          timeout: function (xhr, editor) {
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            that.loadingVisible = false
            that.$message.error('上传图片超时！')
            clearInterval(that.timer)
          },
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
        this.editor.create()  // 生成编辑器
        this.editor.$textContainerElem.css('height', '500px') // 设置高度
        this.editor.txt.html(this.content)
        // 设置监听粘贴板内容
        // const IDS = document.getElementById(this.editor.textElemId)
        // IDS.addEventListener('paste', (e) => {
        //   let clipboard = e.clipboardData
        //   let type = clipboard.items[0].type
        //   if (type.match(/image/)) {
        //     // 如果是图片文件 则上传到服务器
        //     let blob = clipboard.items[0].getAsFile()
        //     let file = new FileReader()
        //     file.addEventListener('loadend', function (e) {
        //       that.upReportImgHandle( e.target.result )
        //     })
        //     file.readAsDataURL(blob)
        //   }
        // })
      },
      upReportImgHandle (base64Img) {
        let that = this
        let urlpath = window.SITE_CONFIG['uploadUrl']
        this.loadingVisible = true
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/uploadImg/`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectNo,
              'base64Img': base64Img
            }),
            onUploadProgress (proEvent) {
              that.curRate = parseInt(proEvent.loaded * 100 / proEvent.total)
            }
          }).then(({data}) => {
            this.loadingVisible = false
            if (data && data.code === 0) {
              this.$message(data.msg)
              this.editor.cmd.do('insertHtml', '<img src="' + urlpath + 'report/' + data.imgName + '" style="max-width:100%;"/>')
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
            this.curRate = 0
          })
        })
      }

    }
  }
</script>

<style scoped>

</style>
