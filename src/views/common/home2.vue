<template>
  <div class="mod-home">
    <el-card >
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

      <div align="center" >
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
        <!-- 基本信息表 -->
        <table border="1" bordercolor="black" width="300" cellspacing="0" cellpadding="3" v-loading="dataLoading">
          <tr>
            <td colspan="6" style="height:70px;text-align:center;font-size:24px;font-weight: bold;">
              基本信息
            </td>
            <td rowspan="4">
              <div style="width:170px;">
                <img :src="userDetail.headImg" alt style="width:100%; height:202px;" />
              </div>
            </td>
          </tr>

          <tr>
            <td class="tps">
              姓名
            </td>
            <td class="ctps" style="min-width: 140px;">
              {{userDetail.username}}
            </td>
            <td class="tps">
              性别
            </td>
            <td v-if="userDetail.sex == 1"  style="text-align:center;font-size:18px;min-width:91px;">男</td>
            <td v-if="userDetail.sex == 2"  style="text-align:center;font-size:18px;min-width:91px;">女</td>
            <td v-if="userDetail.sex !== 1 && userDetail.sex !== 2"  style="text-align:center;font-size:18px;width:70px;"></td>
            <td class="tps" >
              出生日期
            </td>
            <td style="text-align:center;font-size:17px;min-width:120px;">
              {{userDetail.birthday}}
            </td>
          </tr>
          <tr>
            <td class="tps">
              身份证号码
            </td>
            <td colspan="2" class="ctps" style="min-width: 250px;">
              {{userDetail.idNo}}
            </td>
            <td>
              <div class="tps">籍贯</div>
            </td>
            <!--这里不要更改-->
            <td colspan="2" class="ctps" style="min-width:180px;">
              {{getPlaceName(userDetail.nativeProvince,userDetail.nativeCity)}}
            </td>
          </tr>

          <tr>
            <td class="tps">
              联系电话
            </td>
            <td colspan="2" class="ctps" style="width: 250px;">
              {{userDetail.mobile}}
            </td>
            <td class="tps">
              邮箱
            </td>
            <td colspan="2" class="ctps" style="width: 250px;">
              {{userDetail.email}}
            </td>
          </tr>

          <tr>
            <td class="tps">
              婚姻状况
            </td>
            <td>
              <div class="ctps" style="width:140px;" v-if="userDetail.maritalStatus == 0">未婚</div>
              <div class="ctps" style="width:140px;" v-if="userDetail.maritalStatus == 1">已婚</div>
              <div class="ctps" style="width:140px;" v-if="userDetail.maritalStatus == 2">离异</div>
              <div class="ctps" style="width:140px;" v-if="userDetail.maritalStatus == 3">丧偶</div>
            </td>
            <td>
              <div class="tps">工作类型</div>
            </td>
            <td colspan="2">
              <div class="ctps" style="width:170px;" v-if="userDetail.jobType == 1">全职</div>
              <div class="ctps" style="width:170px;" v-if="userDetail.jobType == 2">兼职</div>
              <div class="ctps" style="width:170px;" v-if="userDetail.jobType == 3">实习</div>
            </td>
            <td class="tps">
              住房类型
            </td>
            <td>
              <div class="ctps" style="width:170px;" v-if="userDetail.houseType == 1">本地居民</div>
              <div class="ctps" style="width:170px;" v-if="userDetail.houseType == 2">租房</div>
            </td>
          </tr>
          <tr>
            <td><div class="tps">入职时间</div></td>
            <td class="ctps">{{userDetail.entryTime}}</td>
            <td class="tps">职称</td>
            <td colspan="2" class="ctps" style="width:170px;">{{userDetail.titleName}}</td>
            <td class="tps">职务</td>
            <td class="ctps" style="width:170px;" >{{userDetail.duty}}</td>
          </tr>
          <tr>
            <td><div class="tps">最高学历</div></td>
            <td class="tps">{{userDetail.edName}}</td>
            <td class="tps">学制</td>
            <td colspan="2" class="ctps">{{userDetail.edType}}</td>
            <td class="tps">专业系数</td>
            <td class="ctps">{{userDetail.proItem}}</td>
          </tr>

          <!--教育背景模块-->
          <tr>
            <td colspan="7" class="onetdtitlestyle">教育背景</td>
          </tr>
          <tr>
            <td colspan="2" class="tps">起止时间</td>
            <td colspan="3" class="tps">毕业学校</td>
            <td colspan="1" class="tps">学历</td>
            <td colspan="1" class="tps">专业</td>
          </tr>
          <!--教育背景动态数据-->
          <tr v-for="(v,i) in edBackgroundList" :key="i">
            <td colspan="2"  class="ctpslasttwo" style="margin-left:30px;">
              {{v.startDate}}&nbsp;至&nbsp;{{v.endDate}}
            </td>
            <td colspan="3" class="ctpslasttwo" style="margin-left: 30px;">
              {{v.educationSchool}}
            </td>
            <td colspan="1"  class="ctpslasttwo" style="margin-left:30px;">
              {{v.educationBackground}}
            </td>
            <td colspan="1"  class="ctpslasttwo" style="margin-left:30px;">
              {{v.major}}
            </td>
          </tr>

          <!--工作经历模块-->
          <tr>
            <td colspan="7" class="onetdtitlestyle">
              工作经历
            </td>
          </tr>
          <tr>
            <td colspan="2" class="tps">
              起止时间
            </td>
            <td colspan="3" class="tps">
              工作单位名称
            </td>
            <td colspan="1" class="tps">
              职务
            </td>
            <td colspan="1" class="tps">
              工作内容
            </td>

          </tr>
          <!--工作经历动态数据-->
          <tr v-for="(v,i) in workBackgroundList" :key="i">
            <td colspan="2"  class="ctpslasttwo" style="margin-left:30px;">
              <!--{{v.startDate}}&nbsp;至&nbsp;{{v.endDate}}-->
              {{v.startDate}}
              至 <span v-if="v.endDate == null">今</span>
              <span v-else>{{v.endDate}}</span>
            </td>
            <td colspan="3" class="ctpslasttwo" style="margin-left:30px;">
              {{v.company}}
            </td>
            <td colspan="1"  class="ctpslasttwo" style="margin-left:30px;">
              {{v.jobPosition}}
            </td>
            <td colspan="1"  class="ctpslasttwo" style="margin-left:30px;">
              {{v.jobDescription}}
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
        dataLoading: false,
        placeOptions: provinceAndCityData,
        rencordTempVisible: false,
        updatePassowrdVisible: false,
        auditvisible: false,
        edBackgroundList: [],
        workBackgroundList: [],
        proItemList: [],
        edItemList: [],
        edTypeItemList: [],
        dutyItemList: [], // 职务列表
        titleItemList: [], // 职称列表
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
    created () {
      this.dataLoading = true
      // 学历对照表信息
      this.getScoreEdList(1).then(edTypeList => {
        this.getScoreEdList(2).then(proList => {
          this.getScoreEdList(3).then(edItemList => {
            this.getTitleList().then(titleList => {
              this.getScoreDutyList().then(dutyList => {
                this.edTypeItemList = edTypeList
                this.proItemList = proList
                this.edItemList = edItemList
                this.titleItemList = titleList
                this.dutyItemList = dutyList
                this.getUserDetailFromApi()
              })
            })
          })
        })
      })
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
            this.dataLoading = false
            this.userDetail = data.renRecordVo
            this.userDetail.edName = this.edItemList.find(item => item.id === data.renRecordVo.education).scoreName
            this.userDetail.edType = this.edTypeItemList.find(item => item.id === data.renRecordVo.educationType).scoreName
            this.userDetail.proItem = this.proItemList.find(item => item.id === data.renRecordVo.proRatio).scoreName
            this.userDetail.titleName = this.titleItemList.find(item => item.id === data.renRecordVo.titleLever).jobTitle
            this.userDetail.duty = this.dutyItemList.find(item => item.id === data.renRecordVo.dutyId).duty
            this.edBackgroundList = this.userDetail.edBackgroundList
            this.workBackgroundList = this.userDetail.workBackgroundList
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
      // 获取学历对照表
      getScoreEdList (cateId) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoreed/list'),
            method: 'get',
            params: this.$http.adornParams({
              cateId: cateId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 获取职称表
      getTitleList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoretitle/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 获取职务列表
      getScoreDutyList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/scoreduty/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.list)
            }
          })
        })
      },
      // 编辑个人资料
      editRecordHandle () {
        this.rencordTempVisible = true
        this.$nextTick(() => {
          this.$refs.rencordTempAddOrUpdate.init(this.userId, 0)
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
          clearLoginInfo()
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      // 获取省市名称
      getPlaceName (nProvinceId, nCityId) {
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

  .tps {
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
    font-size: 21px; height: 35px;
    line-height: 35px;
    font-family: Arial, Verdana, Sans-serif;
    font-weight: bold;
    text-align: center;
  }
  .ctps {
    font-family: 宋体;
    font-style: normal;
    font-size: 18px;
    text-align: center;

  }
  .ctpslasttwo {
    padding: 2px;
    font-family: 宋体;
    color: rgb(0, 0, 0);
    font-style: normal;
    font-size: 16px;
    text-align: center;
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
