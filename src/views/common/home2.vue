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
        <table border="1" bordercolor="black" width="300" cellspacing="0" cellpadding="3">
          <tr>
            <td colspan="6" style="height:70px;">
              <div class="onetdtitlestyle" style="font-size:26px;">基本信息</div>
            </td>
            <td rowspan="4">
              <div style="width:170px;">
                <img :src="userDetail.headImg" alt style="width:100%; height:202px;" />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="titlepstyle">姓名</div>
            </td>
            <td>
              <div
                class="contentpstyle"
                style="width: 80px;margin-left:35px;"
              >{{userDetail.username}}</div>
            </td>
            <td>
              <div class="titlepstyle">性别</div>
            </td>
            <td>
              <div class="contentpstyle" style="width:70px;" v-if="userDetail.sex == 1">男</div>
              <div class="contentpstyle" style="width:70px;" v-if="userDetail.sex == 2">女</div>
            </td>
            <td>
              <div class="titlepstyle">出生年月</div>
            </td>
            <td>
              <div class="contentpstyle" style="width:140px;">{{userDetail.birthday}}</div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="titlepstyle">身份证号码</div>
            </td>
            <td colspan="2">
              <div
                class="contentpstyle"
                style="width: 250px; font-size: 18px;"
              >{{userDetail.idNo}}</div>
            </td>
            <td>
              <div class="titlepstyle">籍贯</div>
            </td>
            <td colspan="2">
              <div
                class="contentpstyle"
                style="width:180px;"
              >{{getPlaceName(userDetail.nativeProvince,userDetail.nativeCity)}}</div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="titlepstyle">联系方式</div>
            </td>
            <td colspan="2">
              <div
                class="contentpstyle" style="width: 250px; font-size: 18px;"
              >{{userDetail.mobile}}</div>
            </td>
            <td>
              <div class="titlepstyle">邮箱</div>
            </td>
            <td colspan="2">
              <div class="contentpstyle" style="width:200px; font-size: 18px;">{{userDetail.email}}</div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="titlepstyle">婚姻状况</div>
            </td>
            <td>
              <div
                class="contentpstyle"
                style="width:140px;"
                v-if="userDetail.maritalStatus == 0"
              >未婚</div>
              <div
                class="contentpstyle"
                style="width:140px;"
                v-if="userDetail.maritalStatus == 1"
              >已婚</div>
              <div
                class="contentpstyle"
                style="width:140px;"
                v-if="userDetail.maritalStatus == 2"
              >离异</div>
              <div
                class="contentpstyle"
                style="width:140px;"
                v-if="userDetail.maritalStatus == 3"
              >丧偶</div>
            </td>
            <td>
              <div class="titlepstyle">工作类型</div>
            </td>
            <td colspan="2">
              <!-- <div class="contentpstyle" style="width:170px;">全职</div> -->
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.jobType == 1"
              >全职</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.jobType == 2"
              >兼职</div>
            </td>
            <td>
              <div class="titlepstyle">住房类型</div>
            </td>
            <td>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.houseType == 1"
              >本地居民</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.houseType == 2"
              >租房</div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="titlepstyle">入职时间</div>
            </td>
            <td>
              <div class="contentpstyle" style="margin-left:20px;font-size: 18px;">{{userDetail.entryTime}}</div>
            </td>
            <td>
              <div class="titlepstyle">最高学历</div>
            </td>
            <td colspan="2">
              <!-- <div class="contentpstyle" style="width:170px;">{{userDetail.education}}</div> -->
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 0"
              >无</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 1"
              >小学</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 2"
              >初中</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 3"
              >中专</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 4"
              >高中</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 5"
              >职高</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 6"
              >专科</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 7"
              >本科</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 8"
              >硕士研究生</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.education == 9"
              >博士研究生</div>
            </td>
            <td>
              <div class="titlepstyle">职位</div>
            </td>
            <td>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 0"
              >无</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 1"
              >技术员</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 2"
              >助理工程师</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 3"
              >中级工程师</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 4"
              >高级工程师</div>
              <div
                class="contentpstyle"
                style="width:170px;"
                v-if="userDetail.titleLever == 5"
              >正高级工程师</div>
            </td>
          </tr>

          <!--教育背景模块-->
          <tr>
            <td colspan="7">
              <div class="onetdtitlestyle">教育背景</div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="titlepstyle" style="margin-left:80px;">起止时间</div>
            </td>
            <td colspan="3">
              <div class="titlepstyle" style="margin-left:100px;">毕业学校</div>
            </td>
            <td colspan="1">
              <div class="titlepstyle" >
                <p style="width:140px;">学历</p>
              </div>
            </td>
            <td colspan="1">
              <div class="titlepstyle" >
                <p style="width:140px;"> 专业</p>
              </div>
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
              <div class="contentpstylelasttwo" style="margin-left: 30px;">{{v.educationSchool}}</div>
            </td>
            <td colspan="1">
              <div
                class="contentpstylelasttwo"
                style="margin-left:30px;"
              >{{v.educationBackground}}</div>
            </td>
            <td colspan="1">
              <div
                class="contentpstylelasttwo"
                style="margin-left:30px;"
              >{{v.major}}</div>
            </td>
          </tr>

          <!--工作经历模块-->
          <tr>
            <td colspan="7">
              <div class="onetdtitlestyle">工作经历</div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="titlepstyle" style="margin-left:80px;">起止时间</div>
            </td>
            <td colspan="3">
              <div class="titlepstyle" style="margin-left:80px;">
                <p style="width:150px;">工作单位名称</p>
              </div>
            </td>
            <td colspan="1">
              <div class="titlepstyle" >
                <p style="width:140px;">职务</p>
              </div>
            </td>
            <td colspan="1">
              <div class="titlepstyle" >
                <p style="width:140px;"> 工作内容</p>
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
            <td colspan="1">
              <div
                class="contentpstylelasttwo"
                style="margin-left:30px;"
              >{{v.jobPosition}}</div>
            </td>
            <td colspan="1">
              <div
                class="contentpstylelasttwo"
                style="margin-left:30px;"
              >{{v.jobDescription}}</div>
            </td>
          </tr>
        </table>
      </div>

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
      this.edBackgroundList = this.userDetail.edBackgroundList
      this.workBackgroundList = this.userDetail.workBackgroundList
      if (this.userDetail === '') this.getUserDetailFromApi()
    },
    methods: {
      // 获取个人信息
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/info/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.userDetail = data.renRecordVo
          } else {
            this.$message.error(data.msg)
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
  .home_title{
    font-size: 14pt;
    font-weight: 700;
  }

  .titlepstyle {
    height: 30px;
    width: 90px;
    line-height: 30px;
    font-size: 15.5px;
    font-family: 微软雅黑;
    text-align: center;
    /* font-weight: 540; */
    font-weight: bold;
  }
  .onetdtitlestyle {
    height: 35px;
    width: 105px;
    line-height: 35px;
    font-size: 21px;
    font-family: Arial, Verdana, Sans-serif;
    font-weight: bold;
    text-align: center;
    margin-left: 350px;
  }
  .contentpstyle {
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
  /**审核图片样式 */
  .audit_img_style {
    width: 150px;
    height: 120px;
    position: absolute;
    left: 70px;
  }
  /**审核意见卡片样式 */
  .audit_opinion_card {
    width: 150px;
    height: 100px;
    position: absolute;
    left: 30px;
    top: 200px;
  }
  /**审核意见标题样式 */
  .title_of_audit_opinion_style {
    float: left;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  /**审核意见内容样式 */
  .contents_of_audit_opinions_style {
    float: left;
    font: 13px Extra Small;
    margin-left: 22px;
  }
</style>
