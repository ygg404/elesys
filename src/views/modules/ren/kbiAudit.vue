<template>
  <div class="mod-config" >
    <el-card  v-loading="dataLoading">
      <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between">
        <el-form-item>
          <span class="time_title">考核时间:</span>
          <el-date-picker v-model="dataForm.curYear" type="year" placeholder="选择年" style="width: 100px;" @change="init"></el-date-picker>
          <el-select v-model="dataForm.updown" placeholder="时间类型" style="width: 110px;" @change="init">
            <el-option v-for="item in yearItemList" :label="item.yearItem" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="time_title">审定状态:</span>
          <el-tag type="info" v-if="isAudit == false">未审定</el-tag>
          <el-tag type="primary" v-else>已审定</el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" icon="el-icon-s-custom" @click="editPersonHandle()">编辑参评人员</el-button>
          <el-button type="primary" size="large" icon="el-icon-document-checked" @click="auditScoreHandle()">审定效能分</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center;margin-bottom: 10px;">
        <h1>{{dataForm.curYear.getFullYear() + '年' + (dataForm.updown == 0 ? '上半年':'下半年') + '效能考核明细'}}</h1>
      </div>
      <div style="display: flex">
        <div style="width: 200px" v-if="isAuth('ren:kbi:person')">
          <detailUser ref="detailUser"></detailUser>
        </div>

        <el-table :data="checkUserList" border style="margin-left: 10px;" :header-cell-style="{background:'#F4F5F6',color:'#131D34',padding: '5px 0'}">
          <el-table-column type="expand" v-if="isAuth('ren:kbi:detial')" >
            <template slot-scope="props">
              <div>
                <el-collapse>
                  <el-collapse-item name="1" >
                    <template slot="title">
                      <div class="extra_item_title">效能评分表</div>
                    </template>
                    <el-table  :data="props.row.kbiList" :key="props.row.checkUserId"
                               style="width: 98%;margin-left: 2%;"  border>
                      <el-table-column label="评分人" prop="userName" width="110"></el-table-column>
                      <el-table-column v-for="(kbiItem,index) in props.row.kbiItemList" v-if="kbiItem.kbiRatio != 0"
                                       :label="kbiItem.kbiName + '/(' + kbiItem.kbiRatio + '%)'"
                                       :prop="'kbiId' + kbiItem.kbiId" :key="index" :render-header="renderheader"></el-table-column>
                      <el-table-column label="是否其领导" width="120">
                        <template slot-scope="scope">
                          <el-tag type="primary" v-if="scope.row.isGuider">是</el-tag>
                          <el-tag type="info" v-else>否</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="是否为同一部门">
                        <template slot-scope="scope">
                          <el-tag type="primary" v-if="scope.row.isSameBranch">是</el-tag>
                          <el-tag type="info" v-else>否</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item name="2">
                    <template slot="title">
                      <div class="extra_item_title">加减分评分表</div>
                    </template>
                    <el-table :data="props.row.scoreList" border :span-method="objectSpanMethod" show-summary style="max-height: 400px;overflow-y:auto">
                      <el-table-column prop="extraType" label="类型" width="40">
                        <template slot-scope="scope">
                          <div v-if="scope.row.extraType == 0">加分项</div>
                          <div v-if="scope.row.extraType == 1">减分项</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="extraItem" label="加减分项"></el-table-column>
                      <el-table-column prop="standard" label="计分标准"></el-table-column>
                      <el-table-column prop="extraNum" label="分数" width="80"></el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="checkUserName" label="被考核人"></el-table-column>
          <el-table-column prop="kbiAllScore" label="效能评价分"></el-table-column>
          <el-table-column prop="finalExtra" label="加减得分"></el-table-column>
          <el-table-column prop="standardScore" label="效能基准分"></el-table-column>
          <el-table-column label="最终效能得分">
            <template slot-scope="scope">
              <span style="color: #3b97d7">{{getFinalKbiScore(scope.row)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--    效能考核分数审定-->
    <kbi-audit-add-or-update ref="kbiAuditAddOrUpdate" v-if="auditVisible" @refreshDataList="init()" ></kbi-audit-add-or-update>
    <!--    参评人数编辑-->
    <kbi-person-add-or-update ref="kbiPersonAddOrUpdate" v-if="personVisible" @refreshDataList="init()"></kbi-person-add-or-update>
  </div>
</template>

<script>
  import {getYearItem} from '@/utils/selectedItem'
  import { treeDataTranslate } from '@/utils'
  import {stringIsNull} from '../../../utils'
  import detailUser from './detail-user'
  import kbiAuditAddOrUpdate from './kbiAudit-add-or-update'
  import kbiPersonAddOrUpdate from './kbiPerson-add-or-update'

  export default {
    data () {
      return {
        dataLoading: false,
        dataForm: {
          curYear: new Date(2020 , 1 ,1),   // 当前年份
          updown: 0 // 上下半年
        },
        yearItemList: getYearItem(),
        checkUserList: [],
        attendNum: 0,
        branchList: [],   // 部门列表
        branchTree: [],    // 部门树表
        uScoreList: [],    // 评分列表
        branchChildList: [],
        isAudit: false,
        auditVisible: false,
        personVisible: false,
      }
    },
    activated () {
      this.dataForm.curYear = new Date(new Date().getFullYear() , new Date().getMonth() - 3, 1)
      this.dataForm.updown = this.dataForm.curYear.getMonth() <= 6 ? 0 : 1
      this.init()
    },
    components: {
      detailUser,
      kbiAuditAddOrUpdate,
      kbiPersonAddOrUpdate
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
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
        // 获取部门列表
        this.dataLoading = true
        this.getBranchList().then(branchList => {
          this.getUaccessList().then(uRoleList => {
            this.branchList = branchList
            this.getAccessList().then(list => {
              this.getExtralist().then(extraList => {
                this.getExtraScorelist().then(scoreList => {
                  let checkUserList = this.acceessListInit(list)
                  for (let checkUser of checkUserList) {
                    // 设置每个人的效能基准分
                    checkUser.standardScore = uRoleList.find( item => item.userId === checkUser.checkUserId).standardScore
                    checkUser.scoreList = this.extraScoreInit(checkUser, extraList, scoreList)
                    // 计算每个人的总加减分
                    let allScore = 0
                    for (let score of checkUser.scoreList) {
                      allScore += score.extraNum
                    }
                    checkUser.allScore = allScore
                  }
                  // 设置每成员的部门 并获取部门的最高分
                  checkUserList = this.setBranchScoreFun(checkUserList,branchList)
                  this.checkUserList = this.setKbiScore(checkUserList)
                  this.dataLoading = false
                })
              })
            })
          })
        })
        this.$refs.detailUser.init(this.dataForm)
      },
      renderheader (h, { column, $index }) {
        return h('span', {}, [
          h('span', {}, column.label.split('/')[0]),
          h('br'),
          h('span', {}, column.label.split('/')[1])
        ])
      },
      // 获取部门列表
      getBranchList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/branch/list`),
            method: 'get',
            params: this.$http.adornParams({})
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
      // 获取评分列表
      getAccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/list`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
            })
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
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/uAssessList`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
            })
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
      // 评分表初始化
      acceessListInit (accessList) {
        let checkUserId = 0
        let kbiId = 0
        let userId = 0
        let checkUserList = []
        for (let access of accessList) {
          if (access.checkUserId !== checkUserId) {
            let checkItem = {
              checkUserId: access.checkUserId,
              checkUserName: access.checkUserName,
              kbiAllScore: 0,
              extraScore: 0,
              kbiItemList: [], // 考核项
              kbiList: []
            }
            checkUserList.push(checkItem)
            checkUserId = access.checkUserId
            userId = 0
            kbiId = 0
          }
          // 获取每个人的考核评分项
          if (access.kbiId > kbiId) {
            checkUserList[checkUserList.length - 1].kbiItemList.push({
              kbiId: access.kbiId,
              kbiName: access.kbiName,
              kbiRatio: access.kbiRatio
            })
            kbiId = access.kbiId
          }
          // 评分人明细
          if (access.userId !== userId) {
            let kbiItem = {
              userId: access.userId,
              userName: access.userName,
              isGuider: this.isGuiderHandle(access.userId,access.checkUserId),
              isSameBranch: this.isSameBranch(access.userId,access.checkUserId)
            }
            userId = access.userId
            checkUserList[checkUserList.length - 1].kbiList.push(kbiItem)
          }
          checkUserList[checkUserList.length - 1].kbiList[checkUserList[checkUserList.length - 1].kbiList.length - 1]['kbiId' + access.kbiId] = access.kbiScore
        }
        this.attendNum = checkUserList[checkUserList.length - 1] === undefined ? 0 : checkUserList[checkUserList.length - 1].kbiList.length
        return checkUserList
      },
      // 是否为部门领导
      isGuiderHandle (userId,checkUserId) {
        let isGuider = false
        // 被考核人所在的所有部门
        let inBranchList = []
        this.branchList.map(branch => {
          branch.recordVoList.map(record => {
            if (record.userId === checkUserId) inBranchList.push(branch.id)
          })
        })
        // 获取被考核人所有的父类部门
        let parentList = []
        for (let branchId of inBranchList) {
          parentList.push(branchId)
          this.getParentBranchList(parentList, branchId)
        }
        // 判断考核人是否为被考核人的领导
        for (let branchId of parentList) {
          let branchItem = this.branchList.find(branch => branch.id === branchId)
          if (branchItem.mdeputyId === userId || branchItem.sdeputyId === userId) isGuider = true
        }
        return isGuider
      },
      // 获取部门的父部门
      getParentBranchList (parentList = [] , branchId) {
        this.branchList.map( branch => {
          if (branch.id === branchId && branch.parentId !== 0) {
            parentList.push(branch.parentId)
            this.getParentBranchList(parentList,branch.parentId)
          }
        })
      },
      // 判断 考核人与被考核人 是否为同一个部门
      isSameBranch (userId,checkUserId) {
        let isSame = false
        let userBranchId = []     // 考核人的部门
        let checkBranchId = []    // 被考核人的部门
        this.branchList.map(branch => {
          for (let userItem of branch.recordVoList) {
            if (userId === userItem.userId) userBranchId.push(branch.id)
            if (checkUserId === userItem.userId) checkBranchId.push(branch.id)
          }
        })
        for (let uBranchId of userBranchId) {
          for (let cBranchId of checkBranchId) {
            if (uBranchId === cBranchId) isSame = true
          }
        }
        return isSame
      },
      // 获取加减分项列表
      getExtralist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 获取加减分项列表
      getExtraScorelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extrascoring/list'),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 评分列表初始化
      extraScoreInit (checkUser,extraList,scoreList) {
        let uScoreList = []
        for (let scoreItem of scoreList) {
          if (scoreItem.checkUserId === checkUser.checkUserId) {
            uScoreList.push(scoreItem)
          }
        }
        let sizeList = []
        let extrascoreList = []
        let type = -1
        let size = 0
        // 先计算加分项
        for (let extra of extraList) {
          let extraPart = {
            extraId: extra.id,
            extraItem: extra.extraItem,
            standard: extra.standard,
            remark: extra.remark,
            extraType: extra.extraType,
            isFirst: false
          }
          if (extra.extraType !== type) {
            type = extra.extraType
            sizeList.push(size)
            size = 0
            extraPart.isFirst = true
          }
          size += 1
          let score = uScoreList.find(scoeItem => scoeItem.extraId === extra.id)
          if (!stringIsNull(score)) {
            extraPart.extraNum = score.extraNum
          } else {
            extraPart.extraNum = 0
          }
          extrascoreList.push(extraPart)
        }
        if (size > 0) sizeList.push(size)
        let index = 0
        for (let extrascore of extrascoreList) {
          if (extrascore.isFirst) extrascore.size = sizeList[++index]
        }
        return extrascoreList
      },
      // 计算最终的加减得分
      setBranchScoreFun (checkUserList, branchList) {
        let branchChildList = this.getBranchChildList(treeDataTranslate(branchList))
        for (let checkUser of checkUserList) {
          for (let branch of branchChildList) {
            if (branch.recordVoList.find(record => record.userId === checkUser.checkUserId) !== undefined) {
              checkUser.branchId = branch.id
              checkUser.branchName = branch.branchName
              break
            }
          }
        }
        // 统计每个部门的最高分
        let branchMaxScoreList = []
        for (let checkUser of checkUserList ) {
          let branch = branchMaxScoreList.find(branch => branch.brandId === checkUser.branchId)
          let branchScore = {
            branchId: checkUser.branchId,
            maxScore: checkUser.allScore
          }
          if (branch !== undefined && branch.maxScore < branchScore.maxScore) {
            branch.maxScore = branchScore.maxScore
          } else if (branch === undefined) {
            branchMaxScoreList.push(branchScore)
          }
        }
        // 计算加减分最终的结果
        for (let checkUser of checkUserList ) {
          let branch = branchMaxScoreList.find(branch => branch.branchId === checkUser.branchId)
          if ( branch === undefined ) {
            checkUser.maxScore = 0
          } else {
            checkUser.maxScore = branch.maxScore
          }
          checkUser.finalExtra = parseFloat((checkUser.allScore + 10) * 9 / (checkUser.maxScore + 10)).toFixed(2)
        }
        console.log(branchMaxScoreList)
        return checkUserList
      },
      // 计算每用户的效能评价得分
      setKbiScore (checkUserList) {
        for (let checkUser of checkUserList) {
          let scoreItemList = []
          for (let scoreItem of checkUser.kbiList) {
            let score = 0
            for (var prop in scoreItem) {
              if (prop.indexOf('kbiId') >= 0) {
                let propItem = checkUser.kbiItemList.find(kbi => kbi.kbiId === parseInt(prop.replace('kbiId','')))
                if (propItem !== undefined && (!stringIsNull(scoreItem[prop]))) {
                  score += parseFloat(propItem.kbiRatio * scoreItem[prop] / 100)
                }
              }
            }
            let sItem = {
              score: score,
              ratio: 0.2
            }
            if (scoreItem.isGuider || scoreItem.isSameBranch) {
              sItem.ratio = 0.4
            }
            scoreItemList.push(sItem)
          }
          checkUser.scoreItemList = scoreItemList
          let kbiScoreOther = 0   // 其他成员总分数
          let kbiOhterNum = 0
          let kbiScoreGuider = 0  // 领导成员总分数
          let kbiGuiderNum = 0
          let kbiScoreBranch = 0  // 同部门成员总分数
          let kbiBranchNum = 0
          for (let scoreItem of checkUser.scoreItemList) {
            // 其他成员总分数
            if (scoreItem.ratio === 0.2) {
              kbiScoreOther += parseFloat(scoreItem.score * scoreItem.ratio)
              kbiOhterNum += 1
            } else {
              // 领导成员总分数
              if (scoreItem.isGuider) {
                kbiScoreGuider += parseFloat(scoreItem.score * scoreItem.ratio)
                kbiGuiderNum += 1
              }
              // 同部门成员总分数
              if (scoreItem.isSameBranch) {
                kbiScoreBranch += parseFloat(scoreItem.score * scoreItem.ratio)
                kbiBranchNum += 1
              }
            }
          }
          checkUser.kbiAllScore = parseFloat(kbiScoreOther / (kbiOhterNum === 0 ? 1 : kbiOhterNum)
            + kbiScoreGuider / (kbiGuiderNum === 0 ? 1 : kbiGuiderNum)
            + kbiScoreBranch / (kbiBranchNum === 0 ? 1 : kbiBranchNum)).toFixed(2)
        }
        return checkUserList
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
      getFinalKbiScore (item) {
        console.log(item)
        if (stringIsNull(item.standardScore)) {
          return ''
        } else {
          return Math.round(parseInt((1 + (item.kbiAllScore + item.extraScore - 75) * 0.6 / 75) * 100) * item.standardScore / 100)
        }
      },
      // 考核分数审定
      auditScoreHandle () {
        this.auditVisible = true
        this.$nextTick(() => {
          let item = {}
          console.log(this.dataForm.curYear)
          item.checkUserList = this.checkUserList
          item.checkYear = this.dataForm.curYear.getFullYear()
          item.checkUpdown = this.dataForm.updown
          this.$refs.kbiAuditAddOrUpdate.init(item)
        })
      },
      // 编辑参评人数
      editPersonHandle () {
        this.personVisible = true
        this.$nextTick(() => {
          let item = {}
          item.checkYear = this.dataForm.curYear.getFullYear()
          item.checkUpdown = this.dataForm.updown
          this.$refs.kbiPersonAddOrUpdate.init(item)
        })
      }
    }
  }
</script>

<style scoped>
  .extra_item_title{
    width: 99%;
    padding: 5px;
    font-size: 11pt;
    font-weight: 700;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    cursor: pointer;
  }
  .extra_item_title:hover {
    color: #0BB2D4;
  }
</style>
