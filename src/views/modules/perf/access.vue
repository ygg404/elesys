<template>
  <div class="mod-config" >
    <el-card v-loading="dataListLoading" >
      <el-form :inline="true" :model="dataForm" style="display:flex;justify-content: space-between">
        <el-form-item>
          <span class="time_title">考核时间:</span>
          <el-date-picker v-model="dataForm.curTime" type="month" placeholder="选择年月" @change="init"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <span class="time_title">考核状态:</span>
          <el-tag type="info" v-if="!isPost">未提交</el-tag>
          <el-tag type="success" v-if="isPost">已提交</el-tag>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <div style="text-align: center;margin-bottom: 10px;">
        <h1>{{dataForm.curTime.getFullYear() + '年' + (dataForm.curTime.getMonth() + 1) + '月' + '效能考核'}}</h1>
      </div>
      <div v-for="kbiRole in kbiRoleList" style="margin-top: 20px;" :key="kbiRole.roleId" v-if="isAttend">
        <div style="font-size: 12pt;color: #3b97d7;">
          <span>{{kbiRole.roleName + ':'}}</span>
        </div>
        <el-table :data="kbiRole.kbiList" :id="'table' + kbiRole.roleId" border show-summary :summary-method="getSummaryMethod">
          <el-table-column prop="kbiName" label="考核项" width="200"></el-table-column>
          <el-table-column prop="kbiRatio" label="占比（%）" width="96" align="center"></el-table-column>
          <el-table-column v-for="user in kbiRole.userList" :label="user.username" :key="user.userId" :prop="'kbiScore' + user.userId" width="130" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row['kbiScore' + user.userId]" placeholder="评价" :disabled="scope.row.kbiRatio == 0">
                <el-option v-for="item in rateList" :label="item.rateItem" :key="item.id" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn_line" v-if="isAttend">
        <el-button type="primary" size="large" @click="dataFormSubmit">提交评分</el-button>
      </div>
      <div v-if="isAttend === false">
        <span style="color:red;font-weight:700;font-size: 14pt;"> 当前年度此用户没有参评的权限！请联系管理员设置！</span>
      </div>

    </el-card>
    <!-- 弹窗, 新增 / 修改 -->
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
  // import AddOrUpdate from './perfaccess-add-or-update'
  import {getYearItem,getRateItem} from '@/utils/selectedItem'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          curTime: ''
        },
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        userKbiList: [],
        isAttend: false, // 是否有考核参评的权限
        kbiRoleList: [],   // 角色考核项关系表
        isPost: false, // 是否提交
        rateList: getRateItem(), // 评分列表
        perfAccessList: []  // 评分明细表
      }
    },
    computed: {
      userId: {
        get () {
          return this.$store.state.user.id
        },
        set (val) {
          this.$store.commit('user/updateId', val)
        }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
    },
    activated () {
      this.dataForm.curTime = new Date()
      this.init()
    },
    methods: {
      // 时间初始化
      init () {
        this.dataListLoading = true
        this.getPerfAccessVoList().then(accessList => {
          this.kbiRoleList = this.kbiRoleInit(accessList)
          this.dataListLoading = false
        })
        this.getUserIsAttend().then(data => {
          if (stringIsNull(data)) {
            this.isAttend = false
          } else {
            this.isAttend = true
          }
        })
      },
      // 获取当前年份 用户的评分表
      getPerfAccessVoList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/volist`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1,
              userId: this.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.isPost = data.isPost
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取角色与KBI关系列表
      getRoleKbiList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/sys/kbiVo/roleKBIList`),
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
      // 考核项目初始列表
      kbiRoleInit (accessList) {
        let kbiRoleList = []
        let roleId = 0
        let kbiId = 0
        let kbiIndex = 0
        let userId = 0
        // 考核项目根据角色分类
        let index = 0
        for (let roleKbi of accessList) {
          if (roleKbi.roleId !== roleId) {
            kbiId = 0
            roleId = roleKbi.roleId
            let kbiItem = {
              roleId: roleKbi.roleId,
              roleName: roleKbi.roleName,
              kbiList: [],
              userList: []
            }
            kbiRoleList.push(kbiItem)
          }
          if (roleKbi.kbiId > kbiId) {
            kbiRoleList[kbiRoleList.length - 1].kbiList.push({
              kbiId: roleKbi.kbiId,
              kbiName: roleKbi.kbiName,
              kbiRatio: roleKbi.kbiRatio
            })
            kbiId = roleKbi.kbiId
          }
          if (roleKbi.kbiId > kbiIndex) {
            kbiIndex = roleKbi.kbiId
            // 下个用户的评分项下标
            index += 1
          } else {
            kbiIndex = 0
            // 下个用户的评分项下标
            index = 1
          }
          // 根据被考核人的各考核项分数下标赋值
          kbiRoleList[kbiRoleList.length - 1].kbiList[index - 1]['kbiScore' + roleKbi.userId] = roleKbi.kbiScore
        }
        // 用户根据角色分类
        userId = 0
        for (let kbiRole of accessList) {
          kbiRoleList.map(item => {
            if (item.roleId === kbiRole.roleId) {
              if (kbiRole.userId !== userId) {
                item.userList.push({
                  userId: kbiRole.userId,
                  username: kbiRole.userName
                })
                userId = kbiRole.userId
              }
            }
          })
        }
        console.log(kbiRoleList)
        return (kbiRoleList)
      },
      // 获取当前用户是否有参评资格
      getUserIsAttend () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/ren/kbicheck/info`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curTime.getFullYear(),
              month: this.dataForm.curTime.getMonth() + 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.renKbiCheck)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取统计方法
      getSummaryMethod (param) {
        const { columns, data } = param
        const sums = []
        let colList = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '分数合计：'
            return
          }
          if (index === 1) {
            colList = data.map(item => (item[column.property]))
            sums[index] = '/'
            return
          }
          if (index > 1) {
            const values = data.map(item => (item[column.property]))
            let sum = 0
            let i = 0
            for (let value of values) {
              sum += stringIsNull(value) ? 0 : parseFloat(parseFloat(value) * parseFloat(colList[i]) / 100)
              i += 1
            }
            sums[index] = sum.toFixed(2)
            return
          }
        })
        return sums
      },
      dataFormSubmit () {
        let perfAccessList = []
        for (let roleKbi of this.kbiRoleList) {
          for (let item of roleKbi.kbiList) {
            for (var prop in item) {
              let accessItem = {
                userId: this.userId,
                userName: this.userName,
                year: this.dataForm.curTime.getFullYear(),
                month: this.dataForm.curTime.getMonth(),
                kbiId: item.kbiId,
                kbiName: item.kbiName,
                kbiRatio: item.kbiRatio
              }
              if (prop.indexOf('kbiScore') !== -1) {
                if (stringIsNull(item[prop]) && item.kbiRatio !== 0) {
                  this.$message.error('有填写项为空！')
                  return
                } else {
                  // 该考核项考核人对被考核人的评分
                  accessItem.kbiScore = item[prop]
                  // 被考核人id
                  accessItem.checkUserId = parseInt(prop.replace('kbiScore',''))
                  accessItem.checkUserName = roleKbi.userList.find(user => user.userId === accessItem.checkUserId)['username']
                  perfAccessList.push(accessItem)
                }
              }
            }
          }
        }
        this.$http({
          url: this.$http.adornUrl(`/perf/access/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'userId': this.userId,
            'year': this.dataForm.curTime.getFullYear(),
            'month': this.dataForm.curTime.getMonth(),
            'accessList': perfAccessList
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
            this.kbiRoleList = []
            this.init()
          } else {
            this.$message.error(data.msg)
          }
        })
        console.log(perfAccessList)
      }
    }
  }
</script>

<style scoped>
  .time_title{
    font-size: 12pt;
  }
  .btn_line{
    padding: 10px;
    width: 100%;
    text-align: center;
  }
</style>
