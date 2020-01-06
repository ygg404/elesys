<template>
  <div class="mod-config">
    <div align="center" id="printId" >
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:16.0pt;font-family:黑体">质量审核单</span></p>
      <div class="tablecss">
        <div class="block">
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;">项目名称</div>
          <div class="tdstyle" style="width: 300pt;border-right: 1px solid black;">{{projectInfo.projectName}}</div>
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;">项目编号</div>
          <div class="tdstyle" style="width: 128pt;" >{{projectInfo.projectNo}}</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;border-top: 1px solid black;">委托单位</div>
          <div class="tdstyle" style="width: 300pt;border-right: 1px solid black;border-top: 1px solid black;">{{projectInfo.projectAuthorize}}</div>
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;border-top: 1px solid black;">项目类型</div>
          <div class="tdstyle" style="width: 128pt;border-top: 1px solid black;" >{{projectInfo.projectType}}</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;border-top: 1px solid black;">技术要求</div>
          <div class="tdstyle" style="width: 510pt;border-top: 1px solid black;min-height: 25pt;">{{projectInfo.workRequire}}</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1px solid black;text-align: left;">返修记录：</div>
        </div>
        <div class="block" >
          <el-row v-if="backWorkList.length === 0" style="width: 590pt;">
            <el-col :span="2" >&nbsp;</el-col>
            <el-col :span="20" style="text-align: left;">无</el-col>
            <el-col :span="2" >&nbsp;</el-col>
          </el-row>
        </div>
        <div class="block" v-if="backWorkList.length !== 0">
          <el-row style="width: 590pt;">
            <el-col :span="1" >&nbsp;</el-col>
            <el-col :span="5"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 返修日期</div></el-col>
            <el-col :span="8"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 返修要求</div></el-col>
            <el-col :span="9"><div class="tableborder_end" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 修改说明</div></el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
        </div>
        <div class="block" v-for="(item, index) in backWorkList" :key ="item.id">
          <el-row  style="width: 590pt;">
            <el-col :span="1" >&nbsp;</el-col>
            <el-col :span="5"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.backCreateTime}}</div></el-col>
            <el-col :span="8"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.backNote}}</div></el-col>
            <el-col :span="9"><div class="tableborder_end" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.submitNote}}</div></el-col>
            <el-col :span="1" >&nbsp;</el-col>
          </el-row>
        </div>
        <div class="block" v-if="backWorkList.length !== 0">
          <el-row  style="width: 590pt;">
            <el-col :span="1" >&nbsp;</el-col>
            <el-col :span="22"><div  style="border-top:1.0000pt solid #8c939d;min-height: 21.7500pt;line-height: 150%;text-align: left;">&nbsp;</div></el-col>
            <el-col :span="1" >&nbsp;</el-col>
          </el-row>
        </div>
        <div class="block">
          <el-row  style="width: 590pt;">&nbsp;</el-row>
        </div>
        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1px solid black;text-align: left;">质量评分明细：</div>
        </div>
        <div class="block">
          <el-row  style="width: 590pt;">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22">
              <table style="width:100%;margin:0 auto" border="1" cellspacing="0">
                <tr><th>检查内容</th><th>检查类型</th><th>检查结果</th><th>错漏数量A类</th><th>错漏数量B类</th><th>错漏数量C类</th><th>错漏数量D类</th><th>检查项扣分</th></tr>
                <!--19年检查项-->
                <tr v-if="preShow"><td colspan="8">空间基准质量(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{kjScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 0 & item.typeId < 4">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
                <tr v-if="preShow"><td colspan="8">采集、定处理质量(权:0.4) <span class="from_span">质量元素扣分: <span style="color: red">{{cjScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 4 & item.typeId < 10">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
                <tr v-if="preShow"><td colspan="8">成果质量(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{cgScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 10 & item.typeId <= 15">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
                <!--20年检查项-->
                <tr v-if="nextShow"><td colspan="8">作业依据、空间基准及数学精度(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{zcScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId > 15 & item.typeId < 22">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
                <tr v-if="nextShow"><td colspan="8">数据采集、处理质量(权:0.4) <span class="from_span">质量元素扣分: <span style="color: red">{{dcScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 22 & item.typeId < 34">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
                <tr v-if="nextShow"><td colspan="8">成果资料质量(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{gcScore}}</span></span></td></tr>
                <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 34 & item.typeId < 43">
                  <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
                </tr>
              </table>
            </el-col>
          </el-row>
        </div>
        <div class="block">
          <el-row  style="width: 590pt;">&nbsp;</el-row>
        </div>
        <div class="block">
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;border-top: 1px solid black;">质量评分</div>
          <div class="tdstyle" style="width: 300pt;border-right: 1px solid black;border-top: 1px solid black;">{{projectInfo.qualityScore}}</div>
          <div class="ththead" style="width: 80pt;border-right: 1px solid black;border-top: 1px solid black;">质量等级</div>
          <div class="tdstyle" style="width: 128pt;border-top: 1px solid black;" >{{projectInfo.qualityLevel}}</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1px solid black;text-align: left;">质量综述：</div>
        </div>
        <div class="block">
          <div class="tdstyle" style="width: 590pt;text-align: left;min-height: 40pt;">{{projectInfo.qualityNote}}</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 195pt;border-top: 1px solid black;border-right: 1px solid black;text-align: left;min-height: 65pt;">项目负责人签名：</div>
          <div class="ththead" style="width: 195pt;border-top: 1px solid black;border-right: 1px solid black;text-align: left;min-height: 65pt;">质检员签名：</div>
          <div class="ththead" style="width: 200pt;border-top: 1px solid black;text-align: left;">质检审核员签名：</div>
        </div>
        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1px solid black;text-align: left;min-height: 25pt;">备注：</div>
        </div>
      </div>
    </div>
    <div style="text-align: center;width: 100%;margin-top: 20px;">
      <el-button type="primary" icon="el-icon-printer" size="large" @click="printChart">打印</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        checkcontent: [
          // 19年检查内容
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
          // 20年检查内容
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
        projectInfo: '',
        backWorkList: [],
        kjScore: 0, // 空间扣分
        cjScore: 0,   // 采集扣分
        cgScore: 0,  // 成果质量扣分
        zcScore: 0,   // 作业依据扣分
        dcScore: 0,   // 数据采集扣分
        gcScore: 0,   // 成果表扣分
        scoreDetailList: [], // 评分明细
        preShow: false, // 19年检查显示
        nextShow: true  // 20年检查显示
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(projectNo)
        this.getBackworkHandle(projectNo)
        this.getQualityScoreList(projectNo).then(data => {
          this.initScoreTypeList(data)
        })
      },
      // 初始化评分列表
      initScoreTypeList (datalist) {
        this.kjScore = 0
        this.cjScore = 0
        this.cgScore = 0
        datalist.forEach((item, index) => {
          item.kjShow = false
          item.cjShow = false
          item.cgShow = false
          item.checkcontent = this.checkcontent[item.typeId - 1]
          item.score = (item.checkA === '' ? 0 : item.checkA * 42)
            + (item.checkB === '' ? 0 : item.checkB * 12)
            + (item.checkC === '' ? 0 : item.checkC * 4)
            + (item.checkD === '' ? 0 : item.checkD * 1)
          // 19年 检查项
          if (item.typeId >= 0 && item.typeId < 4) {
            this.kjScore += item.score
            this.preShow = true
            this.nextShow = false
          }
          if (item.typeId >= 4 && item.typeId < 10) {
            this.cjScore += item.score
            this.preShow = true
            this.nextShow = false
          }
          if (item.typeId >= 10 && item.typeId < 16) {
            this.cgScore += item.score
            this.preShow = true
            this.nextShow = false
          }
          // 20年 检查项
          if (item.typeId > 15 && item.typeId < 22) {
            this.zcScore += item.score
            this.preShow = false
            this.nextShow = true
          }
          if (item.typeId >= 22 && item.typeId < 34) {
            this.dcScore += item.score
            this.preShow = false
            this.nextShow = true
          }
          if (item.typeId >= 34 && item.typeId < 43) {
            this.gcScore += item.score
            this.preShow = false
            this.nextShow = true
          }
        })

        this.scoreDetailList = datalist
      },
      // 获取项目基本信息
      getInfoByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/projectInfo/print/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              data.projectInfo.executeStandard = '☑' + data.projectInfo.executeStandard.replace(/;/g, '☑').slice(0, -1)
              if (data.projectInfo.qualityScore < 60) {
                data.projectInfo.qualityLevel = '不合格'
              } else if (data.projectInfo.qualityScore >= 60 && data.projectInfo.qualityScore <= 70) {
                data.projectInfo.qualityLevel = '合格'
              } else if (data.projectInfo.qualityScore > 70 && data.projectInfo.qualityScore < 90) {
                data.projectInfo.qualityLevel = '良'
              } else if (data.projectInfo.qualityScore >= 90) {
                data.projectInfo.qualityLevel = '优'
              }
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取返修内容列表
      getBackworkHandle (projectNo) {
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.backWorkList = data.list
          } else {
            this.backWorkList = []
          }
        })
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
      // 打印报表
      printChart () {
        const print = document.getElementById('printId').innerHTML
        // 把当前页面替换成要打印的内容
        document.body.innerHTML = print
        // 打印
        window.print()
        // 刷新页面
        window.location.reload()
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-printwork')
      }
    }
    // watch: {
    //   '$route': function (to, from) {
    //     this.projectNo = to.query['projectNo']
    //     // 执行数据更新查询
    //     if (to.name === 'project-printwork') {
    //       this.init()
    //     } else {
    //       this.goBack()
    //     }
    //   }
    // }
  }
</script>

<style scoped>
  .tableborder_end{
    text-align: center;
    vertical-align: middle;
    border-left:1.0000pt solid #8c939d;
    mso-border-left-alt:1.0000pt solid #8c939d;
    border-right:1.0000pt solid #8c939d;
    mso-border-right-alt:0.5000pt solid #8c939d;
    border-top:1.0000pt solid #8c939d;
    padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;
  }
  .tableborder{
    text-align: center;
    vertical-align: middle;
    border-left:1.0000pt solid #8c939d;
    mso-border-left-alt:1.0000pt solid #8c939d;
    /*border-right:1.0000pt solid windowtext;*/
    mso-border-right-alt:0.5000pt solid #8c939d;
    border-top:1.0000pt solid #8c939d;
    padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;
  }


  .tablecss{
    margin-top: 5px;
    width: 591pt;
    border: 1px solid windowtext;
  }

  div .block{
    overflow:hidden;
    display: flex;
  }
  div .block .ththead{
    padding: 2px;
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
    display:block;
    float:left;
    text-align:center;
    align-items: stretch;
  }
  div .block .tdstyle{
    padding: 2px;
    font-family:宋体;
    color:rgb(0,0,0);
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
    display:block;
    float:left;
    text-align:center;
    align-items: stretch;
  }
</style>
