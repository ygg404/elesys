<template>
  <div>
    <!--产值明细计算-->
    <el-dialog title="产值明细计算" :visible.sync="outputCalVisible" width="78%" :close-on-click-modal="false" append-to-body>
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
            <el-input type="textarea" placeholder="请输入备注" maxlength="250" show-word-limit class="allo_text" v-model="outputRemark" ></el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outputCalVisible = false"  plain>返回</el-button>
        <el-button @click="putProjectOutputToApiHandle"  type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        projectNo: '',
        outputCalVisible: true,
        ptValue: [],
        outputRemark: '', // 备注
        projectTypelist: [],  // 项目类型列表
        workTypelist: [],     // 工作类型列表
        totalOutPut: 0,    // 预计总产值计算数值
        projectInfo: {
          projectType: ''
        }
      }
    },
    methods: {
      // 预算产值明细计算初始化
      init (project) {
        this.outputCalVisible = true
        this.$nextTick(() => {
          this.projectNo = project.projectNo
          let ptType = project.projectType.split(',')
          this.ptValue = []
          this.totalOutPut = 0
          this.getProjectTypelist().then(success => {
            this.getWorkTypelist(this.projectNo).then(success => {
              for (let pt of project.projectTypeIdList) {
                this.ptValue.push(pt)
              }
              console.log(this.ptValue)
              if (this.ptValue === undefined) this.ptValue = [0]
              this.projectTypeChangeHandler()
            })
          })
        })
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
            return
          }
        })
        return sums
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
            this.$message({
              message: '添加预算产值成功',
              type: 'success',
              duration: 1500
            })
            this.outputCalVisible = false
            this.$emit('refreshDataList' , this.projectNo,this.totalOutPut,this.outputRemark)
          } else {
            this.$message.error(data.msg)
          }
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
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
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
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
    }
  }
</script>

<style scoped>
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
</style>
