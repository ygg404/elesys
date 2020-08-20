<template>
  <el-dialog title="质量评分" :close-on-click-modal="false" :visible.sync="visible" width="95%">
    <div>
      <el-form :inline="true" :model="errorForm" class="item">
        <el-form-item label="点位中误差:">
          <el-input v-model="errorForm.errorPoint" type="number" ></el-input>
        </el-form-item>
        <el-form-item label="间距中误差:">
          <el-input v-model="errorForm.errorSpace" type="number" ></el-input>
        </el-form-item>
        <el-form-item label="高程中误差:">
          <el-input v-model="errorForm.errorHeigh" type="number" ></el-input>
        </el-form-item>
      </el-form>
    </div>
<!--    2019 评分表-->
    <div v-if="score1Visible">
      <div v-for="(scoreDetail, index) in scoreDetailList">
        <div class="form_title" v-if="index==0">作业依据、空间基准及数学精度(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{kjScore}}</span></span></div>
        <div class="form_title" v-if="index==6">数据采集、处理质量(权:0.4) <span class="from_span">质量元素扣分:<span style="color: red">{{cjScore}}</span></span></div>
        <div class="form_title" v-if="index==18">成果资料质量(权:0.3) <span class="from_span">质量元素扣分:<span style="color: red">{{cgScore}}</span></span></div>
        <el-row>
          <el-col :span="4" ><div class="form_disable_item">检查项内容:{{scoreDetail.checkcontent}}</div></el-col>
          <!--        <el-col :span="3"><div class="form_disable_item"><el-input placeholder="检查类型" v-model="scoreDetail.check_type"></el-input></div></el-col>-->
          <el-col :span="8"><div class="form_disable_item"><el-input placeholder="检查结果" v-model="scoreDetail.check_result"></el-input></div></el-col>
          <el-col :span="2"><div  style="text-align: right">错漏数量:</div></el-col>
          <el-col :span="2"><div class="form_disable_item"><el-input placeholder="A类" type="number" v-model="scoreDetail.check_a" @change="scoreChangeHandler" min="0"></el-input></div></el-col>
          <el-col :span="2"><div class="form_disable_item"><el-input placeholder="B类" type="number" v-model="scoreDetail.check_b" @change="scoreChangeHandler" min="0"></el-input></div></el-col>
          <el-col :span="2"><div class="form_disable_item"><el-input placeholder="C类" type="number" v-model="scoreDetail.check_c" @change="scoreChangeHandler" min="0"></el-input></div></el-col>
          <el-col :span="2"><div class="form_disable_item"><el-input placeholder="D类" type="number" v-model="scoreDetail.check_d" @change="scoreChangeHandler" min="0"></el-input></div></el-col>
          <el-col :span="2"><div >检查项扣分:<span style="color: red">{{scoreDetail.score}}</span></div></el-col>
        </el-row>
      </div>
    </div>

