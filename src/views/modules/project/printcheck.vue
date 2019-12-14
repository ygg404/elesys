<template>
  <div class="mod-config">
    <div align="center" id="printId" >
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:16.0pt;font-family:黑体">质量审核单</span></p>
      <td align="center" >
        <table class="MsoNormalTable" border="1" cellspacing="0" style="border-collapse:collapse;width:590.9000pt;margin-left:4.6500pt;border:none;mso-padding-alt:1.0000pt 1.0000pt 1.0000pt 1.0000pt ;padding: 1px;">
          <el-row >
            <el-col :span="3"><div class="tdborder tdthead"> 项目名称</div></el-col>
            <el-col :span="12"><div class="tdborder tdline">{{projectInfo.projectName}}</div></el-col>
            <el-col :span="3"><div class="tdborder tdthead">项目编号</div></el-col>
            <el-col :span="6"><div class="tdborder_end tdline">{{projectInfo.projectNo}}</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="3"><div class="tdborder tdthead"> 委托单位</div></el-col>
            <el-col :span="12"><div class="tdborder tdline">{{projectInfo.projectAuthorize}}</div></el-col>
            <el-col :span="3"><div class="tdborder tdthead">项目类型</div></el-col>
            <el-col :span="6"><div class="tdborder_end tdline">{{projectInfo.projectType}}</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="3"><div class="tdborder tdthead" style="min-height: 21.7500pt;line-height: 200%;"> 技术要求</div></el-col>
            <el-col :span="21"><div class="tdborder_end tdline" style="min-height: 21.7500pt;line-height: 200%;">{{projectInfo.workRequire}}</div></el-col>
          </el-row>
          <el-row ><el-col :span="24"><div class="tdborder_end tdthead" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 返修记录：</div></el-col></el-row>
          <el-row v-if="backWorkList.length === 0">
            <el-col :span="2" style="border-left: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
            <el-col :span="20">无</el-col>
            <el-col :span="2" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
          </el-row>
          <tr v-if="backWorkList.length !== 0">
            <el-row >
              <el-col :span="2" style="border-left: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="6"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 返修日期</div></el-col>
                  <el-col :span="9"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 返修要求</div></el-col>
                  <el-col :span="9"><div class="tableborder_end" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 修改说明</div></el-col>
                </el-row>
              </el-col>
              <el-col :span="2" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
            </el-row>
            <el-row v-for="(item, index) in backWorkList" :key ="item.id" >
              <el-col :span="2" style="border-left: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="6"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.backCreateTime}}</div></el-col>
                  <el-col :span="9"><div class="tableborder" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.backNote}}</div></el-col>
                  <el-col :span="9"><div class="tableborder_end" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> {{item.submitNote}}</div></el-col>
                </el-row>
              </el-col>
              <el-col :span="2" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
            </el-row>
            <el-row >
              <el-col :span="2" style="border-left: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
              <el-col :span="20" style="border-top:1px solid #8c939d">&nbsp;</el-col>
              <el-col :span="2" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;">&nbsp;</el-col>
            </el-row>
          </tr>
          <el-row class="tdborder_end" ><div class="tdthead" style="min-height: 21.7500pt;line-height: 150%;text-align: left;"> 质量评分明细：</div></el-row>
          <el-row  style="text-align: center;border-left: 1px solid windowtext;border-right: 1px solid windowtext;">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22">
            <table style="width:100%;margin:0 auto" border="1" cellspacing="0">
              <tr><th>检查内容</th><th>检查类型</th><th>检查结果</th><th>错漏数量A类</th><th>错漏数量B类</th><th>错漏数量C类</th><th>错漏数量D类</th><th>检查项扣分</th></tr>
              <tr><td colspan="8">空间基准质量(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{kjScore}}</span></span></td></tr>
              <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 0 & item.typeId < 4">
                <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
              </tr>
              <tr><td colspan="8">采集、定处理质量(权:0.4) <span class="from_span">质量元素扣分: <span style="color: red">{{cjScore}}</span></span></td></tr>
              <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 4 & item.typeId < 10">
                <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
              </tr>
              <tr><td colspan="8">成果质量(权:0.3) <span class="from_span">质量元素扣分: <span style="color: red">{{cgScore}}</span></span></td></tr>
              <tr v-for="(item, index) in scoreDetailList" :key ="item.typeId" v-if="item.typeId >= 10">
                <td> {{item.checkcontent}}</td><td> {{item.checkType}}</td><td> {{item.checkResult}}</td><td> {{item.checkA}}</td><td> {{item.checkB}}</td><td> {{item.checkC}}</td><td> {{item.checkD}}</td><td> {{item.score}}</td>
              </tr>
            </table>
            </el-col>

          </el-row>
          <el-row style="border-left: 1px solid black;border-right: 1px solid black;">&nbsp;</el-row>
          <el-row class="tdborder_end">
            <el-col :span="6" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;" class="tdthead">质量得分</el-col>
            <el-col :span="6" style="border-right:1px solid windowtext;line-height: 150%;min-height: 21.7500pt;" >{{projectInfo.qualityScore}}</el-col>
            <el-col :span="6" style="border-right: 1px solid windowtext;line-height: 150%;min-height: 21.7500pt;" class="tdthead">质量等级</el-col>
            <el-col :span="6" style="line-height: 150%;min-height: 21.7500pt;">{{projectInfo.qualityLevel}}</el-col>
          </el-row>
          <el-row  class="tdborder_end tdthead" style="text-align: left">质量综述：</el-row>
          <el-row style="border-left: 1px solid black;border-right: 1px solid black;min-height: 40pt;">
              {{projectInfo.qualityNote}}
          </el-row>
          <el-row style="border-left: 1px solid black;border-right: 1px solid black;">&nbsp;</el-row>

          <el-row class=" tdborder_end tdthead" style="text-align: left;min-height: 60pt;">
            <el-col :span="8" style="border-right:1px solid windowtext;line-height: 150%;min-height: 60pt;">项目负责人签名：</el-col>
            <el-col :span="8" style="border-right:1px solid windowtext;line-height: 150%;min-height: 60pt;">质检员签名：</el-col>
            <el-col :span="8" style="min-height: 60pt;">质量审核人签名：</el-col>
          </el-row>
          <el-row class=" tdborder_end tdthead" style="text-align: left;min-height: 25pt;">备注：</el-row>
          <el-row  style="border-top: 1px solid black;">&nbsp;</el-row>
        </table>
      </td>
    </div>
    <div style="text-align: center;width: 100%;">
      <el-button type="primary" icon="el-icon-printer" size="large" @click="printChart">打印</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        checkcontent: ['坐标系统、高程系统的正确性',
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
          '资料完整性、规范性'],  // 检查内容
        projectInfo: '',
        backWorkList: [],
        kjScore: 0, // 空间扣分
        cjScore: 0,   // 采集扣分
        cgScore: 0,  // 成果质量扣分
        scoreDetailList: [] // 评分明细
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
        let kjShow = false
        let cjShow = false
        let cgShow = false
        datalist.forEach((item, index) => {
          item.kjShow = false
          item.cjShow = false
          item.cgShow = false
          item.checkcontent = this.checkcontent[item.typeId - 1]
          item.score = (item.checkA === '' ? 0 : item.checkA * 42)
            + (item.checkB === '' ? 0 : item.checkB * 12)
            + (item.checkC === '' ? 0 : item.checkC * 4)
            + (item.checkD === '' ? 0 : item.checkD * 1)
          if (item.typeId >= 0 && item.typeId < 4) {
            this.kjScore += item.score
            if (!kjShow) {
              kjShow = true
              item.kjShow = true
            }
          }
          if (item.typeId >= 4 && item.typeId < 10) {
            this.cjScore += item.score
            if (!cjShow) {
              cjShow = true
              item.cjShow = true
            }
          }
          if (item.typeId >= 10) {
            this.cgScore += item.score
            if (!cgShow) {
              cgShow = true
              item.cgShow = true
            }
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
  .tdborder{
    text-align: center;
    vertical-align: middle;
    border-left:1.0000pt solid windowtext;
    mso-border-left-alt:1.0000pt solid windowtext;
    /*border-right:1.0000pt solid windowtext;*/
    mso-border-right-alt:0.5000pt solid windowtext;
    border-top:1.0000pt solid windowtext;
    padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;
  }
  .tdborder_end{
    text-align: center;
    vertical-align: middle;
    border-left:1.0000pt solid windowtext;
    mso-border-left-alt:1.0000pt solid windowtext;
    border-right:1.0000pt solid windowtext;
    mso-border-right-alt:0.5000pt solid windowtext;
    border-top:1.0000pt solid windowtext;
    padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;
  }
  .tdthead{
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
  }
  .tdline{
    font-family:宋体;
    color:rgb(0,0,0);
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
  }
</style>
