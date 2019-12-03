<template>
  <div class="mod-config">
    <div align="center" id="printId">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:16.0pt;font-family:黑体">测绘任务书及流程记录表</span></p>
      <div align="center">
        <table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;margin-right: 10px;" >
          <tbody >
          <tr height="0">
            <td width="80" style="width:80.0pt;border:none"></td>
            <td width="80" style="width:80.0pt;border:none"></td>
            <td width="50" style="width:50.0pt;border:none"></td>
            <td width="50" style="width:50.0pt;border:none"></td>
            <td width="50" style="width:50.0pt;border:none"></td>
            <td width="89" style="width:80.0pt;border:none"></td>
            <td width="89" style="width:80.0pt;border:none"></td>
            <td width="50" style="width:50.0pt;border:none"></td>
            <td width="89" style="width:80.0pt;border:none"></td>
          </tr>
          <tr >
            <td style="border:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">项目名称</span></p>
            </td>
            <td colspan="5" style="border:solid black 1.0pt;border-left:none;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectName}}</span></p>
            </td>
            <td colspan="1" style="border:solid black 1.0pt;border-left:none;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">项目编号</span></p>
            </td>
            <td colspan="2" style="border:solid black 1.0pt;border-left:none;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectNo}}</span></p>
            </td>
          </tr>
          <tr>
            <td style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">委托单位</span></p>
            </td>
            <td colspan="5" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectAuthorize}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">项目类型</span></p>
            </td>
            <td colspan="2" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectType}}</span></p>
            </td>
          </tr>
          <tr style="height:42.15pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:42.15pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">执行标准</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:42.15pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.executeStandard}}</span></p>
            </td>
          </tr>
          <tr style="height:30.95pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">作业内容</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.workNote}}</span></p>
            </td>
          </tr>
          <tr style="height:30.95pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">技术要求</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.workRequire}}</span></p>
            </td>
          </tr>
          <tr>
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">编写人</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectWriter}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">日期</span></p>
            </td>
            <td colspan="2" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">审核人</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectCharge}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">日期</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
          </tr>
          <tr style="height:35.5pt">
            <td rowspan="2" style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:35.5pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">技术交<br>底内容</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:none;border-right:solid black 1.0pt;padding:5pt 8pt;height:35.5pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.technicalDisclosureNote}}</span></p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:none;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">接受人签名</span></p>
            </td>
            <td colspan="6" style="border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
            </td>
          </tr>
          <tr style="height:49.45pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:49.45pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">过程检<br>查情况</span></p>
            </td>
            <td colspan="8" style="border:none;border-right:solid black 1.0pt;padding:5pt 8pt;height:49.45pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.checkSuggestion}}</span></p>
            </td>
          </tr>
          <tr style="height:30.95pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">提交的成<br>果资料</span></p>
            </td>
            <td colspan="8" style="border-top:solid black 1.0pt;border-left:none;border-bottom:none;border-right:solid black 1.0pt;padding:5pt 8pt;height:30.95pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.dataName}}</span></p>
            </td>
          </tr>
          <tr style="height:70.5pt">
            <td rowspan="3" style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:60.5pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">工作小结</span></p>
            </td>
            <td colspan="8" style="border-top:solid black 1.0pt;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:60.5pt">
              <p class="MsoNormal"><span lang="EN-US" style="font-family:宋体">{{projectInfo.briefSummary}}</span></p>
            </td>
          </tr>
          <tr>
            <td style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">工作量</span></p>
            </td>
            <td colspan="7" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US" style="font-family:宋体">{{projectInfo.projectWorkload}}</span></p>
            </td>
          </tr>
          <tr>
            <td style="border:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">作业部门</span></p>
            </td>
            <td colspan="3" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"> {{projectInfo.groupName}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">项目负责人</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.projectCharge}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">日期</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
          </tr>
          <!--<tr style="height:30.95pt">-->
            <!--<td style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:30.95pt">-->
              <!--<p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">最终检<br>查情况</span></p>-->
            <!--</td>-->
            <!--<td colspan="8" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:30.95pt">-->
              <!--<p class="MsoNormal"><span lang="EN-US"></span></p>-->
            <!--</td>-->
          <!--</tr>-->
          <tr style="height:41.8pt">
            <td style="border:solid black 1.0pt;border-top:none;padding:5pt 8pt;height:41.8pt">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">质量综述</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;height:41.8pt">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.qualityNote}}</span></p>
            </td>
          </tr>
          <tr>
            <td style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">质量得分</span></p>
            </td>
            <td style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.qualityScore}}</span></p>
            </td>
            <td colspan="2" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">质量等级</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.qualityLevel}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">最终检查员</span><span lang="EN-US"> </span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">日期</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
          </tr>
          <tr>
            <td style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">审定意见</span></p>
            </td>
            <td colspan="4" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US">{{projectInfo.examineNote}}</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">审定人</span><span lang="EN-US"> </span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">日期</span></p>
            </td>
            <td colspan="1" style="border-top:none;border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal"><span lang="EN-US"></span></p>
            </td>
          </tr>
          <tr>
            <td style="border-top:none;border-left:solid black 1.0pt;border-bottom:solid black 1.0pt;border-right:solid windowtext 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:9.0pt;font-family:黑体">备注</span></p>
            </td>
            <td colspan="8" style="border-top:none;border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;padding:5pt 8pt;">
              <p class="MsoNormal" style="margin-bottom:3.1pt"><span lang="EN-US">=&nbsp;</span></p>
            </td>
          </tr>
          <tr>
            <td colspan="4" style="border:none"><p class="MsoNormal" align="center" style="text-align:left;"><span lang="EN-US" style="font-size:9.0pt">测绘任务书及流程记录表&nbsp;</span></p></td>
            <td colspan="5" style="border:none"><p class="MsoNormal" align="center" style="text-align:right;"><span lang="EN-US" style="font-size:9.0pt">广东杰信测绘科技有限公司&nbsp;</span></p></td>
          </tr>
          </tbody></table>
      </div>
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
        projectInfo: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(projectNo)
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
    },
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

</style>
