<template>
  <div class="mod-home">
    <el-card>
      <h1>个人中心</h1>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-row :gutter="20"><el-col :span="4"><span class="span_row">账号：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.useraccount}}</span></el-col></el-row>
          <el-row :gutter="20"><el-col :span="4"><span class="span_row">姓名：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.username}}</span></el-col></el-row>
          <el-row :gutter="20">
            <el-col :span="4"><span class="span_row">所属角色：</span></el-col>
            <el-col :span="8"><span><el-tag v-for="(item,index) in userDetail.roleList" :key="index" style="margin-left: 5px;">{{item}}</el-tag></span></el-col>
          </el-row>
          <el-row :gutter="20"><el-col :span="4">
            <span class="span_row">所属工作组：</span></el-col>
            <el-col :span="8"><span><el-tag v-for="(item,index) in userDetail.groupList" :key="index" style="margin-left: 5px;">{{item}}</el-tag></span></el-col>
          </el-row>
        </el-col>
        <el-col :span="6"><img src="~@/assets/img/avatar.png"  style="height:250px;"/></el-col>
      </el-row>
    </el-card>

    <div class="bottom_btn">
      <el-button type="primary" size="large" @click="updatePasswordHandle">修改密码</el-button>
      <el-button type="danger" size="large" @click="logoutHandle">退出</el-button>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </div>
</template>

<script>
  import UpdatePassword from '../main-navbar-update-password'
  import momnet from 'moment'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        userDetail: ''
      }
    },
    components: {
      UpdatePassword
    },
    activated () {
      this.getUserDetailFromApi()
    },
    methods: {
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl('/sys/userdetail/info'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userDetail = data.userDetailVo
          } else {
          }
        })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'login' })
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
  .span_row{
    font-size: 15px;
    font-weight: 500;
  }
  .font_span{
    color: #3787ee;
  }
  .bottom_btn{
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
</style>
