<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="login-main">
        <img src="~@/assets/img/logo.png"  class="login-main-img">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon style="margin-top: 20px;">
          <el-form-item prop="userName">
            <el-input v-model="dataForm.userAccount" placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button  class="login-btn-submit" :icon="loading==true?'el-icon-loading':''"  type="primary" @click="dataFormSubmit()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="site-bottom">
        <div>Copyright © 2020 gdjxch.cn All rights reserved.</div>
        <div><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
      </div>

    </div>

  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    data () {
      return {
        loading: false,
        dataForm: {
          userAccount: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userAccount: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
          // captcha: [
          //   { required: true, message: '验证码不能为空', trigger: 'blur' }
          // ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.dataForm.userAccount = this.$cookie.get('jxaccount')
      this.dataForm.password = this.$cookie.get('jxpwd')
      // this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'useraccount': this.dataForm.userAccount,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.$cookie.set('token', data.token)
                this.$cookie.set('jxaccount' , this.dataForm.userAccount)
                this.$cookie.set('jxpwd' , this.dataForm.password)
                this.$cookie.set('jxrole', '') // 项目管理默认角色为空
                this.$cookie.set('jxstartDate', '') // 选择时间（起始时间）
                this.$cookie.set('jxendDate', '') // 选择时间（结束时间）
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width:100%;
    height:100%;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-color: #0BB2D4;
      background-size:100% 100%;
      -moz-background-size:100% 100%;
      background-repeat:no-repeat;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 150px 500px 30px 30px;
      text-align: center;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      margin-left: 50%;
      transform: translate(-50%,0);
      align-items: center;
      border-radius: 20px;
      margin-top: 130px;
      padding: 20px 60px 50px;
      width: 470px;
      height: auto;
      background-color: #fff;
    }
    .login-main-img{
      width: 100%;
      height: auto;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 30px;
    }
    .site-bottom{
      margin-left: 50%;
      transform: translate(-50%,-50%);
      position: absolute;
      text-align: center;
      color: white;
      font-size: 11pt;
      font-weight: 500;
      width: 470px;
      bottom: 0;
      margin-bottom: 10px;
    }
    .site-bottom a{
      color: white
    }
  }
</style>
