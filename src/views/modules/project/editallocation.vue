<template>
  <div class="mod-config">
    <el-row :gutter="24">
      <el-col :span="14">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" style="text-align: left;">
          <el-card class="box-card" >
            <div slot="header" class="clearfix" style="padding: 0">
              <span class="span_title">项目安排信息</span>
              <el-form-item label="开工日期:" prop="projectBegunDateTime" style="float:right;width: 240px;margin-top: -10px;">
                <el-date-picker v-model="dataForm.projectBegunDateTime" type="date" placeholder="项目开工日期" style="max-width: 150px;"></el-date-picker>
              </el-form-item>
            </div>
            <el-select  placeholder="执行标准短语快捷输入" filterable v-model="executeValue" multiple collapse-tags style="width: 100%;" @change="executelistHandler()" >
              <el-option v-for="item in executelist" :label="item.shortcutNote" :key="item.id" :value="item.id" v-if="shortTypeAlive(item)"  ></el-option>
            </el-select>
            <el-form-item prop="executeStandard">
              <el-input type="textarea" placeholder="请输入执行标准" maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.executeStandard" ></el-input>
            </el-form-item>
            <el-select  placeholder="作业内容短语快捷输入" filterable  v-model="worknoteValue" collapse-tags multiple style="width: 100%;margin-top: 20px;" @change="worknotelistHandler()">
              <el-option v-for="item in worknotelist" :label="item.shortcutNote" :key="item.id" :value="item.id" v-if="shortTypeAlive(item)" ></el-option>
            </el-select>
            <el-form-item prop="workNote">
              <el-input type="textarea" placeholder="请输入作业内容"  maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.workNote"></el-input>
            </el-form-item>
            <el-select  placeholder="作业要求短语快捷输入" filterable  v-model="workrequireValue" collapse-tags multiple style="width: 100%;margin-top: 20px;" @change="workrequirelistHandler()">
              <el-option v-for="item in workrequireList" :label="item.shortcutNote" :key="item.id" :value="item.id"  v-if="shortTypeAlive(item)"></el-option>
            </el-select>
            <el-form-item prop="workRequire">
              <el-input type="textarea" placeholder="请输入作业要求" maxlength="1000" show-word-limit class="allo_text" v-model="dataForm.workRequire"></el-input>
            </el-form-item>

            <el-form-item prop="projectBill">
              <div class="bill_line">
                <span class="title_span">项目成果清单：</span>
                <el-button icon="el-icon-plus" type="primary" size="small" @click="addBillHandle">添加清单项</el-button>
              </div>
              <el-table border :data="dataForm.billList">
                <el-table-column prop="billName" header-align="center" align="center" label="项目">
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.billName" :fetch-suggestions="queryNameSearch" @select="((item)=>{handleNameSelect(item, scope.row.id)})" required="true" style="width: 100%">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </template>
                </el-table-column>
                <el-table-column prop="spec" header-align="center" align="center" label="规格" width="180">
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.spec" :fetch-suggestions="querySpecSearch" @select="((item)=>{handleSpecSelect(item, scope.row.id)})">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </template>
                </el-table-column>
                <el-table-column prop="num" header-align="center" align="center" label="数量(份)" width="100">
                  <template slot-scope="scope">
                    <el-input  v-model="scope.row.num" type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" header-align="center" align="center" label="备注" width="100">
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.remark" :fetch-suggestions="queryRemarkSearch" @select="((item)=>{handleRemarkSelect(item, scope.row.id)})">
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.nameItem }}</div>
                      </template>
                    </el-autocomplete>
                  </template>
                </el-table-column>
                <el-table-column  header-align="center" align="center" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteBillHandle(scope.row.id)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <el-select  placeholder="外业作业安全交底快捷输入" filterable  v-model="saferequireValue" collapse-tags  style="width: 100%;margin-top: 20px;" @change="saferequirelistHandler()">
              <el-option v-for="item in saferequireList" :label="item.shortcutNote.split('\n')[0]" :key="item.id" :value="item.id"  v-if="shortTypeAlive(item)"></el-option>
            </el-select>
            <el-form-item prop="safeRequire">
              <el-input type="textarea" placeholder="请输入外业作业安全交底要求" maxlength="2000" show-word-limit class="allo_text" v-model="dataForm.safeRequire"></el-input>
            </el-form-item>

            <el-row :gutter="24">
              <el-col :span="15">
                <el-form-item label="预计产值:" prop="projectOutput">
                  <el-input placeholder="产值" type="number" style="max-width: 140px;" v-model="dataForm.projectOutput" @change="countWorkDateHandler" min="0" ></el-input>
                  <el-tooltip class="item"  content="产值明细计算" placement="right"  >
                    <el-button type="primary"  icon="el-icon-s-platform" @click="setProjectOutputHandle()" ></el-button>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="9">
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="作业工期    :" prop="projectWorkDate">
                  <el-input placeholder="作业工期" type="number" style="max-width: 140px;" v-model="dataForm.projectWorkDate" min="0"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="质检工期:" prop="projectQualityDate">
                  <el-input placeholder="质检工期" type="number" style="max-width: 120px;" v-model="dataForm.projectQualityDate" min="0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card project_info"  >
          <div slot="header" class="clearfix">
            <span class="span_title">项目基本信息</span>
          </div>
          <div class="info_class">
            <el-row :gutter="24"><el-col :span="8"><span>项目编号：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectNo}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目名称：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目类型：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectType}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>委托单位：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectAuthorize}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>委托要求：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectNote}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>生产负责人：</span></el-col> <el-col :span="16"><span>{{projectInfo.projectProduce}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>业务负责人：</span></el-col> <el-col :span="16"><span>{{projectInfo.contractBusiness}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>项目立项人：</span></el-col> <el-col :span="16"><span>{{projectInfo.createUserName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>联系人：</span></el-col> <el-col :span="16"><span>{{projectInfo.userName}}</span></el-col></el-row>
            <el-row :gutter="24"><el-col :span="8"><span>联系人电话：</span></el-col> <el-col :span="16"><span>{{projectInfo.userPhone}}</span></el-col></el-row>
          </div>
        </el-card>
        <div style="margin-top: 10px;">
          <el-button type="primary" size="large" @click="projectGroupHandle(projectNo)">选择作业组</el-button>
        </div>
        <el-card class="box-card group_info" style="margin-top: 10px;" v-if="dataForm.projectCharge != null">
          <div slot="header" class="clearfix" style="padding: 0">
            <span class="span_title">作业组数据</span>
            <div style="float:right;">
              <span>项目负责人:{{dataForm.projectCharge}}</span>
            </div>
          </div>
          <div v-for="group in this.groupWorkList" :key="group.groupId" class="group_item" v-if="group.checked">
            {{group.groupName}}:占比{{group.outputRate}}%，产值:{{group.projectOutput}}，最短工期:{{group.shortDateTime}}，最长工期:{{group.lastDateTime}}。
          </div>
        </el-card>
        <!--预计产值明细表-->
        <el-card style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="padding: 0">
            <span class="span_title">预计产值明细  </span>
            <span v-if="totalOutPut !== 0" style="color:#00b7ee;">(预计产值合计：{{totalOutPut}})</span>
          </div>
          <el-table :data="chooseRatio(workTypelist)" border  style="width: 100%;">
            <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" ></el-table-column>
            <el-table-column prop="unit" header-align="center" align="center"  label="量单位" ></el-table-column>
            <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单价" ></el-table-column>
            <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" ></el-table-column>
            <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" ></el-table-column>
            <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" ></el-table-column>
          </el-table>
          <div style="margin-top: 10px;width: 100%;" v-if="projectInfo.outputRemark != '' && projectInfo.outputRemark != null">
            <div><span style="font-weight: 700;font-size: 11pt;">备注:</span>
              <span style="color: #00b7ee;">{{projectInfo.outputRemark}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--    各个队产值安排情况-->
    <el-card class="rate_info">
      <el-table  :data="groupRateList" style="width: 100%"  border :span-method="objectSpanMethod" v-loading="dataLoading" >
        <el-table-column type="expand" >
          <template slot-scope="props">
            <el-table  :data="props.row.projectList" style="width: 100%;" :row-class-name="getTableclass" border>
              <el-table-column label="项目名称" prop="projectName" width="450"></el-table-column>
              <el-table-column label="项目启动时间" prop="projectStartDateTime"></el-table-column>
              <el-table-column label="预算产值" prop="projectOutput" ></el-table-column>
              <el-table-column label="实际产值" prop="projectActuallyOutput" ></el-table-column>
              <el-table-column label="进度" prop="scheduleRate">
                <template slot-scope="scope">
                  <el-progress :text-inside="true"  :stroke-width="26" :percentage="scope.row.scheduleRate" ></el-progress>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="上级部门" prop="parentGroup"></el-table-column>
        <el-table-column label="总安排产值" prop="allSetOutput"></el-table-column>
        <el-table-column label="总未完成产值" prop="allNotOutput"></el-table-column>
        <el-table-column label="总未完成项目数" prop="allUndoneNum"></el-table-column>
        <el-table-column label="组名" prop="groupName"></el-table-column>
        <el-table-column label="已安排产值" prop="isSetOutput"></el-table-column>
        <el-table-column label="未完成产值" prop="isNotOutput"></el-table-column>
        <el-table-column label="未完成项目数" prop="undoneNum"></el-table-column>
        <!--<el-table-column label="安排系数" prop="groupRate"></el-table-column>-->
      </el-table>
    </el-card>

    <div class="bottom_btn">
      <el-button type="warning" size="large"  @click="goBack">返回</el-button>
      <el-button type="primary" size="large" @click="dataFormSubmit">提交</el-button>
    </div>

    <!--产值明细计算-->
    <el-dialog title="产值明细计算" :visible.sync="outputCalVisible" width="70%" :close-on-click-modal="false">
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
                v-for="(workType, index) in workTypelist"
                :key="index"
                :label="workType.typeName"
                v-model="workType.checked"
                v-if="workType.isVisible"
                @change="checkOutputVoInit"
                class="checkbox_class"
              ></el-checkbox>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-table :data="chooseRatio(workTypelist)" border  style="width: 100%;" show-summary :summary-method="getSummaryMethod">
            <el-table-column prop="typeName" header-align="center" align="left" label="作业类型" width="130"></el-table-column>
            <el-table-column prop="unit" header-align="center" align="center"  label="量单位" width="110"></el-table-column>
            <el-table-column prop="unitOutput" header-align="center" align="center" label="产值单价" ></el-table-column>
            <el-table-column prop="projectRatio" header-align="center" align="center" label="难度系数" width="110">
              <template slot-scope="scope">
                <el-input type="number" :disabled="!scope.row.checked || scope.row.typeId == -99" v-model="scope.row.projectRatio" @change="checkOutputVoInit"  ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="workLoad" header-align="center" align="center" label="工作量" width="110">
              <template slot-scope="scope">
                <el-input type="number" :disabled="!scope.row.checked || scope.row.typeId == -99" v-model="scope.row.workLoad" @change="checkOutputVoInit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="typeOutput" header-align="center" align="center" label="产值" width="100"></el-table-column>
          </el-table>
          <div style="margin-top: 10px;width: 100%;">
            <div><span style="font-weight: 700;font-size: 11pt;">备注填写:</span></div>
            <el-input type="textarea" placeholder="请输入备注" maxlength="250" show-word-limit class="allo_text" v-model="projectInfo.outputRemark" ></el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outputCalVisible = false"  plain>返回</el-button>
        <el-button @click="putProjectOutputToApiHandle"  type="primary">确定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改  项目组-->
    <projectgroup-add-or-update v-if="projectGroupVisible" ref="projectgroupAddOrUpdate" @refreshDataList="init"></projectgroup-add-or-update>
  </div>
</template>

<script>
  import projectgroupAddOrUpdate from './projectgroup-add-or-update'
  import {closeTab} from '@/utils/tabs'
  import {stringIsNull, treeDataTranslate, getUUID} from '@/utils'
  import moment from 'moment'
  import {getBillRemarkItem, getBillSpecItem, getBillNameItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        dataLoading: false,
        projectNo: this.$route.query.projectNo,
        getArgsPageIndex: this.$route.query.pageIndex,
        getArgsPageSize: this.$route.query.pageSize,
        projectGroupVisible: false,
        ptValue: [],
        outputCalVisible: false, // 产值明细计算
        projectInfo: '',
        dataForm: {
          billList: [{
            'billName': '',
            'spec': '',
            'num': 0,
            'remark': ''
          }],
          executeStandard: '',
          workNote: '',
          workRequire: '',
          safeRequire: '',
          projectWriter: '',
          projectNo: '',
          projectCharge: '',
          projectChargeAccount: '',
          projectOutput: '',
          projectOutputNote: '',
          projectBegunDateTime: '',
          projectWorkDate: '',
          projectQualityDate: '',
          projectActuallyOutput: ''
        },
        groupRateList: [],
        produceList: [],
        dataRule: {
          executeStandard: [
            { required: true, message: '执行标准不能为空', trigger: 'blur' }
          ],
          workNote: [
            { required: true, message: '作业内容不能为空', trigger: 'blur' }
          ],
          workRequire: [
            { required: true, message: '作业要求不能为空', trigger: 'blur' }
          ],
          projectWorkDate: [
            { required: true, message: '作业工期不能为空', trigger: 'blur' }
          ],
          projectQualityDate: [
            { required: true, message: '质检工期不能为空', trigger: 'blur' }
          ],
          projectOutput: [
            { required: true, message: '预计产值不能为空', trigger: 'blur' }
          ],
          projectBegunDateTime: [
            { required: true, message: '项目开工时间不能为空', trigger: 'blur' }
          ]
        },
        executelist: [], // 执行标准列表
        executeValue: '',
        worknotelist: [], // 作业内容列表
        worknoteValue: '',
        workrequireList: [],   // 作业要求列表
        workrequireValue: '',
        saferequireList: [],  // 作业安全列表
        saferequireValue: '',
        groupWorkList: [],  // 作业分组情况
        projectTypelist: [],  // 项目类型列表
        workTypelist: [],     // 工作类型列表
        totalOutPut: 0    // 预计总产值计算数值
      }
    },
    components: {
      projectgroupAddOrUpdate
    },
    computed: {
      argsPageIndex: {
        get () { return this.$store.state.paramsutil.argsPageIndex },
        set (val) { this.$store.commit('paramsutil/updateargsPageIndex', val) }
      },
      argsPageSize: {
        get () { return this.$store.state.paramsutil.argsPageSize },
        set (val) { this.$store.commit('paramsutil/updateargsPageSize', val) }
      }
    },
    activated () {
      // console.log(this.$router.params.projectNo)
      this.init()
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex >= 1 && columnIndex <= 4) {
          if (row.isFirst || rowIndex === 0) {
            return {
              rowspan: row.size,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      init () {
        this.dataLoading = true
        this.getPlanByProjectNo()
        this.getExecutelist()
        this.getWorkNotelist()
        this.getWorkRequireList()
        this.getSafeRequireList()
        this.getWorkGroupDataListFromApi().then(grouplist => {
          this.getProjectDataCoe().then(coeList => {
            this.projectCoeInit(grouplist, coeList)
            this.dataLoading = false
          })
        })
        // 获取项目基本信息
        this.getInfoByProjectNo(this.projectNo).then(projectInfo => {
          this.projectInfo = projectInfo
          if (projectInfo.projectBillList.length > 0) this.dataForm.billList = projectInfo.projectBillList
            // 获取项目分组情况
          this.getGroupByProjectNo(this.projectNo)
        })
        this.getWorkTypelist(this.projectNo).then(success => {
          this.checkOutputVoInit()
        })
        this.dataForm.projectBegunDateTime = moment(new Date()).format('YYYY-MM-DD')
        // this.getProjectCharge(this.projectNo)  // 获取项目负责人
      },
      // 获取统计方法
      getSummaryMethod (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '预计产值合计：'
            return
          }
          if (index === 1 || index === 2 || index === 3 || index === 4) {
            sums[index] = '/'
            return
          }
          if (index === 5) {
            const values = data.map(item => Number(item[column.property]))
            let sum = 0
            for (let value of values) {
              sum += value
            }
            sums[index] = sum
          }
        })
        return sums
      },
      // 工作日期
      countWorkDateHandler () {
        let workNum = this.dataForm.projectOutput / 2400 - parseInt(this.dataForm.projectOutput / 2400)
        console.log(workNum)
        if (workNum === 0) {
          this.dataForm.projectWorkDate = Math.round(this.dataForm.projectOutput / 2400)
        } else if (workNum < 0.5) {
          this.dataForm.projectWorkDate = parseInt(this.dataForm.projectOutput / 2400) + 0.5
        } else {
          this.dataForm.projectWorkDate = Math.round(this.dataForm.projectOutput / 2400)
        }
        let qualityNum = this.dataForm.projectWorkDate * 0.25 - parseInt(this.dataForm.projectWorkDate * 0.25)
        if (qualityNum === 0) {
          this.dataForm.projectQualityDate = Math.round(this.dataForm.projectWorkDate * 0.25)
        } else if (qualityNum < 0.5) {
          this.dataForm.projectQualityDate = parseInt(this.dataForm.projectWorkDate * 0.25) + 0.5
        } else {
          this.dataForm.projectQualityDate = Math.round(this.dataForm.projectWorkDate * 0.25)
        }
      },
      // 选择作业组
      projectGroupHandle (projectNo) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataFormSubmit(false)
            this.projectGroupVisible = true
            this.$nextTick(() => {
              console.log(this.dataForm.projectOutput)
              this.$refs.projectgroupAddOrUpdate.init(projectNo, this.dataForm.projectOutput)
            })
          }
        })
      },
      // 从后台获得工作组数据列表内容
      getWorkGroupDataListFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/workgroup/list'),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
            }
          })
        })
      },
      // 获取所有子部门
      getBranchChildList (branchlist) {
        let childList = []
        for (let branch of branchlist) {
          if (branch.children !== undefined) {
            childList = childList.concat(this.getBranchChildList(branch.children))
          } else {
            childList.push(branch)
          }
        }
        return childList
      },
      // 组内安排产值与未安排产值表格 初始化
      projectCoeInit (grouplist, coelist) {
        let branchChildList = this.getBranchChildList(treeDataTranslate(grouplist, 'id', 'pid'))
        let groupRateList = []
        let indexList = []
        for (let i = 0; i < coelist.length; i++) {
          if (!stringIsNull(branchChildList.find(branch => branch.id === coelist[i].groupId))) {
            indexList.push(i)
          }
        }
        indexList.forEach(value => {
          groupRateList.push(coelist[value])
        })
        for (let branch of branchChildList) {
          let groupItem = grouplist.find(group => group.id === branch.pid)
          if (!stringIsNull(groupItem)) {
            branch.parentGroup = groupItem.name
            branch.pid = groupItem.id
          }
        }
        let pid = 0
        let size = 0
        let allNotOutput = 0 // 各中心所有未完成产值
        let allSetOutput = 0 // 各中心所有已安排产值
        let allUndoneNum = 0  // 各中心未完成项目数
        let numList = []
        for (let groupRate of groupRateList) {
          let groupItem = branchChildList.find(group => group.id === groupRate.groupId)
          if (!stringIsNull(groupItem)) {
            groupRate.parentGroup = groupItem.parentGroup
            groupRate.pid = groupItem.pid
          }
          if (groupRate.pid !== pid) {
            groupRate.isFirst = true
            pid = groupRate.pid
            numList.push({
              size: size,
              allNotOutput: allNotOutput,
              allSetOutput: allSetOutput,
              allUndoneNum: allUndoneNum
            })
            size = 0
            allNotOutput = 0
            allSetOutput = 0
            allUndoneNum = 0
          }
          size += 1
          allNotOutput += groupRate.isNotOutput
          allSetOutput += groupRate.isSetOutput
          allUndoneNum += groupRate.undoneNum
        }
        if (size > 0) {
          numList.push({
            size: size,
            allNotOutput: allNotOutput,
            allSetOutput: allSetOutput,
            allUndoneNum: allUndoneNum
          })
        }
        console.log(numList)
        let index = 0
        for (let groupRate of groupRateList) {
          if (groupRate.isFirst === true) {
            groupRate.size = numList[++index].size
            groupRate.allNotOutput = numList[index].allNotOutput.toFixed(3)
            groupRate.allSetOutput = numList[index].allSetOutput.toFixed(3)
            groupRate.allUndoneNum = numList[index].allUndoneNum
          }
        }
        console.log(this.groupRateList = groupRateList)
      },
      // 表单提交
      dataFormSubmit (goback = true) {
        // 判断清单项是否为空
        if (goback) {
          let flag = false
          for (let billItem of this.dataForm.billList) {
            billItem.id = ''
            billItem.projectNo = this.projectNo
            if (stringIsNull(billItem.billName)) {
              this.$message.error('项目成果清单项为空，请仔细填写！')
              flag = true
            }
          }
          if (flag) return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/save`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectNo': this.projectNo,
                'projectWorkload': this.dataForm.projectWorkload,
                'projectWorkDate': this.dataForm.projectWorkDate,
                'projectQualityDate': this.dataForm.projectQualityDate,
                'projectOutput': this.dataForm.projectOutput,
                'executeStandard': this.dataForm.executeStandard,
                'workRequire': this.dataForm.workRequire,
                'safeRequire': this.dataForm.safeRequire,
                'workNote': this.dataForm.workNote,
                'projectWriter': this.projectInfo.createUserName,
                'projectBegunDateTime': this.dataForm.projectBegunDateTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '保存并提交成功',
                  type: 'success',
                  duration: 1500
                })
                if (goback) {
                  this.submitBillToApi()
                  this.goBack()
                }
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      // 项目分组信息
      getGroupByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getListByProjectNo`),
            method: 'get',
            params: this.$http.adornParams({
              projectNo: projectNo,
              pid: this.projectInfo.produceGroupId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.groupWorkList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目计划
      getPlanByProjectNo () {
        return new Promise((resolve, reject) => {
          if (this.projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/plan/info/${this.projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (data.projectPlan != null) {
                  this.dataForm.id = data.projectPlan.id
                  this.dataForm.projectNo = data.projectPlan.projectNo
                  this.dataForm.projectWorkDate = data.projectPlan.projectWorkDate
                  this.dataForm.projectQualityDate = data.projectPlan.projectQualityDate
                  this.dataForm.projectOutput = data.projectPlan.projectOutput
                  this.dataForm.executeStandard = data.projectPlan.executeStandard
                  this.dataForm.workRequire = data.projectPlan.workRequire
                  this.dataForm.workNote = data.projectPlan.workNote
                  this.dataForm.safeRequire = data.projectPlan.safeRequire
                  this.dataForm.projectBegunDateTime = data.projectPlan.projectBegunDateTime == null ? new Date() : data.projectPlan.projectBegunDateTime
                  this.dataForm.projectCharge = data.projectPlan.projectCharge
                  if ((!stringIsNull(this.dataForm.projectOutput)) && stringIsNull(this.dataForm.projectWorkDate) &&
                    stringIsNull(this.dataForm.projectQualityDate)) {
                    this.countWorkDateHandler()
                  }
                }
                resolve(data)
              } else {
                this.$message.error(data.msg)
                reject(data.msg)
              }
            })
          } else {
            ;
          }
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
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取生产负责人列表
      getProduceList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/getProduceList`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.produceList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取执行标准列表
      getExecutelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/1`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.executelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取作业内容列表
      getWorkNotelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/3`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.worknotelist = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取作业要求列表
      getWorkRequireList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/4`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workrequireList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取作业安全交底要求列表
      getSafeRequireList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/wpshortcut/getListByShortTypeId/14`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.saferequireList = data.list
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 执行内容处理
      executelistHandler () {
        console.log(this.executeValue)
        this.dataForm.executeStandard = ''
        for (let value of this.executeValue) {
          for (let worknote of this.executelist) {
            if (worknote.id === value) this.dataForm.executeStandard = this.dataForm.executeStandard + worknote.shortcutNote + ';'
          }
        }
      },
      // 工作内容处理
      worknotelistHandler () {
        console.log(this.worknoteValue)
        this.dataForm.workNote = ''
        for (let value of this.worknoteValue) {
          for (let worknote of this.worknotelist) {
            if (worknote.id === value) this.dataForm.workNote = this.dataForm.workNote + worknote.shortcutNote + ';'
          }
        }
      },
      // 技术要求处理
      workrequirelistHandler () {
        console.log(this.workrequireValue)
        this.dataForm.workRequire = ''
        for (let value of this.workrequireValue) {
          for (let worknote of this.workrequireList) {
            if (worknote.id === value) this.dataForm.workRequire = this.dataForm.workRequire + worknote.shortcutNote + ';'
          }
        }
      },
      // 安全技术交底要求处理
      saferequirelistHandler () {
        for (let safenote of this.saferequireList) {
          if (safenote.id === this.saferequireValue) {
            // 去除第一行标题
            this.dataForm.safeRequire = safenote.shortcutNote.replace(safenote.shortcutNote.split('\n')[0] + '\n','')
          }
        }
      },
      // 获取项目负责人
      getProjectCharge (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/plan/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectPlan)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取各组项目产值和进度数据
      getProjectDataCoe () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getProjectDataCoe`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
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
      getWorkTypelist (projectNo) {
        console.log(projectNo)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
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
      // 产值明细计算
      setProjectOutputHandle () {
        this.ptValue = []
        this.totalOutPut = 0
        this.getProjectTypelist().then(success => {
          this.getWorkTypelist(this.projectNo).then(success => {
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
            this.checkOutputVoInit()
          })
        })
        this.outputCalVisible = true
      },
      // 提交 预算产值明细
      putProjectOutputToApiHandle () {
        this.outputCalVisible = false
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutputtemp/save`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'tempOutputlist': this.workTypelist
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.updateProjectRemark()
            this.dataForm.projectOutput = this.totalOutPut
            this.countWorkDateHandler()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 通过项目ID 更新项目预算产值备注
      updateProjectRemark () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/project/update`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.projectInfo.id || undefined,
              'outputRemark': this.projectInfo.outputRemark == null ? '' : this.projectInfo.outputRemark
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              ;
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOutput = this.numFilter(
              e.workLoad * e.projectRatio * e.unitOutput
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
      // 项目清单名
      queryNameSearch(queryString, cb) {
        var list = getBillNameItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 规格选项
      querySpecSearch (queryString, cb) {
        var list = getBillSpecItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 备注选项
      queryRemarkSearch (queryString, cb) {
        var list = getBillRemarkItem()
        var results = queryString ? list.filter(this.createFilter(queryString)) : list
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.nameItem.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleNameSelect (item,id) {
        this.dataForm.billList.find(dat => dat.id === id).billName = item.nameItem
      },
      handleSpecSelect (item,id) {
        this.dataForm.billList.find(dat => dat.id === id).spec = item.nameItem
      },
      handleRemarkSelect (item,id) {
        this.dataForm.billList.find(dat => dat.id === id).remark = item.nameItem
      },
      // 添加项目清单项
      addBillHandle () {
        let billItem = {
          'id': getUUID(),
          'projectNo': this.dataForm.projectNo,
          'billName': '',
          'spec': '',
          'num': '',
          'remark': ''
        }
        this.dataForm.billList.push(billItem)
      },
      // 删除项目清单项
      deleteBillHandle (id) {
        if (this.dataForm.billList.length <= 1) {
          this.$message.error('该项目成果项无法删除，请仔细填写！')
          return
        }
        let billList = []
        for (let bill of this.dataForm.billList) {
          if (bill.id !== id) {
            billList.push(bill)
          }
        }
        this.dataForm.billList = billList
      },
      // 提交清单
      submitBillToApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/bill/save`),
            method: 'post',
            data: this.$http.adornData({
              'projectNo': this.projectInfo.projectNo,
              'projectBillList': this.dataForm.billList
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              ;
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 根据工作类型可见不可见 来显示右侧工作组工作类型数据
      checkOutputVoInit () {
        let totalOutPut = 0
        let worktypeList = this.workTypelist
        worktypeList.forEach((ele, index) => {
          if (ele.checked) {
            ele.typeOutput = parseFloat((ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2))
            totalOutPut = parseFloat((totalOutPut + ele.typeOutput).toFixed(2))
          }
        })
        this.workTypelist = worktypeList
        this.totalOutPut = totalOutPut
      },
      // 根据项目类型快捷输入可见或不可见
      shortTypeAlive (item) {
        // 当快捷短语的项目分类为空 或者 项目类型为空则短语可见
        if (stringIsNull(item.projectType) || stringIsNull(this.projectInfo.projectType)) {
          return true
        } else {
          let itemType = item.projectType.split(',')
          for (let itype of itemType) {
            if (this.projectInfo.projectType.indexOf(itype) !== -1) {
              return true
            }
          }
          return false
        }
      },
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
      // 返回
      goBack () {
        closeTab('project-editallocation')
        this.argsPageSize = this.getArgsPageSize
        this.argsPageIndex = this.getArgsPageIndex
        this.$router.push({
          path: 'project-project'
        })
      }
    },
    watch: {
      '$route': function (to, from) {
        this.projectNo = to.query['projectNo']
        // 执行数据更新查询
        if (to.name === 'project-editallocation') {
          this.init()
        } else {
          closeTab('project-editallocation')
        }
      }
    }
  }
</script>

<style>
  .span_title{
    font-weight: 700;
    font-size: 20px;
  }

  .project_info{
    background-color: #58798E;
    color: white;
  }

  .group_info{
    background-color: #5daf34;
    color: white;
  }

  .group_item{
    font-size: 15px;
  }
  .allo_text{
    height: 100px;
    margin-top: 5px;
  }

  .allo_text textarea{
    height: 100px;
  }

  .bottom_btn{
    margin: 20px;
    width: 100%;
    text-align: center;
  }

  .info_class span{
    font-size: 15px;
  }

  .rate_info{
    margin-top: 10px;
  }

  .el-select-dropdown{
    max-width: 243px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 00px;
  }
  .left_work{
    border: 1px solid #6f7180;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    height: 400px;
  }
  .checkbox_class{
    width: 99%;
    margin-left: 0;
  }
  .card_work{
    margin-top: 20px;
    font-size: 16px;
  }

  .bill_line{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #45b3ff;
  }
  .bill_line .title_span {
    font-size: 11pt;
    font-weight: 700;
  }
</style>
