<template>
  <el-dialog
    title="选择作业组" :close-on-click-modal="false" :visible.sync="visible">
    <el-table :data="groupList" border  style="width: 100%;">
      <el-table-column prop="name" header-align="center" align="left" label="组名" >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked">{{scope.row.name}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="outputRate" header-align="center" align="center" width="120" label="占比(%)" ></el-table-column>
      <el-table-column prop="projectOutput" header-align="center" align="center" label="产值" ></el-table-column>
      <el-table-column prop="shortDateTime" header-align="center" align="center" label="最短工期" ></el-table-column>
      <el-table-column prop="lastDateTime" header-align="center" align="center" label="最长工期" ></el-table-column>
    </el-table>

    <div style="float: left;margin-top: 10px;">
      项目负责人:
      <el-select v-model="headId" placeholder="项目负责人"  style="width: 130px;">
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
      init (projectNo) {
        let that = this
        this.visible = true
        this.headManList = []
        this.getGroupList().then(grouplist => { this.groupList = grouplist })
        this.getProjectWorkList(projectNo).then(projectworkList => {
          console.log(projectworkList)
          for (let group of this.groupList) {
            group.outputRate = 0
            group.projectOutput = 0
            group.shortDateTime = 0
            group.lastDateTime = 0
            group.checked = false
            for (let pwork of projectworkList) {
              if (pwork.groupId === group.id) {
                group.checked = true
                group.outputRate = pwork.outputRate
                group.projectOutput = pwork.projectOutput
                group.shortDateTime = pwork.shortDateTime
                group.lastDateTime = pwork.lastDateTime
                let headitem = {
                  headId: group.headId,
                  headMan: group.headMan
                }
                this.headManList.push(headitem)
              }
            }
          }
          console.log(this.groupList)
          console.log(this.headManList)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/project/projectgroup/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'projectNo': this.dataForm.projectNo,
                'groupId': this.dataForm.groupId,
                'outputRate': this.dataForm.outputRate,
                'shortDateTime': this.dataForm.shortDateTime,
                'lastDateTime': this.dataForm.lastDateTime,
                'projectOutput': this.dataForm.projectOutput,
                'projectActuallyOutput': this.dataForm.projectActuallyOutput
              })
            }).then(({data}) => {
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
      },
      // 获取作业组列表
      getGroupList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/workgroup/selectworkgroup`),
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
