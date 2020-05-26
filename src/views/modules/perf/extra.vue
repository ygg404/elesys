<template>
  <div class="mod-config" v-loading="dataListLoading" >
    <el-card>
      <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between">
        <el-form-item>
          <span class="time_title">考核时间:</span>
          <el-date-picker v-model="dataForm.curYear" type="year" placeholder="选择年" style="width: 100px;" @change="init"></el-date-picker>
          <el-select v-model="dataForm.updown" placeholder="时间类型" style="width: 110px;" @change="init">
            <el-option v-for="item in yearItemList" :label="item.yearItem" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="16">
          <el-card>
            <template slot="header">
              <h1>{{dataForm.curYear.getFullYear() + '年' + (dataForm.updown == 0 ? '上半年': '下半年') + '加减分'}}</h1>
            </template>
            <el-table :data="userBranchList" border @row-click="extraRowClickHandle"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}" :span-method="objectSpanMethod">
              <el-table-column label="部门" prop="branchName"></el-table-column>
              <el-table-column label="用户名" prop="userName"></el-table-column>
              <el-table-column label="个人加减分" prop=""></el-table-column>
              <el-table-column label="加减分编辑">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editExtraHandle(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template slot="header">
              <h1>个人加减分明细</h1>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 个人加减分 编辑 弹出窗口-->
    <add-or-update ref="perfExtraAddOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
  </div>
</template>

<script>
  import {getYearItem,getRateItem} from '@/utils/selectedItem'
  import {treeDataTranslate,stringIsNull} from '@/utils'
  import addOrUpdate from './perfextra-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          curYear: new Date(2020 , 1 ,1),   // 当前年份
          updown: 0 // 上下半年
        },
        yearItemList: getYearItem(),
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        userBranchList: [],
        extraList: [],  // 加减分项列表
      }
    },
    components: {
      addOrUpdate
    },
    activated () {
      this.init()
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
        this.dataListLoading = true
        this.getUserList().then(userList => {
          this.getBranchList().then(branchList => {
            this.userBranchInit(branchList,userList)
            this.dataListLoading = false
          })
        })
        this.getExtralist().then(list => {
          this.extraList = list
        })
      },
      // 获取所有部门
      getBranchList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/branch/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
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
      // 获取各个岗位的所有用户
      getUserList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/userList'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.userList)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 列表初始化
      userBranchInit (branchList,userList) {
        let userBranchList = []
        let branchChildList = this.getBranchChildList(treeDataTranslate(branchList))
        for (let branch of branchChildList) {
          branch.recordVoList.map(record => {
            let userItem = userList.find(user => user.userId === record.userId)
            if (!stringIsNull(userItem)) {
              userItem.branchId = branch.id
              userItem.branchName = branch.branchName
              userBranchList.push(userItem)
            }
          })
        }
        let brandId = 0
        let sizeList = []
        let size = 0
        for (let uBranch of userBranchList) {
          if (brandId !== uBranch.branchId) {
            uBranch.isFirst = true
            sizeList.push(size)
            size = 0
            brandId = uBranch.branchId
          } else {
            uBranch.isFirst = false
          }
          size += 1
        }
        if (size !== 0) sizeList.push(size)
        let index = 0
        for (let uBranch of userBranchList) {
          if (uBranch.isFirst) {
            uBranch.size = sizeList[index + 1]
            index += 1
          }
        }
        this.userBranchList = userBranchList
      },
      // 点击查看一行 加减分明细
      extraRowClickHandle (row, event, column) {
        console.log(row)
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
      // 个人加减分编辑
      editExtraHandle (item) {
        item.year = this.dataForm.curYear.getFullYear()
        item.updown = this.dataForm.updown
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.perfExtraAddOrUpdate.init(item)
        })
      }
    }
  }
</script>

<style scoped>

</style>
