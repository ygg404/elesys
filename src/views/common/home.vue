<template>
  <div class="mod-home">
    <el-card>
      <div slot="header" class="clearfix">
        <div class="home_header_line">
          <span class="home_title">个人中心</span>

          <div style="float: right; ">
            <el-button type="primary" icon="el-icon-edit" @click="editRecordHandle">编辑个人资料</el-button>
            <el-button type="primary" icon="el-icon-key" @click="updatePasswordHandle">修改密码</el-button>
            <el-button type="danger" icon="el-icon-s-home"  @click="logoutHandle">退出</el-button>
          </div>
        </div>
      </div>
      <div align="center">
        <div v-if="userDetail.isAudit != null" style="font-size: 12pt;"><span>审核状态：</span>
          <el-popover placement="top" width="160" v-model="auditvisible" v-if="userDetail.isAudit == 2" title="审核反馈意见">
            <p style="color: red">{{userDetail.auditMsg}}</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="auditvisible = false">确定</el-button>
            </div>
            <span  slot="reference" type="danger" class="home_text_unpassed">未通过</span>
          </el-popover>
          <el-tag type="success" v-if="userDetail.isAudit == 1">已通过</el-tag>
          <el-tag  v-if="userDetail.isAudit == 0" type="warning">未审核</el-tag>
          <el-button v-if="userDetail.isAudit == 0" type="warning" size="small" @click="deleteAudit()"> 撤销审核 </el-button>
        </div>
        <table class="MsoNormalTable" border="0" cellspacing="0"
               style="border-collapse:collapse;width:590.9000pt;margin-left:4.6500pt;border:none;mso-padding-alt:0.0000pt 0.0000pt 0.0000pt 0.0000pt ;">
          <tbody>
          <table border="1" bordercolor="black" width="300" cellspacing="0" cellpadding="3">
            <tr>
              <td>
                <div class="titlepstyleh50">姓名</div>
              </td>
              <td>
                <div
                  class="contentpstyleh50"
                  style="width: 82px;margin-left:65px;"
                >{{userDetail.username}}</div>
              </td>
              <td>
                <div class="titlepstyleh50">性别</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width:82px;">
                  {{userDetail.sex === 1? '男':(userDetail.sex === 2?'女':'')}}
                </div>
              </td>
              <td>
                <div class="titlepstyleh50">出生日期</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width:140px;">{{userDetail.birthday}}</div>
              </td>
              <td rowspan="3">
                <div style="width:170px;">
                  <img :src='userDetail.headImg' class="card_detail_img" />
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="titlepstyleh50">身份证号码</div>
              </td>
              <td colspan="2">
                <div
                  class="contentpstyleh50"
                  style="width: 280px;  font-size: 20px;"
                >{{userDetail.idNo}}</div>
              </td>
              <td>
                <div class="titlepstyleh50">籍贯</div>
              </td>
              <td colspan="2">
                <div class="contentpstyleh50" style="width:180px;">{{getPlaceName(userDetail.nativeProvince, userDetail.nativeCity)}}</div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="titlepstyleh50">联系方式</div>
              </td>
              <td colspan="2">
                <div
                  class="contentpstyleh50"
                  style="margin-left:26px;width:170px; font-size: 20px;"
                >{{userDetail.mobile}}</div>
              </td>
              <td>
                <div class="titlepstyleh50">邮箱</div>
              </td>
              <td colspan="2">
                <div
                  class="contentpstyleh50"
                  style="width:200px; font-size: 20px;"
                >{{userDetail.email}}</div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="titlepstyleh50">婚姻状况</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width:170px;">
                  {{userDetail.maritalStatus === 0? '未婚':
                  (userDetail.maritalStatus === 1?'已婚':'')}}
                </div>
              </td>
              <td>
                <div class="titlepstyleh50">工作类型</div>
              </td>
              <td colspan="2">
                {{userDetail.jobType === 1? '全职':(userDetail.jobType === 2?'兼职':'')}}
              </td>
              <td>
                <div class="titlepstyleh50">住房类型</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width:170px;">租房</div>
              </td>
            </tr>

            <tr>
              <td>
                <div class="titlepstyleh50">入职时间</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width: 150px;">{{userDetail.entryTime}}</div>
              </td>
              <td>
                <div class="titlepstyleh50">所属部门</div>
              </td>
              <td colspan="2">
                <div class="contentpstyleh50" style="width:170px;">地信部</div>
              </td>
              <td>
                <div class="titlepstyleh50">职位</div>
              </td>
              <td>
                <div class="contentpstyleh50" style="width:170px;">程序员</div>
              </td>
            </tr>

            <!--教育背景模块-->
            <tr>
              <td colspan="7">
                <div class="titlepstylelasttwo" style="margin-left:400px;">教育背景</div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="titlepstyleh50" style="margin-left:80px;">起止时间</div>
              </td>
              <td colspan="3">
                <div class="titlepstyleh50" style="margin-left:80px;">毕业学校</div>
              </td>
              <td colspan="2">
                <div class="titlepstyleh50" style="margin-left:80px;">学历和专业</div>
              </td>
            </tr>
            <!--教育背景动态数据-->
            <tr v-for="(v,i) in edBackgroundList" :key="i">
              <td colspan="2">
                <div
                  class="contentpstylelasttwo"
                  style="margin-left:30px;"
                >{{v.startDate}}&nbsp;至&nbsp;{{v.endDate}}</div>
              </td>
              <td colspan="3">
                <div class="contentpstylelasttwo" style="margin-left:30px;">{{v.educationSchool}}</div>
              </td>
              <td colspan="2">
                <div
                  class="contentpstylelasttwo"
                  style="margin-left:30px;"
                >{{v.educationBackground}}&nbsp;&nbsp;{{v.major}}</div>
              </td>
            </tr>

            <!--工作经历模块-->
            <tr>
              <td colspan="7">
                <div class="titlepstylelasttwo" style="margin-left:400px;">工作经历</div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="titlepstyleh50" style="margin-left:80px;">起止时间</div>
              </td>
              <td colspan="3">
                <div class="titlepstyleh50" style="margin-left:80px;">
                  <p style="width:150px;">工作单位名称</p>
                </div>
              </td>
              <td colspan="2">
                <div class="titlepstyleh50" style="margin-left:80px;">
                  <p style="width:150px;">职务与工作内容</p>
                </div>
              </td>
            </tr>
            <!--工作经历动态数据-->
            <tr v-for="(v,i) in workBackgroundList" :key="i">
              <td colspan="2">
                <div
                  class="contentpstylelasttwo"
                  style="margin-left:30px;"
                >{{v.startDate}}&nbsp;至&nbsp;{{v.endDate}}</div>
              </td>
              <td colspan="3">
                <div class="contentpstylelasttwo" style="margin-left:30px;">{{v.company}}</div>
              </td>
              <td colspan="2">
                <div
                  class="contentpstylelasttwo"
                  style="margin-left:30px;"
                >{{v.jobPosition}}&nbsp;&nbsp;{{v.addressA}}</div>
              </td>
            </tr>
          </table>
          </tbody>
        </table>
      </div>
      <!--<el-row :gutter="20">-->
        <!--<el-col :span="18">-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">账号：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.useraccount}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4"><span class="span_row">姓名：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.username}}</span></el-col></el-row>-->
          <!--<el-row :gutter="20">-->
            <!--<el-col :span="4"><span class="span_row">所属角色：</span></el-col>-->
            <!--<el-col :span="8"><span><el-tag v-for="(item,index) in userDetail.roleList" :key="index" style="margin-left: 5px;">{{item}}</el-tag></span></el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20"><el-col :span="4">-->
            <!--<span class="span_row">所属工作组：</span></el-col>-->
            <!--<el-col :span="8"><span><el-tag v-for="(item,index) in userDetail.groupList" :key="index" style="margin-left: 5px;">{{item}}</el-tag></span></el-col>-->
          <!--</el-row>-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4">&ndash;&gt;-->
            <!--&lt;!&ndash;<span class="span_row">登录时间：</span></el-col>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-col :span="8"><span class="font_span">{{loadTime}}</span></el-col>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4"><span class="span_row">生日：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.birthday}}</span></el-col></el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4"><span class="span_row">最高学历：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.education}}</span></el-col></el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4"><span class="span_row">毕业院校：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.graduateSchool}}</span></el-col></el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4"><span class="span_row">职称：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.professionalTitle}}</span></el-col></el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-row :gutter="20"><el-col :span="4"><span class="span_row">联系电话：</span></el-col><el-col :span="4"><span class="font_span">{{userDetail.mobile}}</span></el-col></el-row>&ndash;&gt;-->
        <!--</el-col>-->
        <!--<el-col :span="6"><img src="~@/assets/img/avatar.png"  style="height:250px;"/></el-col>-->
      <!--</el-row>-->
    </el-card>

    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <!-- 弹窗, 编辑个人资料 -->
    <rencord-temp-add-or-update v-if="rencordTempVisible" ref="rencordTempAddOrUpdate" @refreshDataList="getUserDetailFromApi"></rencord-temp-add-or-update>
  </div>
