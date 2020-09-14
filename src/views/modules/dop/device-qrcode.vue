<template>
  <el-dialog title="二维码" :visible.sync="visible">
    <div style="text-align: center">
      <div ref="codeTopic" class="code_img">
        <div ref="qrCode"></div>
        <div class="code_text">{{deviceName + '(' + qrTxt + ')'}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downQrCodeHandle()">下载</el-button>
      <el-button @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import html2canvas from 'html2canvas'

  export default {
    data () {
      return {
        visible: false,
        deviceName: '',
        qrTxt: '', // 二维码内容
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.qrTxt = item.factoryNum
        this.deviceName = item.deviceName
        this.$nextTick(() => {
          this.$refs.qrCode.innerHTML = ''
          this.qrShowHandle()
        })
      },
      // 二维码显示
      qrShowHandle () {
        new QRCode(this.$refs.qrCode, {
          text: this.qrTxt,
          render: 'canvas',
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })
      },
      // 下载
      downloadFile (fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content)
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true)
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)
        aLink.click()
      },
      // base64转blob
      base64ToBlob (code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {type: contentType})
      },
      // 下载二维码
      downQrCodeHandle () {
        html2canvas(this.$refs.codeTopic, {})
          .then((canvas) => {
            let imgData = canvas.toDataURL('image/png') // 将canvas转成base64图片格式
            let name = this.deviceName + '(' + this.qrTxt + ')'
            this.downloadFile(name, imgData)
          })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .code_Topic {
    text-align: center;
  }
  .code_text {
    color: $navbar--background-color;
    font-size:13px;
    font-weight:700;
    margin-top: 3px;
  }
  .code_img {
    padding: 14px;
    width:230px;
    text-align:center;
    margin-top: 10px;
    margin-left: 50%;
    transform: translate(-50%,0);
  }
</style>
