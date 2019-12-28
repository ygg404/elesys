<template>
  <div class="mod-config" v-loading="loading">
    <el-collapse accordion >
      <el-collapse-item style="border: 1px solid #8c939d ">
        <template slot="title">
          <span class="span_title">项目基本信息</span>
        </template>
        <div class="span_text">
          <div>项目名称：{{projectInfo.projectName}}</div>
          <div>项目类型：{{projectInfo.projectType}}</div>
          <div>项目负责人：{{projectInfo.projectCharge}}</div>
          <div>工作内容：{{projectInfo.workNote}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-card class="box-card card_work">
      <div>预计工作量：{{projectInfo.projectWorkload}}</div>
      <div>作业工作量：{{projectInfo.workLoad}}</div>
      <div>预计总产值：{{projectInfo.projectOutput}}</div>
      <div style="color: #00b7ee">实际总产值：{{totalOutPut}}</div>
    </el-card>
    <div class="card_work" style="color: #00b7ee">结算时间：<el-date-picker v-model="cutOffTime" type="month" value-format="yyyy-MM" placeholder="结算时间" style="width: 150px;" ></el-date-picker></div>

    <el-row :gutter="24" class="card_work">
      <el-col :span="8">
        <el-card class="box-card"  >
          <div slot="header" class="clearfix">
            <span style="font-size: 13px;">项目类型：</span>
            <el-select  v-model="ptValue" multiple collapse-tags style="width: 75%;" @change="projectTypeChangeHandler()" >
              <el-option v-for="item in projectTypelist" :label="item.name" :key="item.id" :value="item.id"  ></el-option>
            </el-select>
          </div>
          <div class="left_work">
            <el-checkbox
              v-for="(workType, index) in leftData"
              :key="index"
              :label="workType.typeName"
              v-if="workType.isVisible && workType.listIndex == groupradio"
              v-model="workType.checked"
              @change="checkOutputVoInit"
              class="checkbox_class"
            ></el-checkbox>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-radio-group v-model="groupradio">
        <div v-for="(groupOutput,index) in outPutGroupList" v-if="groupOutput.checked">
          <el-card>
            <div slot="header" class="clearfix">
              <el-radio :label="groupOutput.groupId">
                <span class="group_card">{{groupOutput.groupName}}</span>
                <span>(队长：{{groupOutput.headMan}})</span>
              </el-radio>
            </div>
            <el-table :data="chooseRatio(groupOutput.checkOutputVoList)" border  style="width: 100%;">
              <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" width="150"></el-table-column>
              <el-table-column prop="unit" header-align="center" align="center"  label="工作量单位" width="120"></el-table-column>
              <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单位" ></el-table-column>
              <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" width="120">
                <template slot-scope="scope">
                  <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.projectRatio" @change="checkOutputVoInit" ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" width="120">
                <template slot-scope="scope">
                  <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.workLoad" @change="checkOutputVoInit"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" width="100"></el-table-column>
            </el-table>
            <div span class="font_card">
              <span>预计产值：{{groupOutput.projectOutput}}</span>
              <span>（预计占比：{{groupOutput.outputRate}}%）。  </span>
              <span>实际产值：{{groupOutput.projectActuallyOutput}}。</span>
            </div>
          </el-card>
        </div>
        </el-radio-group>
      </el-col>
    </el-row>


    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="saveForm">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'
  export default {
    data () {
      return {
        loading: true,
        groupradio: 0,
        totalOutPut: 0, // 实际总产值
        leftData: [], // 左侧数据显示
        projectNo: '',
        projectInfo: '',
        projectTypelist: [],   // 项目类型列表
        ptValue: [],
        workTypelist: [],   // 工作类型列表
        outPutGroupList: [],
        qualityNoteValue: '',
        cutOffTime: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.projectNo = this.$route.query.projectNo
        this.getCutoffTime()
        this.getInfoByProjectNo(this.projectNo).then(success => {
          this.getProjectTypelist().then(success => {
            this.getWorkTypelist().then(success => {
              let ptType = this.projectInfo.projectType.split(',')
              console.log(ptType)
              for (let pt of this.projectTypelist) {
                for (let type of ptType) {
                  if (pt.name === type) {
                    this.ptValue.push(pt.id)
                  }
                }
              }
              this.workTypeInit()
              this.getOutPutGroupList(this.projectNo).then(success => {
                // 默认选中第一个组
                for (let e of this.outPutGroupList) {
                  if (e.checked) {
                    this.groupradio = e.groupId
                    break
                  }
                }
                this.checkOutputVoInit()
                this.loading = false
              })
            })
          })
        })
      },
      // 工作类型可见或不可见
      workTypeInit () {
        for (let workType of this.workTypelist) {
          workType.isVisible = false
          // 工作类型 不属于 任意项目则设为 可见
          if (workType.projectTypeIdList.length === 0) {
            workType.isVisible = true
          } else {
            for (let ptypeId of workType.projectTypeIdList) {
              for (let ptvalue of this.ptValue) {
                if (ptvalue === ptypeId) workType.isVisible = true
              }
            }
          }
        }
      },
      // 根据工作类型可见不可见 来显示右侧工作组工作类型数据
      checkOutputVoInit () {
        this.leftData = []
        this.totalOutPut = 0
        this.outPutGroupList.forEach((e, index) => {
          if (e.checked) {
            e.projectActuallyOutput = 0
            e.checkOutputVoList.forEach(ele => {
              // 各组工作类型产值
              ele.typeOutput = 0
              ele.typeOutput = parseFloat((ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2))
              if (ele.checked)e.projectActuallyOutput = parseFloat((e.projectActuallyOutput + ele.typeOutput).toFixed(2))
              ele.isVisible = false
              this.workTypelist.forEach((work, index) => {
                if (work.id === ele.typeId && work.isVisible) ele.isVisible = true
              })
              ele.listIndex = e.groupId
            })
            this.leftData = this.leftData.concat(e.checkOutputVoList)
            this.totalOutPut = parseFloat((this.totalOutPut + e.projectActuallyOutput).toFixed(2))
          }
        })
        console.log(this.leftData)
      },
      // 获取工作组的产值核算
      getOutPutGroupList (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutput/getOutPutGroup/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.outPutGroupList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取结算时间
      getCutoffTime () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/getInfo`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': this.projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.cutOffTime = data.checkQuality.cutOffTime
              resolve(data.checkQuality)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目基本信息
      getInfoByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/projectInfo/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目类型列表
      getProjectTypelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypelist = []
              this.projectTypelist.push({id: 0, name: '全部'})
              console.log(this.projectTypelist)
              for (let item of data.list) {
                this.projectTypelist.push({id: item.id, name: item.name})
              }
              resolve(data.projectTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取工作类型列表
      getWorkTypelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/worktype/getList`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workTypelist = data.list
              resolve(data.workTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 提交结算时间
      postCutoffTimeToApi(){
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/quality/cutOffTimesave`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectNo,
              'cutOffTime': this.cutOffTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 保存产值核算
      postOutputToApi () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutput/save`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'pgroupList': this.outPutGroupList,
            'projectActuallyOutput': this.totalOutPut
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
            this.goBack()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      saveForm () {
        this.postCutoffTimeToApi().then(success => {
          this.postOutputToApi()
        })
      },
      // 项目类型改变
      projectTypeChangeHandler () {
        console.log(this.ptValue)
        for (let ptvalue of this.ptValue) {
          // 选择全部项目时
          if (ptvalue === 0) {
            this.ptValue = []
            for (let pw of this.projectTypelist) if (pw.id !== 0) this.ptValue.push(pw.id)
            break
          }
        }
        this.workTypeInit()
        this.checkOutputVoInit()
      },
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOut = this.numFilter(
              e.workLoad * e.projectRatio * e.typeOutput
            )
            if (e.projectRatio == null || e.workLoad == null) {
              e.projectRatio = 1
              e.workLoad = 0
            }
            temp.push(e)
          }
        })
        return temp
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-editoutput')
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editoutput') {
          this.init()
        } else {
          this.goBack()
        }
      }
    }
  }
</script>

<style scoped>
  .form_class{
    margin-top: 20px;

  }

  .span_title {
    font-size: 18px;
    font-weight: 700;
  }

  .span_text{
    background-color: #f0f0f0;
    font-size: 15px;
  }

  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }
  .card_work{
    margin-top: 20px;
    font-size: 16px;
  }
  .left_work{
    border: 1px solid #6f7180;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    height: 400px;
  }
  .checkbox_class{
    width: 95%;
    margin-left: 0;
  }
  .group_card{
    font-weight: 700;
    font-size: 17px;
  }
  .font_card{
    font-weight: 700;
    font-size: 15px;
    color: #006F94;
  }
</style>
