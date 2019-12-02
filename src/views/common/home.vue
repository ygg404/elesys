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
          <!--<el-row :gutter="20"><el-col :span="4">-->
            <!--<span class="span_row">登录时间：</span></el-col>-->
            <!--<el-col :span="8"><span class="font_span">{{loadTime}}</span></el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">生日：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.birthday}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">最高学历：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.education}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">毕业院校：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.graduateSchool}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">职称：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.professionalTitle}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">联系电话：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.mobile}}</span></el-col></el-row>-->
        </el-col>
        <el-col :span="6"><img src="~@/assets/img/avatar.png"  style="height:250px;"/></el-col>
      </el-row>
    </el-card>



  </div>
</template>

<script>
  import momnet from 'moment'

  export default {
    data () {
      return {
        userDetail: '',
        loadTime: momnet(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
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
</style>

