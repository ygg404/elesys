<template>
  <div class="mod-config">
    <div align="center" id="printId" v-loading="loading" element-loading-text="加载中。。。">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:16.0pt;font-family:黑体">任务单</span></p>
      <div class="tablecss">
        <div class="block">
          <div class="smallTitleStyle" style="border-bottom:1pt solid black;">项目名称</div>
          <div class="smallContentStyle w300brbt">{{projectInfo.projectName}}</div>
          <div class="smallTitleStyle" style="border-bottom:1pt solid black;">项目编号</div>
          <div class="mytdstyle" style="border-bottom:1pt solid black; width: 129pt;" >{{projectInfo.projectNo}}</div>
        </div>

        <div class="block">
          <div class="smallTitleStyle">委托单位</div>
          <div class="smallContentStyle" style="width: 300pt;">{{projectInfo.projectAuthorize}}</div>
          <div class="smallTitleStyle" >项目类型</div>
          <div class="mytdstyle" style="width: 129pt;">{{projectInfo.projectType}}</div>

        </div>
        <div class="block">
          <div class="bigTitleStyle">
            执行标准
          </div>
          <div class="bigContentStyle" style="width: 510pt;border-top: 1pt solid black;min-height: 25pt;">{{projectInfo.executeStandard}}</div>
        </div>
        <div class="block">
          <div class="bigTitleStyle" >
            作业内容及技术要求
          </div>
          <div class="bigContentStyle" style="width: 510pt;border-top: 1pt solid black;min-height: 25pt;">{{projectInfo.workNote}}{{projectInfo.workRequire}}</div>
        </div>
        <div class="block">
          <div class="bigTitleStyle" >
            外业作业安全交底
          </div>
          <div class="bigContentStyle" style="width: 510pt;border-top: 1pt solid black;min-height: 25pt;">{{projectInfo.safeRequire}}</div>
        </div>

        <div class="block">
          <div class="smallTitleStyle bt" ></div>
          <div class="smallContentStyle bt" style=" width: 300pt;border-right: 1pt solid black;"></div>
          <div class="smallTitleStyle bt" >预算产值(元)</div>
          <div class="mytdstyle bt" style="width: 129pt;">{{projectInfo.projectOutput}}</div>
        </div>

        <div class="block">
          <div class="lastbigTitleStyle">作业部门</div>

          <div class="tdstyle" style="width: 300pt;border-top: 1pt solid black;border-right: 1pt solid black;">

            <div class="smallContentStyle w300brbt">{{projectInfo.groupName}}</div>
            <div class="tdstyle" style="width: 300pt;">
              <div class="ththead lastTwosmallTitleStyle" style="width: 70pt;border-right: 1pt solid black;">最短工期</div>
              <div class="tdstyle limitTimeStyle"  style="width: 70pt;border-right: 1pt solid black;">
                {{projectInfo.shortDateTime}}
              </div>
              <div class="ththead lastTwosmallTitleStyle" style="width: 70pt;border-right: 1pt solid black;">最迟工期</div>
              <div class="ththead lastTwosmallTitleStyle" style="font-weight:normal;">
                {{projectInfo.lastDateTime}}
              </div>
            </div>
          </div>

          <div class="block">
            <div class="ththead" style="width: 80pt;border-top: 1pt solid black;border-right: 1pt solid black;">
              <!--两个DIV-->
              <div class="lastTwosmallTitleStyle" style="border-bottom:1pt solid black;">项目负责人</div>
              <div class="lastTwosmallTitleStyle">开工日期</div>
            </div>
            <div class="tdstyle " style="width: 129pt;border-top: 1pt solid black;" >
              <!--两个DIV-->
              <div class="lastTwoContentTitleStyle" style="border-bottom:1pt solid black;">{{projectInfo.projectCharge}}</div>
              <div class="lastTwoContentTitleStyle">{{projectInfo.projectBegunDateTime}}</div>
            </div>
          </div>
        </div>

        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1pt solid black;text-align: left;">
            <div style="padding:5pt;font-size:13pt;">项目成果清单：</div>
            <table border="0" cellspacing="0" cellpadding="0" width="700pt" class="billTableStyle">
              <tr>
                <th class="thspan" width="25%">项目</th>
                <th class="thspan" width="25%">规格</th>
                <th class="thspan" width="25%">数量(份)</th>
                <th class="thspan" width="25%">备注</th>
              </tr>
              <tr v-for="item in billList">
                <td style="padding:3pt; text-align:center;">{{item.billName}}</td>
                <td style="padding:3pt;text-align:center;">{{item.spec}}</td>
                <td style="padding:3pt;text-align:center;">{{item.num}}</td>
                <td style="padding:3pt;text-align:center;">{{item.remark}}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="block">
          <div class="ththead" style="width: 590pt;border-top: 1pt solid black;text-align: left;">
            <div style="padding:5pt;font-size:13pt;">岗位职责：</div>
            <table border="0" cellspacing="0" cellpadding="0" width="700pt" class="billTableStyle">
              <tr>
                <th class="thspan" width="33%">职责</th>
                <th class="thspan" width="33%">姓名</th>
                <th class="thspan" width="33%">任务分工</th>
              </tr>
              <!--for循环绑定数据-->
              <tr>
                <td class="thspan">项目技术负责人</td>
                <td style="padding:3pt;text-align:center;">{{projectMtask.projectCharge}}</td>
                <td style="padding:3pt;text-align:center;"> {{projectMtask.chargeTask}}</td>
              </tr>
              <tr>
                <td class="thspan">项目组成员1</td>
                <td style="padding:3pt;text-align:center;">{{projectMtask.projectMenber1}}</td>
                <td style="padding:3pt;text-align:center;"> {{projectMtask.menber1Task}}</td>
              </tr>
              <tr>
                <td class="thspan">项目组成员2</td>
                <td style="padding:3pt;text-align:center;">{{projectMtask.projectMenber2}}</td>
                <td style="padding:3pt;text-align:center;">{{projectMtask.menber2Task}}</td>
              </tr>
              <tr>
                <td class="thspan">项目组成员3</td>
                <td style="padding:3pt;text-align:center;">{{projectMtask.projectMenber3}}</td>
                <td style="padding:3pt;text-align:center;"> {{projectMtask.menber3Task}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="footer_line">
      <el-button type="primary" icon="el-icon-printer" size="large" @click="printChart">打印</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        loading: false,
        projectInfo: '',
        projectMtask: '',
        billList: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(projectNo).then( list => {
          list[0].executeStandard = '☑' + list[0].executeStandard.replace(/;/g, '☑').slice(0, -1)
          list[0].safeRequire = list[0].safeRequire == null ? '' : list[0].safeRequire.replace(/\n/g, '。 ') + '。'
          // 工作组
          let groupName = ''
          for (let group of list) {
            groupName += group.groupName + '、'
          }
          list[0].groupName = groupName.substring(0, groupName.length - 1)
          this.projectInfo = list[0]
        })
        this.getMtaskByProjectNo(projectNo).then(data => {
          this.projectMtask = data == null ? {} : data
        })
        this.getBillByProjectNo(projectNo).then(list => {
          this.billList = list
        })
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
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目成果清单列表信息
      getBillByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/bill/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
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
      // 获取岗位列表信息
      getMtaskByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/mtask/info`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.projectMtask)
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
    margin-top: 5pt;
    width: 591pt;
    border: 1pt solid windowtext;
  }

  div .block{
    overflow:hidden;
    display: flex;
  }
  div .block .ththead{

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
    /* padding: 2pt;  */
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
  table td{
    text-align: center;
  }

  .bigTitleStyle{
    padding: 4pt;
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:60pt;
    width: 79.4pt;
    /* border-right: 1pt solid black; */
    border-top: 1pt solid black;
  }
  .lastbigTitleStyle{
    padding: 4pt;
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:40pt;
    width: 80pt;
    border-right: 1pt solid black;
    border-top: 1pt solid black;
  }

  .smallTitleStyle{
    padding: 4pt;
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:25pt;
    width: 80pt;
    border-right: 1pt solid black;
  }
  .smallContentStyle{
    padding: 2pt;
    font-family:宋体;
    color:rgb(0,0,0);
    font-style:normal;
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    /* border-bottom: 1pt solid black; */
    min-height:25pt;width: 80pt;border-right: 1pt solid black;
  }
  .mytdstyle{
    padding: 2pt;
    font-family:宋体;
    color:rgb(0,0,0);
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
    /* display:block;
    float:left; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* align-items: stretch; */
  }
  .bigContentStyle{
    padding: 8pt;
    font-family:宋体;
    color:rgb(0,0,0);
    font-style:normal;
    font-size:10.5000pt;
    mso-font-kerning:0.0000pt;
    display:block;
    float:left;
    text-align:center;
    align-items: stretch;
    border-left:1pt solid black;
  }
  .bt{
    border-top:1pt solid black;
  }
  .lastTwosmallTitleStyle{
    padding: 4pt;
    font-family:黑体;
    mso-hansi-font-family:宋体;
    color:rgb(0,0,0);
    font-weight:bold;
    font-style:normal;
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:25pt;
    width: 80pt;
  }
  .lastTwoContentTitleStyle{
    font-size:11pt;
    mso-font-kerning:0.0000pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:25pt;
  }
  .w300brbt{
    width: 300pt;border-right: 1pt solid black; border-bottom: 1pt solid black;
  }
  .limitTimeStyle{
    padding: 4pt;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height:25pt;
    /* width: 80pt; */
  }
  .billTableStyle{
    margin:auto;
    font-weight:normal;
    font-family:宋体;
    font-size:11pt;
    margin-bottom:10pt;
    border-left: 1pt solid;
    border-top: 1pt solid;
  }
  .billTableStyle th{
    margin:auto;
    font-weight:normal;
    font-family:宋体;
    font-size:11pt;
    margin-bottom:10pt;
    border-right: 1pt solid;
    border-bottom: 1pt solid;
  }

  .billTableStyle td {
    margin: auto;
    font-weight: normal;
    font-family: 宋体;
    font-size: 11pt;
    margin-bottom: 10pt;
    border-right: 1pt solid;
    border-bottom: 1pt solid;
  }

  .ththead .thspan {
    font-weight: 700;
    text-align: center;
    padding: 3pt;
  }
  .footer_line {
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
</style>
