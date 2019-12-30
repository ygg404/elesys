<template>
  <el-dialog width="70%"
    title="选择作业组" :close-on-click-modal="false" :visible.sync="visible" >
    <span class="span_output">预计产值：{{this.totalOutPut}}</span>
    <el-table :data="groupList" border  style="width: 100%;" v-loading="loading">
      <el-table-column prop="name" header-align="center" align="left" label="组名" width="140" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" size="large" @change="headMenListEvent">{{scope.row.groupName}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="headMan" header-align="center" align="center" width="120" label="队长" ></el-table-column>
      <el-table-column prop="outputRate" header-align="center" align="center" width="120" label="占比(%)" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.outputRate" @change="addRate(scope.row)" min="0"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="projectOutput" header-align="center" align="center" label="产值" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.projectOutput" @change="addOutPut(scope.row)" min="0" ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="shortDateTime" header-align="center" align="center" label="最短工期" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.shortDateTime" min="0"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="lastDateTime" header-align="center" align="center" label="最长工期" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.lastDateTime" min="0"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div style="color: #00a2d4">
      合计：<span :class="(totalOutPut > tOutPut+1 || totalOutPut < tOutPut -1)? 'span_error':'span_ok'"> 产值{{tOutPut}}</span>,
      <span :class="(tRate > 100.01 || tRate < 99.99)? 'span_error':'span_ok'"> 占比{{tRate}}%</span>
    </div>
    <div style="float: left;margin-top: 10px;">
      项目负责人:
      <el-select v-model="headId" placeholder="项目负责人"  style="width: 130px;" >
        <el-option v-for="item in headManList" :label="item.username" :key="item.userId" :value="item.userId"  ></el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: true,
        totalOutPut: 0,
        tOutPut: 0,  // 计算中的产值和占比
        tRate: 0,
        projectNo: '',
        dataForm: {
          id: 0,
          projectNo: '',
          groupId: '',
          outputRate: '',
          shortDateTime: '',
          lastDateTime: '',
          projectOutput: '',
          projectActuallyOutput: ''
        },
        groupList: [],
        projectworkList: [],
        headManList: [],  // 项目负责人列表
        headId: ''
      }
    },
    mounted () {
    },
    methods: {
      init (projectNo, totalOutPut = 0) {
        this.projectNo = projectNo
        this.totalOutPut = totalOutPut
        this.getProjectWorkList(projectNo).then(grouplist => {
          this.groupList = grouplist
          this.loading = false
          this.getProjectChargeList().then(data => {
            this.headManList = data
            this.headMenListEvent()
          })
          // 获取项目负责人列表
          this.getProjectCharge(projectNo).then(projectPlan => {
            for (let headman of this.headManList) {
              if (headman.username === projectPlan.projectCharge) {
                this.headId = headman.userId
                console.log('headid' + this.headId)
              }
            }
          })
        })
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        if (this.tRate > 100.01 || this.tRate < 99.99) {
          this.$message.error('总百分比不能超过100或者小于100')
          return
        } else if (this.totalOutPut > this.tOutPut + 1 || this.totalOutPut < this.tOutPut - 1) {
          this.$message.error('总计产值不能超过或者小于总预计产值')
          return
        }

        this.$http({
          url: this.$http.adornUrl(`/project/group/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'pgroupList': this.groupList,
            'projectNo': this.projectNo,
            'headId': this.headId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList', this.projectNo)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 作业队长列表
      headMenListEvent () {
        // this.headManList = []
        for (let group of this.groupList) {
          if (group.checked) {
            // this.headId = group.headId
            // let isheadIdin = false
            // for (let user of this.headManList) {
            //   if (user.userId === group.headId) isheadIdin = true
            // }
            // if (!isheadIdin) {
            //   this.headManList.push({
            //     userId : group.headId,
            //     username: group.headMan
            //   })
            // }
            this.headId = group.headId
          }
        }
        this.getSum()
      },
      addRate (item) {
        console.log(item)
        item.projectOutput = parseFloat(item.outputRate * this.totalOutPut / 100).toFixed(2)
        var shortNum = item.projectOutput * 0.7 / 2400 - parseInt(item.projectOutput * 0.7 / 2400)

        if (shortNum === 0) {
          item.shortDateTime = Math.round(item.projectOutput * 0.7 / 2400)
        } else if (shortNum < 0.5) {
          item.shortDateTime = parseInt(item.projectOutput * 0.7 / 2400) + 0.5
        } else {
          item.shortDateTime = Math.round(item.projectOutput * 0.7 / 2400)
        }

        var lastNum = item.projectOutput * 1.3 / 2400 - parseInt(item.projectOutput * 1.3 / 2400)
        if (lastNum === 0) {
          item.lastDateTime = Math.round(item.projectOutput * 1.3 / 2400)
        }
        if (lastNum < 0.5) {
          item.lastDateTime = parseInt(item.projectOutput * 1.3 / 2400) + 0.5
        } else {
          item.lastDateTime = Math.round(item.projectOutput * 1.3 / 2400)
        }
        item.projectOutput = parseFloat(item.projectOutput)
        this.getSum()
      },
      addOutPut (item) {
        // console.log(this.project_output)
        item.outputRate = parseFloat(item.projectOutput * 100 / this.totalOutPut).toFixed(2)
        var shortNum = Math.round(item.projectOutput * 0.7 / 2400 - parseInt(item.projectOutput * 0.7 / 2400))
        console.log('short:' + shortNum)
        if (0 < shortNum < 0.5) {
          item.shortDateTime = parseInt(item.projectOutput * 0.7 / 2400) + 0.5
        } else {
          item.shortDateTime = Math.round(item.projectOutput * 0.7 / 2400)
        }
        var lastNum = Math.round(item.projectOutput * 1.3 / 2400 - parseInt(item.projectOutput * 1.3 / 2400))
        console.log('lastNum:' + lastNum)
        if (0 < lastNum < 0.5) {
          item.lastDateTime = parseInt(item.projectOutput / 2400 * 1.3) + 0.5
        } else {
          item.lastDateTime = Math.round(item.projectOutput / 2400 * 1.3)
        }
        item.outputRate = parseFloat(item.outputRate)
        this.getSum()
      },
      // 运算总和
      getSum () {
        this.tRate = 0
        this.tOutPut = 0
        for (let group of this.groupList) {
          if (group.checked) {
            this.tOutPut += parseFloat(group.projectOutput)
            this.tRate += Math.round(group.outputRate, 2)
          }
        }
        this.tOutPut = parseFloat(this.tOutPut.toFixed(2))
      },
      // 获取项目负责人列表
      getProjectChargeList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getChargeList`),
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
      // 获取作业分组数据
      getProjectWorkList (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/group/getListByProjectNo/${projectNo}`),
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
      }
    }
  }
</script>

<style>
  .span_output{
    font-size: 15px;
    font-weight: 500;
  }
  .span_ok{
    color: #00b7ee;
  }
  .span_error{
    color: red;
  }
</style>
