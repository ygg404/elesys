<template>
  <el-dialog width="45%" :title=dialogTitleName
             :close-on-click-modal="false" :visible.sync="visible">
    <el-card>
      <div align="center">
        <table border="2" bordercolor="black" width="300" cellspacing="0" cellpadding="5">
          <tr>
            <td rowspan="3">
              <div style="width:30px;" class="tac">
                <p class="pt">学历评分</p>
              </div>
            </td>
            <td>
              <div style="width:90px;" class="ts">
                学制
              </div>
            </td>
            <td><div style="width:120px;" class="f16">{{person.edTypename}}</div></td>
            <td>
              <div style="width:90px;" class="ts">
                系数
              </div>
            </td>
            <td><div style="width:50px;" class="f16">{{person.edProscore}}</div></td>
            <td rowspan="3"><p class="ps">学历分{{person.edAllscore}}</p></td>
            <td rowspan="11">
                <p class="ps">总分{{person.edAllscore + person.titleAllscore + person.workScore + person.dutyScore}}</p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="width:90px;" class="ts">
                专业性质
              </div>
            </td>
            <td class="f16">{{person.titleProname}}</td>
            <td>
              <div style="width:90px;" class="ts">
                系数
              </div>
            </td>
            <td class="f16">{{person.titleProscore}}</td>
          </tr>

          <tr>
            <td>
              <div style="width:90px;" class="ts">
                学历
              </div>
            </td>
            <td class="f16">{{person.edName}}</td>
            <td>
              <div style="width:90px;" class="ts">
                基准分
              </div>
            </td>
            <td class="f16">{{person.edScore}}</td>
          </tr>

          <tr>
            <td rowspan="2">
              <div style="width:30px;" class="tac">
                <p class="pt">职称评分</p>
              </div>
            </td>
            <td>
              <div style="width:90px;" class="ts">
                专业性质
              </div>
            </td>
            <td class="f16">{{person.titleProname}}</td>
            <td>
              <div style="width:90px;" class="ts">
                系数
              </div>
            </td>
            <td class="f16">{{person.titleProscore}}</td>
            <td rowspan="2"><p class="ps">职称分{{person.titleAllscore}}</p></td>
          </tr>

          <tr>
            <td><div style="width:90px;" class="ts">职称</div></td>
            <td class="f16">{{person.titleName}}</td>
            <td><div style="width:90px;" class="ts">基准分</div></td>
            <td class="f16">{{person.titleScore}}</td>
          </tr>

          <tr>
            <td rowspan="5">
              <div style="width:30px;" class="tac">
                <p class="pt">工龄评分</p>
              </div>
            </td>
            <td colspan="2" class="ts">参加工作时间</td>
            <td colspan="2" class="f16 pl2">2012/1/1</td>
            <td rowspan="5"><p class="ps">工龄分{{person.workScore}}</p></td>
          </tr>

          <tr>
            <td colspan="2" class="ts">入职时间</td>
            <td colspan="2" class="f16 pl2">2016/8/23</td>
          </tr>

          <tr>
            <td colspan="2" class="ts">司龄</td>
            <td colspan="2" class="f16 pl2">{{person.firmYear}}</td>
          </tr>

          <tr>
            <td colspan="2" class="ts">他龄</td>
            <td colspan="2" class="f16 pl2">{{person.otherYear}}</td>
          </tr>

          <tr>
            <td colspan="2" class="ts">工龄</td>
            <td colspan="2" class="f16 pl2">{{person.workYear}}</td>
          </tr>

          <tr>
            <td>
              <div style="width:30px;" class="tac">
                <p class="pt">职务评分</p>
              </div>
            </td>
            <td class="ts">职务</td>
            <td colspan="3" class="f16 tac" style="font-weight:600;">{{person.dutyName}}</td>
            <td><p class="ps">职务分{{person.dutyScore}}</p></td>
          </tr>
        </table>
      </div>

      <div style="padding-left:8%;padding-top:10px;">
        <div class="f15">
          <span class="fw600">职级:</span>
          <span style="color:#143370">{{person.jobRank}}</span>
          <span class="fw600">效能分:</span>
          <span style="color:#143370">{{person.kbiFinalScore}}</span>
          <span class="fw600">效能工资:</span>
          <span style="color: #1989fa;">{{person.kbiSalary}}</span>
        </div>
        <div class="f15">
          <span class="fw600">固定工资:</span>
          <span style="color: #1989fa;">{{person.fixedSalary}}</span>
        </div>
        <div class="f15">
          <span class="fw600">住房补贴:</span>
          <span style="color: #1989fa">{{person.housingSalary}}</span>
        </div>
        <div class="f15">
          <span class="fw600">工资合计:</span>
          <span style="color: red;font-weight:600;">{{person.fixedSalary + person.housingSalary + person.kbiSalary}}</span>
        </div>
      </div>

    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialogEvent" >返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        person: '',
        dialogTitleName: '个人工资计算明细'
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.person = item
        this.dialogTitleName += ': (' + this.person.username + ')'
        console.log(this.person)
      },
      closeDialogEvent () {
        this.visible = false
        this.dialogTitleName = '个人工资计算明细'
      }
    }
  }
</script>

<style scoped>
  .pt{
    width: 20px;
    display: inline-block;
    writing-mode: vertical-rl;
    font-size:18px;
    font-weight: 600;
  }
  .ps{
    width:20px;font-size:16px;font-weight:600
  }
  .ts{
    font-size:16px;font-weight:600;
  }
.tac{
  text-align:center;
}
  .f16{
    color:#747880;
    font-size:16px;
  }
  .f15{
    font-size:15px;
  }
  .fw600{
    font-weight:600;
  }
  .pl2{
    padding-left:2%;
  }
</style>