<!--2020 评分表-->
    <el-table :data="dataList" :span-method="objectSpanMethod" border v-loading="dataListLoading" v-if="score2Visible"
              :header-cell-style="tableHeaderColor" style="width: 100%;">
      <el-table-column prop="qualityCate" header-align="center" align="center" label="质量元素类别" width="140"></el-table-column>
      <el-table-column prop="scoreRadio" header-align="center" align="center" label="评分权重" width="90"></el-table-column>
      <el-table-column prop="typeaName" header-align="center" align="center" label="A类错误(-42)"></el-table-column>
      <el-table-column prop="checkA" header-align="center" align="center" label="A类错漏数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkA" size="mini" :min="0" :max="100" class="te_input"
            v-if="scope.row.typeaName != null && scope.row.typeaName != ''" @change="scoreNewChangeHandler()"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="typebName" header-align="center" align="center" label="B类错误(-12)"></el-table-column>
      <el-table-column prop="checkB" header-align="center" align="center" label="B类错漏数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkB" size="mini" :min="0" :max="100" class="te_input"
                           v-if="scope.row.typebName != null && scope.row.typebName != ''" @change="scoreNewChangeHandler()"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="typecName" header-align="center" align="center" label="C类错误(-4)"></el-table-column>
      <el-table-column prop="checkC" header-align="center" align="center" label="C类错漏数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkC" size="mini" :min="0" :max="100" class="te_input"
                           v-if="scope.row.typecName != null && scope.row.typecName != ''" @change="scoreNewChangeHandler()"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="typedName" header-align="center" align="center" label="D类错误(-1)"></el-table-column>
      <el-table-column prop="checkD" header-align="center" align="center" label="D类错漏数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.checkD" size="mini" :min="0" :max="100" class="te_input"
                           v-if="scope.row.typedName != null && scope.row.typedName != ''" @change="scoreNewChangeHandler()"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="检查项扣分">
        <template slot-scope="scope">
          <span style="color: red">
            {{parseInt(scope.row.checkA) * 42 + parseInt(scope.row.checkB) * 12 + parseInt(scope.row.checkC) * 4 + parseInt(scope.row.checkD)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="质量元素扣分">
        <template slot-scope="scope">
          <span style="color: red;font-size: 12pt;">{{scope.row.delScore}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="form_title_footer">总分：<span style="color: #00b7ee">{{allScore}}</span></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        visible: false,
        loading: true,
        dataListLoading: false,
        dataList: [], // 质量评分表
        errorForm: {
          errorPoint: 0, // 点位中误差
          errorSpace: 0, // 间距中误差
          errorHeigh: 0 // 高程中误差
        },
        dataForm: {
          fileNo: ''
        },
        checkcontent: [
          // 19-6年检查内容
          '坐标系统、高程系统的正确性',
          '投影参数、转换参数的正确性',
          '起算数据及选用的正确性、可靠性',
          '控制测量成果',
          '平面坐标精度',
          '平面相对位置精度',
          '高程精度',
          '要素错误、缺漏情况',
          '属性错误、缺漏情况',
          '数据及结构的正确性',
          '图面表达质量',
          '表格表达质量',
          '计算质量',
          '技术文档表达质量',
          '资料完整性、规范性',
          // 19-12年检查内容
          '作业依据、原始资料（含行政审批资料）使用的正确性、有效性',
          '平面、高程基准（包括投影、转换参数）',
          '平面坐标精度',
          '相对位置（或边长）精度',
          '高程精度',
          '其他',
          '仪器及其使用的符合性',
          '作业内容、范围的符合性',
          '作业记录的规范性',
          '作业记录的正确性、完整性',
          '作业内容（要素、数据）错误情况',
          '作业内容（要素、数据）缺漏情况',
          '属性（定性、分类）错误情况',
          '属性（定性、分类）缺漏情况',
          '图面符号、线划、色彩表达的正确性',
          '图面注记内容及大小的正确性',
          '平差计算过程及结果正确性',
          '其他',
          '图面表达清晰性（符号、注记叠压等）',
          '成果表的清晰、完整、正确性',
          '技术文档内容的完整性',
          '技术文档内容的正确性、标准规范符合性',
          '图、文（表）一致性',
          '资料规整性（字体、大小、格式、页码、纸张大小）',
          '成果资料的齐全性'
    ],
        kjScore: 0, // 空间扣分
        cjScore: 0,   // 采集扣分
        cgScore: 0,  // 成果质量扣分
        allScore: 100, // 总分
        scoreDetailList: [], // 评分明细
        totalOutPut: 0,
        tOutPut: 0,  // 计算中的产值和占比
        tRate: 0,
        projectNo: '',
        scoreList: [],   // 分数列表
        spanArr: [],
        score1Visible: false, // 2019评分表
        score2Visible: false // 2020评分表
      }
    },
    mounted () {

    },
    methods: {
      init (projectNo) {
        this.dataListLoading = true
        this.projectNo = projectNo
        this.initScoreTypeList()
        this.getErrorForm(projectNo).then(errorForm => {
          if (!stringIsNull(errorForm)) {
            this.errorForm = errorForm
          }
        })
        this.getQualityScoreList(projectNo).then(data => {
          this.scoreList = data
          // 2019 年评分方式
          if (data.length > 0 && data[0].typeId < 100) {
            this.score1Visible = true
            this.score2Visible = false
            for (let scoreItem of this.scoreList) {
              for (let detail of this.scoreDetailList) {
                if (detail.type_id === scoreItem.typeId) {
                  detail.check_a = scoreItem.checkA
                  detail.check_b = scoreItem.checkB
                  detail.check_c = scoreItem.checkC
                  detail.check_d = scoreItem.checkD
                  detail.check_result = scoreItem.checkResult
                  detail.check_type = scoreItem.checkType
                }
              }
            }
            this.scoreChangeHandler()
            this.dataListLoading = false
          } else {
            // 2020 年评分方式
            this.score1Visible = false
            this.score2Visible = true
            this.getQualityScoreList(projectNo).then(data => {
              this.getScoreFileList().then(fileList => {
                this.fileList = fileList
                if (fileList.length > 0) this.dataForm.fileNo = fileList[0]
                this.getDataList(this.dataForm.fileNo).then(list => {
                  for (let checkItem of list) {
                    for (let scoreItem of data) {
                      if (scoreItem.typeId === checkItem.typeId) {
                        checkItem.checkA = scoreItem.checkA
                        checkItem.checkB = scoreItem.checkB
                        checkItem.checkC = scoreItem.checkC
                        checkItem.checkD = scoreItem.checkD
                        break
                      }
                    }
                  }
                  this.dataList = list
                  this.scoreNewChangeHandler()
                  this.dataListLoading = false
                })
              })
            })
          }
        })
        this.visible = true
      },
      /**
       * 初始化评分列表
       */
      initScoreTypeList () {
        this.scoreDetailList = []
        for (var i = 15; i < this.checkcontent.length ; i++) {
          let scoreDetail = {
            checkcontent: this.checkcontent[i],
            check_a: '',
            check_b: '',
            check_c: '',
            check_d: '',
            check_result: '',
            check_type: '',
            project_no: this.projectNo,
            score: 0,   // 扣除总分
            type_id: i + 1
          }
          this.scoreDetailList.push(scoreDetail)
        }
      },
      scoreChangeHandler () {
        this.kjScore = 0
        this.cjScore = 0
        this.cgScore = 0
        this.scoreDetailList.forEach((item, index) => {
          item.score = (item.check_a === '' ? 0 : item.check_a * 42)
                      + (item.check_b === '' ? 0 : item.check_b * 12)
                      + (item.check_c === '' ? 0 : item.check_c * 4)
                      + (item.check_d === '' ? 0 : item.check_d * 1)
          if (index >= 0 && index < 6) this.kjScore += item.score
          if (index >= 6 && index < 18) this.cjScore += item.score
          if (index >= 18) this.cgScore += item.score
        })
        this.allScore = (100 - 0.3 * this.kjScore - 0.4 * this.cjScore - 0.3 * this.cgScore).toFixed(2)
      },
      // 根据项目编号获取质量评分列表
      getQualityScoreList (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/qualityscore/list`),
            method: 'get',
            params: this.$http.adornParams(
              { 'projectNo': projectNo }
            )
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
      // 合并单元格
      objectSpanMethod ({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 11) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      // 修改table header的背景色
      tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: lightblue;color: #fff;font-weight: 700;line-height:200%;font-size:12pt'
        }
      },
      // 根据项目编号获取点、间距、高程误差
      getErrorForm (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkerror/info/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.checkError)
            }
          })
        })
      },
      // 质量评分初始化（2020-08-15）
      scoreNewChangeHandler () {
        let delScoreList = []
        let delScore = 0
        let id = 0
        for (let index = 0; index < this.spanArr.length; index++) {
          if (this.spanArr[index] !== 0 && index !== 0) {
            delScoreList.push({
              id: id,
              delScore: delScore,
              ratio: this.dataList[index - 1].scoreRadio
            })
            id = index
            delScore = 0
          }
          delScore += (parseFloat(this.dataList[index].checkA) * 42 +
            parseFloat(this.dataList[index].checkB) * 12 +
            parseFloat(this.dataList[index].checkC) * 4 +
            parseFloat(this.dataList[index].checkD))
        }
        if (delScore !== 0) {
          delScoreList.push({
            id: id,
            delScore: delScore,
            ratio: this.dataList[this.dataList.length - 1].scoreRadio
          })
        }
        // 合计扣分项
        let allDelScore = 0
        for (let dscore of delScoreList) {
          this.dataList[dscore.id].delScore = (dscore.delScore * dscore.ratio).toFixed(2)
          allDelScore += parseFloat(this.dataList[dscore.id].delScore)
        }
        this.allScore = (100 - allDelScore).toFixed(2)
      },
      // 获取数据列表
      getDataList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/qualityscore/list'),
            method: 'get',
            params: this.$http.adornParams({
              fileNo: this.dataForm.fileNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.spanArr = []
              let pos = 0
              for (let i = 0; i < data.list.length; i++) {
                data.list[i].checkA = 0
                data.list[i].checkB = 0
                data.list[i].checkC = 0
                data.list[i].checkD = 0
                data.list[i].delScore = 0
                if (i === 0) {
                  this.spanArr.push(1)
                  pos = 0
                } else {
                  // 判断当前元素与上一个元素是否相同
                  if (data.list[i].qualityCate === data.list[i - 1].qualityCate) {
                    this.spanArr[pos] += 1
                    this.spanArr.push(0)
                  } else {
                    this.spanArr.push(1)
                    pos = i
                  }
                }
              }
              resolve(data.list)
            } else {
              this.dataList = []
            }
          })
        })
      },
      // 获取评分列表文件
      getScoreFileList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/qualityscore/fileList'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            }
          })
        })
      },
      // 提交评分明细
      dataFormSubmit () {
        let scoreList = []
        for (let detail of this.dataList) {
          if (detail.checkA !== 0 || detail.checkB !== 0 || detail.checkC !== 0 || detail.checkD !== 0) {
            scoreList.push({
              'checkA': detail.checkA,
              'checkB': detail.checkB,
              'checkC': detail.checkC,
              'checkD': detail.checkD,
              'checkResult': detail.check_result,
              'checkType': detail.check_type,
              'projectNo': this.projectNo,
              'typeId': detail.typeId
            })
          }
        }
        this.$http({
          url: this.$http.adornUrl(`/project/qualityscore/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'scoreList': scoreList,
            'projectNo': this.projectNo,
            'qualityScore': this.allScore,
            'errorPoint': this.errorForm.errorPoint,
            'errorSpace': this.errorForm.errorSpace,
            'errorHeigh': this.errorForm.errorHeigh
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList', this.allScore)
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .form_line{
    border-bottom: 1px dotted #ccc;
    border-radius: 0px;
  }
  .form_disable_item{
    border: 1px dotted #ccc;
    color: #757575;
    padding:1px;
  }
  .form_title {
    color: black;
    font-weight: 700;
    font-size: 18px;
    margin-top: 10px;
  }
  .form_title .from_span{
    color: black;
    font-weight: 500;
    font-size: 15px;
  }
  .form_title_footer {
    color: black;
    font-weight: 700;
    font-size: 18px;
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .te_input {
    width:90px;
    color: #00a0e9
  }
  .te_input > input{
    color: #00a0e9;
  }
  .item .el-form-item__label{
    color: #00a0e9;
  }
</style>