</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'
  import UpdatePassword from '../main-navbar-update-password'
  import RencordTempAddOrUpdate from '../modules/ren/recordtemp-add-or-update'
  import momnet from 'moment'
  import { clearLoginInfo } from '@/utils'

  export default {
    data () {
      return {
        placeOptions: provinceAndCityData,
        rencordTempVisible: false,
        updatePassowrdVisible: false,
        auditvisible: false,
        userDetail: '',
        edBackgroundList:[],
        workBackgroundList:[],
        loadTime: momnet(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    components: {
      UpdatePassword,
      RencordTempAddOrUpdate
    },
    computed: {
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userDetail: {
        get () { return this.$store.state.user.userDetail },
        set (val) { this.$store.commit('user/updateUserDetail', val) }
      }
    },
    activated () {
      // this.getUserDetailFromApi()
      this.edBackgroundList = this.userDetail.edBackgroundList
      this.workBackgroundList = this.userDetail.workBackgroundList
    },
    methods: {
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/info/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {

          } else {
          }
        })
      },
      // 撤销审核
      deleteAudit () {
        this.$confirm('是否撤销当前个人资料的编辑', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ren/recordtemp/deleteAudit'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '撤销成功',
                type: 'success',
                duration: 1500
              })
              this.getUserDetailFromApi()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 编辑个人资料
      editRecordHandle () {
        this.rencordTempVisible = true
        this.$nextTick(() => {
          this.$refs.rencordTempAddOrUpdate.init(this.userId , 0)
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
      },
      // 获取省市名称
      getPlaceName(nProvinceId, nCityId) {
        let pName = ''
        for (let provinceOption of this.placeOptions) {
          if (provinceOption.value === nProvinceId) {
            pName += provinceOption.label
            for (let cityOption of provinceOption.children) {
              if (cityOption.value === nCityId) pName += cityOption.label
            }
            break
          }
        }
        return pName
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
  .home_title{
    font-size: 18pt;
    font-weight: 700;
  }
  .home_header_line{
    display: flex;
    justify-content: space-between;
  }
  .home_text_unpassed{
    text-decoration:underline;
    cursor: pointer;
    color: red;
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
  .titlepstyleh50 {
    height: 50px;
    width: 105px;
    line-height: 50px;
    font-size: 17px;
    font-family: Arial, Verdana, Sans-serif;
    text-align: center;
    font-weight: 500;
  }
  .titlepstylelasttwo {
    height: 50px;
    width: 105px;
    line-height: 50px;
    font-size: 26px;
    font-family: Arial, Verdana, Sans-serif;
    text-align: center;
  }
  .contentpstyleh50 {
    padding: 2px;
    font-family: 宋体;
    color: rgb(0, 0, 0);
    font-style: normal;
    font-size: 18px;
    display: block;
    float: left;
    text-align: center;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    word-wrap: break-word;
  }
  .contentpstylelasttwo {
    padding: 2px;
    font-family: 宋体;
    color: rgb(0, 0, 0);
    font-style: normal;
    font-size: 16px;
    display: block;
    float: left;
    text-align: center;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    word-wrap: break-word;
  }
  .card_detail_img {
    min-width: 168px;
    min-height: 200px;
    width: 168px;
    height: 200px;
    border: 1px solid #00b7ee;
    border-radius: 10px;
  }
</style>

