<template>
  <el-dialog
    title="选择作业组" :close-on-click-modal="false" :visible.sync="visible">
    <span class="span_output">预计产值：{{this.totalOutPut}}</span>
    <el-table :data="groupList" border  style="width: 100%;" :summary-method='getSum'  show-summary>
      <el-table-column prop="name" header-align="center" align="left" label="组名" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" size="large" @change="headMenListEvent">{{scope.row.groupName}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="outputRate" header-align="center" align="center" width="120" label="占比(%)" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.outputRate"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="projectOutput" header-align="center" align="center" label="产值" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.projectOutput"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="shortDateTime" header-align="center" align="center" label="最短工期" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.shortDateTime"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="lastDateTime" header-align="center" align="center" label="最长工期" >
        <template slot-scope="scope">
          <el-input type="number" :disabled="!scope.row.checked" v-model="scope.row.lastDateTime"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <div style="float: left;margin-top: 10px;">
      项目负责人:
      <el-select v-model="headId" placeholder="项目负责人"  style="width: 130px;" >
        <el-option v-for="item in headManList" :label="item.headMan" :key="item.headId" :value="item.headId"  ></el-option>
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
        totalOutPut: 0,
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
        this.totalOutPut = totalOutPut
        this.getProjectWorkList(projectNo).then(grouplist => {
          this.groupList = grouplist
          this.headMenListEvent()
        })
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        console.log(1111)
        // this.$refs['dataForm'].validate((valid) => {
        //   if (valid) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/project/projectgroup/${!this.dataForm.id ? 'save' : 'update'}`),
        //       method: 'post',
        //       data: this.$http.adornData({
        //         'id': this.dataForm.id || undefined,
        //         'projectNo': this.dataForm.projectNo,
        //         'groupId': this.dataForm.groupId,
        //         'outputRate': this.dataForm.outputRate,
        //         'shortDateTime': this.dataForm.shortDateTime,
        //         'lastDateTime': this.dataForm.lastDateTime,
        //         'projectOutput': this.dataForm.projectOutput,
        //         'projectActuallyOutput': this.dataForm.projectActuallyOutput
        //       })
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         this.$message({
        //           message: '操作成功',
        //           type: 'success',
        //           duration: 1500
        //         })
        //         this.visible = false
        //         this.$emit('refreshDataList')
        //       } else {
        //         this.$message.error(data.msg)
        //       }
        //     })
        //   }
        // })
      },
      // 作业队长列表
      headMenListEvent () {
        this.headManList = []
        this.headId = ''
        for (let group of this.groupList) {
          if (group.checked) {
            this.headManList.push({
              headId: group.headId,
              headMan: group.headMan
            })
            this.headId = group.headId
          }
        }
      },
      getSum (param) {
        const { columns, data} = param
        const sums = []
        columns.forEach((column, index) => { //这步是为了让最后一行出现 合计 这一行，并且最后一行第一列出现 合计 二字。合计的字可以在这里更改
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          switch (column.property) {
            case 'outputRate':    // 这里是需要计算的列所绑定的prop的值
              console.log(column)
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
              }
              sums[index] += ' %'
              break
            default: // 这个默认不要忘记写
              break
          }
        })
        return sums
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
</style>
