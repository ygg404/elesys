<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="login-main" v-loading="loading">
        <div>
          <img src="~@/assets/img/hlogo.png"  class="login-main-img">
          <span class="login-main-span">{{simpleName}}</span>
        </div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon style="margin-top: 20px;" >
          <el-form-item prop="userAccount">
            <el-input v-model="dataForm.userAccount" placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  class="login-btn-submit" :icon="loading==true?'el-icon-loading':''"  type="primary" @click="dataFormSubmit()">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="index-span">
          <div><a href="/#/index"> 《《 返回首页</a></div>
        </div>
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
    computed: {
      simpleName: {
        get () { return this.$store.state.common.simpleName },
        set (val) { this.$store.commit('common/updateSimpleName', val) }
      },
      sysName: {
        get () { return this.$store.state.common.sysName },
        set (val) { this.$store.commit('common/updateSysName', val) }
      },
      sysFlag: {
        get () { return this.$store.state.common.sysFlag },
        set (val) { this.$store.commit('common/updateSysFlag', val) }
      }
    },
    created () {
      this.getSysconfigFromApi().then(success =>{
        // 人事管理系统存放的cookie
        if (this.sysFlag === 'ren') {
          this.dataForm.userAccount = this.$cookie.get('jxRenAccount')
          this.dataForm.password = this.$cookie.get('jxRenPwd')
        } else {
          // 项目管理系统
          this.dataForm.userAccount = this.$cookie.get('jxaccount')
          this.dataForm.password = this.$cookie.get('jxpwd')
        }
      })
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
                this.$cookie.set('jxrole', '') // 项目管理默认角色为空
                this.$cookie.set('jxstartDate', '') // 选择时间（起始时间）
                this.$cookie.set('jxendDate', '') // 选择时间（结束时间）
                if (this.sysFlag === 'ren') {
                  this.$cookie.set('jxRenAccount' , this.dataForm.userAccount)
                  this.$cookie.set('jxRenPwd' , this.dataForm.password)
                  this.$router.replace({ name: 'home2' })
                } else {
                  this.$cookie.set('jxaccount' , this.dataForm.userAccount)
                  this.$cookie.set('jxpwd' , this.dataForm.password)
                  this.$router.replace({name: 'home'})
                }
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
      },
      // 获取参数列表
      getSysconfigFromApi () {
        this.loading = true
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/config/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (let dat of data.list) {
                switch (dat.paramKey) {
                  case 'sysName':
                    this.sysName = dat.paramValue
                    break
                  case 'sysFlag':
                    this.sysFlag = dat.paramValue
                    break
                  case 'simpleName':
                    this.simpleName = dat.paramValue
                    break
                  default:
                    break
                }
              }
              resolve(data)
              this.loading = false
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })

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
      margin-top: 90px;
      padding: 20px 50px 20px;
      width: 470px;
      height: auto;
      background-color: #fff;
    }
    .login-main .index-span{
      color: #3b97d7;
      font-weight: 500;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .login-main .index-span a{
      line-height: 200%;
      cursor: pointer;
      text-decoration:underline;
    }
    .login-main-img{
      width: 120px;
      height: auto;
    }
    .login-main-span{
      font-size: 40pt;
      font-weight: 300;
      vertical-align: middle;
      font-family:华文琥珀,arial,微软雅黑;
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
      margin-top: 10px;
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
    }
    .site-bottom a{
      color: white
    }
  }
</style>
