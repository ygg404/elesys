<template>
  <el-dialog width="80%" title='编辑个人档案'
             :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             v-loading="loading" :element-loading-text="loadingtext"  label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名" prop="username">
            <span style="color: #3b97d7">{{dataForm.username}}</span>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="dataForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="籍贯" prop="nativePlace">
            <el-cascader size="large" :options="placeOptions" v-model="dataForm.nativePlace" clearable
                         placeholder="请选择籍贯" @change="placeChangeHandle"></el-cascader>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱" class="card_detail_input"></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="entryTime">
            <el-date-picker v-model="dataForm.entryTime" type="date" value-format="yyyy-MM-dd" placeholder="入职时间"
                            class="card_detail_input"></el-date-picker>
          </el-form-item>
          <el-form-item label="工作类型" prop="jobType">
            <el-select v-model="dataForm.jobType" placeholder="请选择工作类型"  class="select_btn">
              <el-option v-for="item in jobItemList" :label="item.dateItem" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="idNo">
            <el-input v-model="dataForm.idNo" placeholder="身份证号" class="card_detail_input"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="dataForm.birthday" type="date" value-format="yyyy-MM-dd" placeholder="出生日期"
                            class="card_detail_input"></el-date-picker>
          </el-form-item>
          <el-form-item label="婚姻状况" prop="maritalStatus">
            <el-select v-model="dataForm.maritalStatus" placeholder="请选择婚姻状况" class="select_btn">
              <el-option v-for="item in maritalItemList" :label="item.dateItem" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号" class="card_detail_input"></el-input>
          </el-form-item>
          <el-form-item label="试用期(月)" prop="trialPeriod">
            <el-input v-model="dataForm.trialPeriod" type="number" min="0" max="12" placeholder="试用期（月）"
                      class="card_detail_input"></el-input>
          </el-form-item>
          <el-form-item label="住房类型" prop="houseType">
            <el-radio-group v-model="dataForm.houseType">
              <el-radio :label="1">本地居民</el-radio>
              <el-radio :label="2">租房</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="person_img" v-loading="imgLoading">
            <div class="img_content">
              <img :src="dataForm.headImg" alt="" />
              <div class="card_detail_img_add" >
                <i class="el-icon-plus addplus"></i>
                <div class="img_input">
                  <input type="file" accept="image/*" @change="compressImgHandle" ></input>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="职称等级" prop="titleLever" >
            <el-select v-model="dataForm.titleLever" placeholder="请选择职称等级" class="card_detail_input">
              <el-option v-for="item in titleItemList" :label="item.jobTitle" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>、
            <el-select v-model="dataForm.titlePro" placeholder="职称专业系数" class="card_detail_input" style="width: 130px;">
              <el-option v-for="item in titleProList" :label="item.jobTitle" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务" prop="dutyId">
            <el-select v-model="dataForm.dutyId" placeholder="请选择职务" class="card_detail_input" >
              <el-option v-for="item in dutyItemList" :label="item.duty" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="最高学历" prop="education">
            <el-select v-model="dataForm.education" placeholder="最高学历" class="card_detail_input"  style="width: 106px">
              <el-option v-for="item in edItemList" :label="item.scoreName" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>
            <el-select v-model="dataForm.educationType" placeholder="学制类型" class="card_detail_input" style="width: 110px">
              <el-option v-for="item in edTypeItemList" :label="item.scoreName" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>
            <el-select v-model="dataForm.proRatio" placeholder="专业系数" class="card_detail_input" style="width: 110px">
              <el-option v-for="item in proItemList" :label="item.scoreName" :key="item.id"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="毕业时间" prop="educationTime">
            <el-date-picker v-model="dataForm.educationTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>
      <el-row class="card_table_title">
        <div class="header">
          <span>教育背景</span>
          <el-button size="small" icon="el-icon-plus" style="color: #00a2d4" @click="edBackgroundAddHandle">添加教育背景
          </el-button>
        </div>
      </el-row>
      <el-row class="card_table_content">
        <el-table border :data="dataForm.edBackgroundList">
          <el-table-column prop="monthRangeDate" header-align="center" align="center" label="日期" width="318">
            <template slot-scope="scope">
              <el-date-picker v-model="scope.row.monthRangeDate" type="monthrange" start-placeholder="开始月份" end-placeholder="结束月份" ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="educationBackground" header-align="center" align="center" label="学历" width="120">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.educationBackground"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="educationSchool" header-align="center" align="center" label="学校">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.educationSchool"  ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="major" header-align="center" align="center" label="专业">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.major"></el-input>
            </template>
          </el-table-column>
          <el-table-column  header-align="center" align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="edBackgroundDeleteHandle(scope.row.edId)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="card_table_title">
        <div class="header"><span>工作经历</span>
          <el-button size="small" icon="el-icon-plus" style="color: #00a2d4" @click="workBackgroundAddHandle">添加工作经历
          </el-button>
        </div>
      </el-row>
      <el-row class="card_table_content">
        <el-table border :data="dataForm.workBackgroundList">
          <el-table-column  header-align="center" align="center" label="日期" width="318">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="11">
                  <div class="edp"><el-date-picker
                    v-model="scope.row.startDate"

                    type="month"
                    placeholder="开始日期">
                  </el-date-picker></div>
                </el-col>
                <el-col :span="2">
                  <div>-</div>
                </el-col>
                <el-col :span="11">
                  <div class="edp">
                    <el-date-picker
                      v-model="scope.row.endDate"

                      type="month"
                      placeholder="至今">
                    </el-date-picker>
                  </div>
                </el-col>
              </el-row>
              <!--<el-date-picker v-model="scope.row.monthRangeDate" type="monthrange" start-placeholder="开始月份" end-placeholder="结束月份" ></el-date-picker>-->
            </template>
            <!--<template slot-scope="scope">-->
              <!--<el-date-picker v-model="scope.row.monthRangeDate" type="monthrange" start-placeholder="开始月份" end-placeholder="结束月份" ></el-date-picker>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column prop="company" header-align="center" align="center" label="企业">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.company"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="jobPosition" header-align="center" align="center" label="职位">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.jobPosition"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="jobDescription" header-align="center" align="center" label="工作描述">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.jobDescription"></el-input>
            </template>
          </el-table-column>
          <el-table-column  header-align="center" align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="small" @click="workBackgroundDeleteHandle(scope.row.wbId)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="returnAuditHandle()" v-if="dataForm.isAudit == 1">退回重改</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="dataForm.isAudit == 1">审核确定</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="dataForm.isAudit == 0">提交审核</el-button>
    </span>

    <!--档案审核返退内容表-->
    <el-dialog title="档案退回重改意见" :visible.sync="returnAuditVisible" :close-on-click-modal="false" append-to-body >
      <el-input type="textarea" placeholder="请输入返退重改意见" maxlength="1000" size="large" show-word-limit rows="4"
                v-model="dataForm.auditMsg" ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="returnAuditVisible = false" >返回</el-button>
        <el-button @click="auditFormSubmit()" type="danger" >确定返退</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {provinceAndCityData} from 'element-china-area-data'
  import moment from 'moment'
  import lrz from 'lrz'
  import { getUUID } from '@/utils'
  import {getJobItem, getMaritalItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        visible: false,
        recordeductionVisible: false,
        recordworkVisible: false,
        returnAuditVisible: false,
        loading: true,
        imgLoading: false,
        loadingtext: '正在加载中',
        proItemList: [],
        edItemList: [],
        edTypeItemList: [],
        dutyItemList: [], // 职务列表
        titleItemList: [], // 职称列表
        titleProList: [], // 职称专业列表
        jobItemList: getJobItem(),
        maritalItemList: getMaritalItem(),
        placeOptions: provinceAndCityData,
        auditForm: {
          auditMsg: ''
        },
        dataForm: {
          userId: 0,
          username: '',
          sex: 1,
          idNo: '',
          birthday: '',
          entryTime: '',
          jobType: '',
          houseType: '',
          dutyId: '',
          proRatio: '',
          education: '',
          educationType: '',
          educationTime: '',
          titleLever: '',
          titlePro: '',
          email: '',
          mobile: '',
          trialPeriod: '',
          nativePlace: '',
          nativeProvince: '',
          nativeCity: '',
          maritalStatus: '',
          headImg: '',
          isAudit: '',
          auditMsg: '',
          edBackgroundList: [],
          workBackgroundList: []
        },
        auditRule: {
          aduitMsg: [{required: true, message: '审核返退意见不能为空', trigger: 'blur'}]
        },
        dataRule: {
          idNo: [
            {required: true, message: '身份证号不能为空', trigger: 'blur'}
          ],
          birthday: [
            {required: true, message: '出生日期不能为空', trigger: 'blur'}
          ],
          entryTime: [
            {required: true, message: '入职时间不能为空', trigger: 'blur'}
          ],
          jobType: [
            {required: true, message: '工作类型不能为空', trigger: 'blur'}
          ],
          houseType: [
            {required: true, message: '住房类型不能为空', trigger: 'blur'}
          ],
          education: [
            {required: true, message: '最高学历不能为空', trigger: 'blur'}
          ],
          titleLever: [
            {required: true, message: '职称等级不能为空', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '性别不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          maritalStatus: [
            {required: true, message: '婚姻状况不能为空', trigger: 'blur'}
          ],
          trialPeriod: [
            {required: true, message: '试用期不能为空！', trigger: 'blur'}
          ],
          educationTime: [
            {required: true, message: '毕业时间不能为空！', trigger: 'blur'}
          ],
          titlePro: [
            {required: true, message: '职称专业系数不能为空！', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init( id ,isaudit = 0) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          // 学历对照表信息
          this.getScoreEdList(1).then(list => {
            this.edTypeItemList = list
          })
          this.getScoreEdList(2).then(list => {
            this.proItemList = list
          })
          this.getScoreEdList(3).then(list => {
            this.edItemList = list
          })
          this.getJobTypeList().then(list => {
            let titleProList = []
            let titleItemList = []
            for (let dat of list) {
              if (dat.cateid === 1) {
                titleItemList.push(dat)
              } else if (dat.cateid === 2) {
                titleProList.push(dat)
              }
            }
            this.titleItemList = titleItemList
            this.titleProList = titleProList
          })
          this.getScoreDutyList().then(list => {
            this.dutyItemList = list
          })
          this.$refs['dataForm'].resetFields()
          this.loading = true
          this.loadingtext = '正在加载中...'
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/ren/recordtemp/info/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.dataForm.username = data.renRecordVo.username
                this.dataForm.idNo = data.renRecordVo.idNo
                this.dataForm.sex = data.renRecordVo.sex
                this.dataForm.birthday = data.renRecordVo.birthday
                this.dataForm.entryTime = data.renRecordVo.entryTime
                this.dataForm.educationTime = data.renRecordVo.educationTime
                this.dataForm.educationType = data.renRecordVo.educationType
                this.dataForm.jobType = data.renRecordVo.jobType
                this.dataForm.houseType = data.renRecordVo.houseType
                this.dataForm.education = data.renRecordVo.education
                this.dataForm.proRatio = data.renRecordVo.proRatio
                this.dataForm.titleLever = data.renRecordVo.titleLever
                this.dataForm.titlePro = data.renRecordVo.titlePro
                this.dataForm.email = data.renRecordVo.email
                this.dataForm.mobile = data.renRecordVo.mobile
                this.dataForm.trialPeriod = data.renRecordVo.trialPeriod
                this.dataForm.nativeProvince = data.renRecordVo.nativeProvince
                this.dataForm.nativeCity = data.renRecordVo.nativeCity
                this.dataForm.nativePlace = [data.renRecordVo.nativeProvince, data.renRecordVo.nativeCity]
                this.dataForm.maritalStatus = data.renRecordVo.maritalStatus
                this.dataForm.dutyId = data.renRecordVo.dutyId
                this.dataForm.headImg = data.renRecordVo.headImg
                this.dataForm.isAudit = isaudit
                this.dataForm.auditMsg = data.renRecordVo.auditMsg
                for (let edBackground of data.renRecordVo.edBackgroundList){
                  edBackground.edId = getUUID()
                  edBackground.monthRangeDate = [edBackground.startDate , edBackground.endDate]
                }
                for (let wBackground of data.renRecordVo.workBackgroundList){
                  wBackground.wbId = getUUID()
                  wBackground.monthRangeDate = [wBackground.startDate , wBackground.endDate]
                }
                this.dataForm.edBackgroundList = data.renRecordVo.edBackgroundList
                this.dataForm.workBackgroundList = data.renRecordVo.workBackgroundList
              }
            })
          }
        })
      },
      // 获取教育系数列表
      getSList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/scoreed/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.edList = data.list
          } else {
            this.edList = []
          }
          this.dataListLoading = false
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            for (let edBackground of this.dataForm.edBackgroundList){
              edBackground.startDate = moment(edBackground.monthRangeDate[0]).format('YYYY-MM-DD')
              edBackground.endDate = moment(edBackground.monthRangeDate[1]).format('YYYY-MM-DD')
            }
            for (let wBackground of this.dataForm.workBackgroundList){
              wBackground.startDate = moment(wBackground.startDate).format('YYYY-MM') == 'Invalid date' ? '': moment(wBackground.startDate).format('YYYY-MM')
              wBackground.endDate = moment(wBackground.endDate).format('YYYY-MM') == 'Invalid date' ? '': moment(wBackground.endDate).format('YYYY-MM')
            }
            this.loading = true
            this.loadingtext = '正在上传中'
            this.$http({
              url: this.$http.adornUrl(`/ren/recordtemp/save`),
              method: 'post',
              data: this.$http.adornData({
                'renRecordTempEntity': this.dataForm,
                'edBackgroundList': this.dataForm.edBackgroundList,
                'workBackgroundList': this.dataForm.workBackgroundList
              })
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 退回重改
      returnAuditHandle () {
        this.returnAuditVisible = true
      },
      // 退回重改意见
      auditFormSubmit(){
        console.log(this.dataForm.auditMsg)
        if (this.dataForm.auditMsg === undefined || this.dataForm.auditMsg === null){
          this.$message.error('审核反馈意见不能为空！')
          return
        }
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/update`),
          method: 'post',
          data: this.$http.adornData({
            'userId': this.dataForm.userId,
            'auditMsg': this.dataForm.auditMsg,
            'isAudit': 2
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '返退成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.returnAuditVisible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 籍贯选择器
      placeChangeHandle () {
        this.dataForm.nativeProvince = this.dataForm.nativePlace[0]
        this.dataForm.nativeCity = this.dataForm.nativePlace[1]
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
      getJobTypeList () {
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
      // 添加教育背景
      edBackgroundAddHandle () {
        this.dataForm.edBackgroundList.push({
          edId: getUUID(),
          userId: this.dataForm.userId,
          monthRangeDate: ['',''],
          educationBackground: '',
          educationSchool: '',
          major: ''
        })
        console.log(this.dataForm.edBackgroundList)
      },
      // 删除教育背景
      edBackgroundDeleteHandle ( edId) {
        let edTmpeList = []
        for (let edBackground of this.dataForm.edBackgroundList){
          if (edBackground.edId !== edId) {
            edTmpeList.push(edBackground)
          }
        }
        this.dataForm.edBackgroundList = edTmpeList
      },
      // 工作经验添加事件
      workBackgroundAddHandle () {
        this.dataForm.workBackgroundList.push({
          wbId: getUUID(),
          userId: this.dataForm.userId,
          // monthRangeDate: ['',''],
          startDate:'',
          endDate:'',
          company: '',
          jobPosition: '',
          jobDescription: ''
        })
      },
      // 删除工作经验
      workBackgroundDeleteHandle ( wbId) {
        let workBackTempList = []
        for (let wbground of this.dataForm.workBackgroundList){
          if (wbground.wbId !== wbId) {
            workBackTempList.push(wbground)
          }
        }
        this.dataForm.workBackgroundList = workBackTempList
      },
      // 图片压缩处理
      compressImgHandle(e) {
        let that = this
        if (e.target.files) {
          // lrz(file,[ options ])
          let options = {
            quality: 0.5,
            width: 900,
            height: 900
          }
          lrz(e.target.files[0], options)
            .then(function (rst) {
              // 成功时执行
              that.dataForm.headImg = rst.base64
            }).catch(function (error) {
            // 失败时执行
            that.$message.error('上传图片有误，请重新上传！')
          }).always(function () {
            // 不管成功或失败，都会执行
          })
        }
      }
    }
  }
</script>

<style scoped>
  .person_img {
    width: 100%;
    text-align: center;
    display: block;
    position: relative;
  }
  .person_img .img_content {
    width:160px;
    height:213px;
    border: 2px solid dodgerblue;
    border-radius: 10px;
    display:inline-block;
  }
  .person_img .img_content img{
    width:156px;
    height:210px;
    border-radius: 10px;
    position: absolute;
    transform: translate(-50%,0%);
  }
  .person_img .img_input {
    position: absolute;
    cursor: pointer;
    bottom: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  .person_img .img_input input{
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .card_detail_img_add {
    cursor: pointer;
    height: 40px;
    width: 157px;
    position: absolute;
    bottom: 7px;
    z-index: 2;
    background: #3b4249;
    opacity: 0.5;
    border-radius: 0px 0px 10px 10px;
    -moz-border-radius-bottomleft: 10px;
    -moz-border-radius-bottomright: 10px;
  }

  .card_detail_img_add .addplus {
    color: white;
    width: 30px;
    height: 30px;
    font-weight: 700;
    font-size: 25pt;
    vertical-align: center;
  }

  .card_detail_img_input {
    width: 100%;
    height: 100%;
    z-index: 4;
    opacity: 0;
    cursor: pointer;
  }

  .card_detail_input {
    width: 200px;
  }

  .card_table_title {
    border-bottom: 2px solid #00a2d4;
    font-size: 13pt;
    font-weight: 700;
    margin-top: 10px;
    width: 95%;
    margin-left: 2%;
    display: flex;
    justify-content: space-between;
  }

  .card_table_content {
    width: 95%;
    margin-left: 2%;
  }

  .card_table_title .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .edp .el-date-editor.el-input {
    width: 120px;
  }
</style>
