<template>
  <el-dialog
    :title="'项目签字二维码（' + projectInfo.projectNo + ')'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div v-loading="loading" class="code_content">
      <img :src="imgData" class="code_img"/>
      <div>{{projectInfo.projectName}}</div>
    </div>
    <div class="code_content" style="margin-top: 30px;">
      <span style="color:gray;">注: 请用微信扫描该二维码，并在该小程序的签名处签字！</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary" plain>返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        projectInfo: '',
        imgData: '',
        visible: false,
        loading: true
      }
    },
    methods: {
      init (item) {
        this.getWxQRImg(item.projectNo)
        this.projectInfo = item
        this.visible = true
      },
      // 获取微信小程序二维码（带项目编号）
      getWxQRImg (projectNo) {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/sys/wx/getWxQR'),
          method: 'get',
          params: this.$http.adornParams({
            'projectNo': projectNo
          })
        }).then(({data}) => {
          this.loading = false
          if (data && data.code === 0) {
            this.imgData = data.imgData
          } else {
            this.$message.error(data.msg)
          }
        })
      },
    }
  }
</script>

<style scoped>
  .code_content {
    text-align: center;
  }
  .code_img {
    width: 200px;
    height: 200px;
  }
</style>
