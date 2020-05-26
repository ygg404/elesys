<template>
    <div class="mod-config">
      <el-card>
        <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between">
          <el-form-item>
            <span class="time_title">考核时间:</span>
            <el-date-picker v-model="dataForm.curYear" type="year" placeholder="选择年" style="width: 100px;" @change="init"></el-date-picker>
            <el-select v-model="dataForm.updown" placeholder="时间类型" style="width: 110px;" @change="init">
              <el-option v-for="item in yearItemList" :label="item.yearItem" :key="item.id" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="time_title">参加考核人数:  <span style="color:green">{{attendNum}}</span></span>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-s-data" size="large" type="primary">效能评分统计表</el-button>
          </el-form-item>
        </el-form>
        <div style="text-align: center;margin-bottom: 10px;">
          <h1>{{dataForm.curYear.getFullYear() + '年' + (dataForm.updown == 0 ? '上半年':'下半年') + '效能考核明细'}}</h1>
        </div>
        <el-table :data="checkUserList" border>
          <el-table-column type="expand" >
            <template slot-scope="props">
              <el-table  :data="props.row.kbiList" :key="props.row.checkUserId"
                         style="width: 98%;margin-left: 2%;"  border>
                <el-table-column label="评分人" prop="userName" width="120"></el-table-column>
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
            </template>
          </el-table-column>
          <el-table-column prop="checkUserName" label="被考核人"></el-table-column>
          <el-table-column prop="kbiAllScore" label="效能评价分"></el-table-column>
          <el-table-column prop="extraScore" label="加减得分"></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
  import {getYearItem,getRateItem} from '@/utils/selectedItem'
  import { treeDataTranslate } from '@/utils'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        dataForm: {
          curYear: new Date(2020 , 1 ,1),   // 当前年份
          updown: 0 // 上下半年
        },
        yearItemList: getYearItem(),
        checkUserList: [],
        attendNum: 0,
        branchList: [],   // 部门列表
        branchTree: []    // 部门树表
      }
    },
    activated () {
      this.dataForm.curYear = new Date(new Date().getFullYear() , new Date().getMonth() - 3, 1)
      this.dataForm.updown = this.dataForm.curYear.getMonth() <= 6 ? 0 : 1
      this.init()
    },
    methods: {
      init () {
        // 获取部门列表
        this.getBranchList().then(success => {
          this.branchList = success
          this.branchTree = treeDataTranslate(success)
          this.getAccessList().then(list => {
            this.acceessListInit(list)
          })
        })
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
              finalScore: 0,
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
        this.checkUserList = checkUserList
        console.log(checkUserList)
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
        console.log(parentList)
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
      }
    }
  }
</script>

<style scoped>

</style>
