<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改团队指标考核'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div class="branch_line">
      <span style="width: 80px;">部门：</span><span>{{dataForm.branchName}}</span>
    </div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="奖惩办法:" prop="method">
        <el-input v-model="dataForm.method" placeholder="奖惩办法"></el-input>
      </el-form-item>
      <el-form-item label="指标明细:" prop="detail">
        <el-input v-model="dataForm.detail" placeholder="指标明细"></el-input>
      </el-form-item>
      <el-form-item label="产值指标:">
        <div>
          <div class="btn_line">
            <el-button size="small" icon="el-icon-plus" class="btn" @click="addScoreListHandle()">添加产值评分</el-button>
          </div>
          <el-table border :key="Math.random()" :data="dataForm.scoreList" >
            <el-table-column prop="output" header-align="center" align="center" label="产值（万）" >
              <template slot-scope="scope"><el-input type="number"  v-model="scope.row.output"></el-input></template>
            </el-table-column>
            <el-table-column prop="oscore" header-align="center" align="center" label="分数" >
              <template slot-scope="scope"><el-input-number v-model="scope.row.oscore"  :min="-20" :max="20" label="目标分数"></el-input-number></template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="操作" width="100">
              <template slot-scope="scope">
                <el-button icon="el-icon-delete" type="danger" @click="deleteScoreHandle(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getUUID} from '../../../utils'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          branchId: '',
          branchName: '',
          method: '',
          detail: '',
          assessorid: '',
          accessName: '',
          scoreList: []
        },
        dataRule: {
          branchName: [
            { required: true, message: '部门Id不能为空', trigger: 'blur' }
          ],
          output: [
            { required: true, message: '产值（万）不能为空', trigger: 'blur' }
          ],
          oscore: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.dataForm.id = item.id || 0
        this.dataForm.scoreList = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/ren/branchbase/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if(data.renBranchBase !== null) {
                  this.dataForm.assessorid = data.renBranchBase.assessorid
                  this.dataForm.method = data.renBranchBase.method
                  this.dataForm.detail = data.renBranchBase.detail
                  this.dataForm.scoreList = data.renBranchBase.scoreList
                  for (let score of this.dataForm.scoreList) {
                    score.id = Math.random()
                  }
                } else {
                  this.dataForm.assessorid = ''
                  this.dataForm.method = ''
                  this.dataForm.detail = ''
                }
                console.log(this.dataForm)
              }
            })
          }
        })
        this.dataForm.branchName = item.branchName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let scoreList = []
            for (let score of this.dataForm.scoreList) {
              let item = {
                branchId: this.dataForm.id,
                oscore: score.oscore,
                output: score.output
              }
              scoreList.push(item)
            }
            this.$http({
              url: this.$http.adornUrl(`/ren/branchbase/save`),
              method: 'post',
              data: this.$http.adornData({
                'branchId': this.dataForm.id,
                'method': this.dataForm.method,
                'detail': this.dataForm.detail,
                'scoreList': scoreList
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
      // 添加产值评分
      addScoreListHandle () {
        let socreItem = {
          output: 0,
          oscore: 0,
          id: getUUID()
        }
        this.dataForm.scoreList.push(socreItem)
      },
      // 删除产值评分列表
      deleteScoreHandle (item) {
        let list = []
        for (let score of this.dataForm.scoreList) {
          if (item.id !== score.id) {
            list.push(score)
          }
        }
        this.dataForm.scoreList = list
      }

    }
  }
</script>

<style scoped>
  .branch_line{
    padding: 15px;
  }
  .btn_line{
    width: 100%;
    border-bottom: 1px solid #00a0e9;
    display: flex;
    justify-content: flex-end;
  }
  .btn_line .btn{
    color: #00a0e9;
  }
</style>
