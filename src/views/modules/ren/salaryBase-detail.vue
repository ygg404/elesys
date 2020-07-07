<template>
  <el-dialog width="45%" :title="titleName"
             :close-on-click-modal="false" :visible.sync="visible">
    <el-card>
      <div align="center">
        <table border="2" bordercolor="black" width="300" cellspacing="0" cellpadding="5">
          <tr>
            <td rowspan="3">
              <div  class="tac">
                <p class="pt">学历评分</p>
              </div>
            </td>
            <td>
              <div style="width:90px;" class="ts">学制</div>
            </td>
            <td><div style="width:120px;" class="f16">{{person.edTypename}}</div></td>
            <td>
              <div style="width:90px;" class="ts">系数</div>
            </td>
            <td><div style="width:50px;" class="f16">{{person.edTypescore}}</div></td>
            <td rowspan="3"><p class="ps">学历分<span style="color: #ff00ff">{{person.edAllscore}}</span></p></td>
            <td rowspan="11">
              <p class="ps">总分<span style="color: #ff0000">{{person.edAllscore + person.titleAllscore + person.workScore + person.dutyScore}}</span></p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="width:90px;" class="ts">专业性质</div>
            </td>
            <td class="f16">{{person.edProname}}</td>
            <td>
              <div style="width:90px;" class="ts">系数</div>
            </td>
            <td class="f16">{{person.edProscore}}</td>
          </tr>

          <tr>
            <td>
              <div style="width:90px;" class="ts">学历</div>
            </td>
            <td class="f16">{{person.edName}}</td>
            <td>
              <div style="width:90px;" class="ts">基准分</div>
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
              <div style="width:90px;" class="ts">系数</div>
            </td>
            <td class="f16">{{person.titleProscore}}</td>
            <td rowspan="2"><p class="ps">职称分<span style="color: #ff00ff">{{person.titleAllscore}}</span></p></td>
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
            <td colspan="2" class="f16 pl2">{{person.educationTime}}</td>
            <td rowspan="5"><p class="ps">工龄分<span style="color: #ff00ff">{{person.workScore}}</span></p></td>
          </tr>

          <tr>
            <td colspan="2" class="ts">入职时间</td>
            <td colspan="2" class="f16 pl2">{{person.entryTime}}</td>
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
            <td><p class="ps">职务分 <span style="color: #ff00ff">{{person.dutyScore}}</span></p></td>
          </tr>

          <tr>
            <td colspan="7">
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
            </td>

          </tr>
        </table>
      </div>



    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" >返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        person: '',
        titleName: '个人工资计算明细'
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.person = item
        this.titleName = '个人工资计算明细' + ': (' + this.person.username + ')'
        console.log(this.person)
      }
    }
  }
</script>

<style scoped>
  .pt{
    width: 20px;
    display: inline-block;
    font-size:18px;
    font-weight: 600;
  }
  .ps{
    width:35px;font-size:16px;font-weight:600
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
