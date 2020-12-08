<template>
  <el-dialog
    title="百度地图截取"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="upload-dialog">
      <a-modal title="图片裁剪" class="upload_dialog_a" v-model="isCropper" :on-ok="false" footer>
        <div class="vue-cropper-box">
          <div class="vue-cropper-content" style="height:600px;width:100%;">
            <a-row>
              <a-col :span="16">
                <vueCropper
                  style="height:600px;"
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="option.info"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :centerBox="option.centerBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :autoCropWidth="option.autoCropWidth"
                  :autoCropHeight="option.autoCropHeight"
                  :fixedBox="option.fixedBox"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber"
                  @realTime="realTime"
                  @imgLoad="imgLoad"
                ></vueCropper>
              </a-col>
              <a-col :span="8" style="padding-left:50px;">
                <div class="preview-box" >
                  <div>预览：</div>
                  <div
                    :style="previews.div"
                    class="preview"
                    style="overflow:hidden;border:1px solid #f1f1f1;"
                  >
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
                <div style="margin-top:20px;text-align:center;">
                  <a-button class="up_foot_button" style="display:inline-block;" type="primary" @click="onCubeImg">确认插入图片</a-button>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-modal>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        isCropper: false,
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 剪切后的图片质量（0.1-1）
          full: true, // 输出原图比例截图 props名full
          outputType: 'png', // 裁剪生成额图片的格式
          canMove: true, // 能否拖动图片
          original: true, // 上传图片是否显示原始宽高
          canMoveBox: true, // 能否拖动截图框
          centerBox: true, // 截图框是否限制在图片里面
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 180, // 默认生成截图框宽度
          autoCropHeight: 180, // 默认生成截图框高度
          fixedBox: false, // 截图框固定大小
          fixed: false
        }
      }
    },
    methods: {
      init (base64Img) {
        this.visible = true
        this.$nextTick(() => {
          this.option.img = base64Img
        })
      }
    }
  }
</script>

<style scoped>

</style>
