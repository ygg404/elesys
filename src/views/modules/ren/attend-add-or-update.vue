<template>
  <el-dialog width="80%"
    :title="attendTitle"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
      <el-form-item label="应出勤天数：" prop="attendDays">
        <el-input-number v-model="dataForm.attendDays" :min="0" :max="31" placeholder="应出勤天数" step="0.5"></el-input-number>
      </el-form-item>
    </el-form>
    <el-table :data="attendList" border :span-method="objectSpanMethod">
      <el-table-column prop="branchName" header-align="center" align="center" label="部门"></el-table-column>
      <el-table-column prop="userName" header-align="center" align="center" label="用户名"></el-table-column>
      <el-table-column prop="inDay" header-align="center" align="center" label="内业天数">
        <template slot-scope="scope">
          <el-input type="number" step="0.5" v-model="scope.row.inDay" min="0" max="31"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="outDay" header-align="center" align="center" label="外业天数">
        <template slot-scope="scope">
          <el-input type="number" step="0.5" v-model="scope.row.outDay" min="0" max="31"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="overtime" header-align="center" align="center" label="加班天数">
        <template slot-scope="scope">
          <el-input type="number" step="0.5" v-model="scope.row.overtime" min="0" max="31"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="allDay" header-align="center" align="center" label="出勤天数">
        <template slot-scope="scope">
          {{parseFloat(scope.row.inDay) +  parseFloat(scope.row.outDay) + parseFloat(scope.row.overtime) }}
        </template>
      </el-table-column>
      <el-table-column prop="leave" header-align="center" align="center" label="请假天数"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="leave" header-align="center" align="center" label="请假编辑">
        <template slot-scope="scope">
          <el-button type="primary"  icon="el-icon-edit" size="small" @click="editLeaveHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!--请假编辑 弹窗-->
    <el-dialog :key="dialogKey" width="75%" title="请假编辑" :visible.sync="leaveVisible" :close-on-click-modal="false" append-to-body>
      <div><span class="edit_leave_title">日期：
          <span class="span_item">{{calpre.substring(0,7)}}</span>
          <span style="color: red">(只允许编辑该月份的请假明细)</span>
        </span>
      </div>
      <div><span class="edit_leave_title">姓名： <span class="span_item">{{leaveItem.userName}}</span></span></div>
      <div class="tab_card">
        <el-row>
          <el-col :span="17">
            <el-card>
              <calendarPicker
                :options="calendarArr"
                class="calendar"
                @handleClickDay="handleClickDay"
              />
            </el-card>
          </el-col>
          <el-col :span="7">
            <el-card v-if="setTimeTitle !== ''" >
              <template slot="header" class="clearfixz">
                <div class="set_time_title">设置请假日期: <span class="time_span">{{setTimeTitle}}</span> </div>
              </template>
              <div>
                <el-form :inline="true" >
                  <div class="set_leave_title" style="margin-top: 4px;" >上午请假类型：</div>
                  <el-select v-model="leaveAmId" placeholder="请假类型" class="time_select_btn" clearable @change="setLeaveDayHandle('am')">
                    <el-option  v-for="item in leaveSelectList" :label="item.leaveItem" :key="item.id" :value="item.id"></el-option>
                  </el-select>
                  <div class="set_leave_title">下午请假类型：</div>
                  <el-select v-model="leavePmId" placeholder="请假类型" class="time_select_btn" clearable @change="setLeaveDayHandle('pm')">
                    <el-option  v-for="item in leaveSelectList" :label="item.leaveItem" :key="item.id" :value="item.id"></el-option>
                  </el-select>
                </el-form>
              </div>
            </el-card>
            <el-card>
              <template slot="header" class="clearfixz">
                <div class="set_time_title">备注：</div>
                <el-table :key="Math.random()" :data="remarkTable" border  style="width: 100%;"  show-summary :header-cell-style="{background:'#eef1f6',color:'#137cb3'}">
                  <el-table-column prop="typeName" header-align="left" align="left" label="请假类型"></el-table-column>
                  <el-table-column prop="remarkDate" header-align="center" align="center" label="日期"></el-table-column>
                  <el-table-column prop="days" header-align="center" align="center" label="天数"></el-table-column>
                </el-table>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
      <el-button @click="leaveVisible = false">取消</el-button>
      <el-button type="primary" @click="setAttendLeaveHanle()">确定</el-button>
    </span>
    </el-dialog>

  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import calendarPicker from '@/components/calendar-picker'
  import {getLeaveItem} from '@/utils/selectedItem'

  export default {
    data () {
      return {
        visible: false,
        attendTitle: '编辑出勤',
        dataForm: {
          date: 0,
          attendDays: ''
        },
        calpre: '',
        calnext: '',
        dialogKey: '',
        editLeaveTime: '', // 编辑的出勤时间
        sickValue: new Date(),
        leaveVisible: false, // 请假编辑
        leaveItem: {},  // 选中编辑的人
        leaveItemTemp: {}, // 临时
        attendList: [],
        dataRule: {
          attendDays: [
            { required: true, message: '应出勤天数不能为空', trigger: 'blur' }
          ]
        },
        calendarArr: {
          type: 'combination',
          headStyle: {
            todayBtn: 'right',
            combination: 'center',
            checkBtn: 'right',
          },
          viewStyle: {
            day: 'right'
          },
          attendTime: new Date(),
          leaveItem: {}
        },
        time: {},
        calendarList: [],
        setTimeTitle: '',
        leaveSelectList: getLeaveItem(),
        leaveAmId: '',   // 上午请假类型
        leavePmId: '',  // 下午请假类型
        curDay: '',  // 当前日子
        remarkTable: []   // 备注表格
      }
    },
    components: {
      calendarPicker
    },
    methods: {
      init (date) {
        this.calendarArr.attendTime = new Date(date + '-01')
        this.editLeaveTime = new Date(date + '-01')
        // 设置出勤日历的范围
        this.calpre = moment(this.editLeaveTime).format('YYYY-MM-DD')
        this.calnext = moment(new Date(this.editLeaveTime.getFullYear(),this.editLeaveTime.getMonth() + 1, 0)).format('YYYY-MM-DD')
        console.log(this.calnext)

        this.dataForm.date = date
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (date) {
            this.$http({
              url: this.$http.adornUrl(`/ren/attend/info`),
              method: 'get',
              params: this.$http.adornParams({
                attendTime: this.dataForm.date
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                // 应出勤天数未设置，则设置为26天
                this.dataForm.attendDays = data.daysEntity == null ? 26 : data.daysEntity.attendDays
                this.attendInit(data.renAttend)
              }
            })
          }
        })
      },
      // 合并单元格
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.isFirst || rowIndex === 0) {
            return {
              rowspan: row.sizeItem,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      // 设置请假
      setLeaveDayHandle (dtype) {
        let cday = this.curDay
        // 上午
        if (dtype === 'am') {
          cday += '-1'
          let index = -1
          if ((index = this.leaveItem.sicklist.indexOf(cday)) !== -1) this.leaveItem.sicklist.splice(index, 1)
          if ((index = this.leaveItem.affairlist.indexOf(cday)) !== -1) this.leaveItem.affairlist.splice(index, 1)
          if ((index = this.leaveItem.annuallist.indexOf(cday)) !== -1) this.leaveItem.annuallist.splice(index, 1)
          if ((index = this.leaveItem.paternlist.indexOf(cday)) !== -1) this.leaveItem.paternlist.splice(index, 1)
          if ((index = this.leaveItem.babylist.indexOf(cday)) !== -1) this.leaveItem.babylist.splice(index, 1)
          if ((index = this.leaveItem.maritallist.indexOf(cday)) !== -1) this.leaveItem.maritallist.splice(index, 1)
          switch (this.leaveAmId) {
            case '':
              break
            // 病假
            case 0:
              this.leaveListHandle( this.leaveItem.sicklist , cday)
              break
            case 1:
              this.leaveListHandle( this.leaveItem.affairlist , cday)
              break
            case 2:
              this.leaveListHandle( this.leaveItem.annuallist , cday)
              break
            case 3:
              this.leaveListHandle( this.leaveItem.paternlist , cday)
              break
            case 4:
              this.leaveListHandle( this.leaveItem.babylist , cday)
              break
            case 5:
              this.leaveListHandle( this.leaveItem.maritallist , cday)
              break
            default:
              break
          }
        }
        // 下午
        else {
          cday += '-2'
          let index = -1
          if ((index = this.leaveItem.sicklist.indexOf(cday)) !== -1) this.leaveItem.sicklist.splice(index, 1)
          if ((index = this.leaveItem.affairlist.indexOf(cday)) !== -1) this.leaveItem.affairlist.splice(index, 1)
          if ((index = this.leaveItem.annuallist.indexOf(cday)) !== -1) this.leaveItem.annuallist.splice(index, 1)
          if ((index = this.leaveItem.paternlist.indexOf(cday)) !== -1) this.leaveItem.paternlist.splice(index, 1)
          if ((index = this.leaveItem.babylist.indexOf(cday)) !== -1) this.leaveItem.babylist.splice(index, 1)
          if ((index = this.leaveItem.maritallist.indexOf(cday)) !== -1) this.leaveItem.maritallist.splice(index, 1)
          switch (this.leavePmId) {
            case '':
              break
            // 病假
            case 0:
              this.leaveListHandle( this.leaveItem.sicklist , cday)
              break
            case 1:
              this.leaveListHandle( this.leaveItem.affairlist , cday)
              break
            case 2:
              this.leaveListHandle( this.leaveItem.annuallist , cday)
              break
            case 3:
              this.leaveListHandle( this.leaveItem.paternlist , cday)
              break
            case 4:
              this.leaveListHandle( this.leaveItem.babylist , cday)
              break
            case 5:
              this.leaveListHandle( this.leaveItem.maritallist , cday)
              break
            default:
              break
          }
        }
        console.log(this.leaveItem)
        // 各项请假备注生成
        this.leaveItem.remark = this.remarkGenerate(this.leaveItem.sicklist , 'sickId')
          + this.remarkGenerate(this.leaveItem.affairlist , 'affairId')
          + this.remarkGenerate(this.leaveItem.annuallist , 'annualId')
          + this.remarkGenerate(this.leaveItem.paternlist , 'paternId')
          + this.remarkGenerate(this.leaveItem.babylist , 'babyId')
          + this.remarkGenerate(this.leaveItem.maritallist , 'maritalId')
        this.remarkTableGenerate()
      },
      // 请假日期队列处理
      leaveListHandle ( itemlist , cday) {
        let index = -1
        index = itemlist.indexOf(cday)
        if (index !== -1) {
          itemlist.splice(index, 1)
        } else {
          let itemIndex = itemlist.length
          for (let index = 0; index < itemIndex; index++) {
            let dayItem = itemlist[index].split('-')[0]
            let curItem = cday.split('-')[0]
            if ( parseInt(curItem) < parseInt(dayItem)) {
              itemIndex = index
              break
            }
            // 当时间 日 相同, 则比较上下午
            if (curItem === dayItem) {
              if (cday.split('-')[1] < itemlist[index].split('-')[1]) {
                itemIndex = index
                break
              } else {
                itemIndex = index + 1
                break
              }
            }
          }
          itemlist.splice(itemIndex , 0 , cday)
        }
      },
      // 备注生成
      remarkGenerate ( itemList , timeId) {
        let dayList = []
        for (let index = 0; index < itemList.length; index++ ) {
          if (index === 0) {
            dayList.push(itemList[index])
          } else {
            if (itemList[index].split('-')[0] === itemList[index - 1].split('-')[0]) {
              dayList[dayList.length - 1] = itemList[index].split('-')[0]
            } else {
              dayList.push(itemList[index])
            }
          }
        }
        let remark = ''
        let starIndex = 0
        let endIndex = 0
        // 找出连续的天数
        let indexList = []
        for (let i = 1; i < dayList.length; i++) {
          if ((parseInt(dayList[i - 1]) !== (parseInt(dayList[i]) - 1)) || dayList[i - 1].length > 2 || dayList[i].length > 2 ) {
            indexList.push([starIndex , endIndex])
            starIndex = i
            endIndex = i
          } else {
            endIndex += 1
          }
          if (i === dayList.length - 1) {
            indexList.push([starIndex , endIndex])
          }
        }
        if (dayList.length > 0 && indexList.length === 0) indexList = [[0,0]]

        for (let indexArr of indexList) {
          if (indexArr[0] === indexArr[1]) {
            remark += (dayList[indexArr[0]] + '日').replace( '-1日' , '日上午').replace( '-2日' , '日下午') + '、'
          } else {
            remark += dayList[indexArr[0]] + '-' + dayList[indexArr[1]] + '日、'
          }
        }
        if (remark.length > 0) {
          switch (timeId) {
            case 'sickId':
              remark = '病假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            case 'affairId':
              remark = '事假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            case 'annualId':
              remark = '年假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            case 'paternId':
              remark = '陪产假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            case 'babyId':
              remark = '产假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            case 'maritalId':
              remark = '婚假' + itemList.length * 0.5 + '天(' + remark.substring(0 , remark.length - 1) + ');'
              break
            default:
              break
          }

        }
        return remark
      },
      // 备注表格生成
      remarkTableGenerate () {
        let remarkTable = []
        let days = 0
        let pattern = new RegExp("\\((.| )+?\\)","igm")
        if (this.leaveItem.sicklist.length !== 0) {
          let remarkItem = {
            typeName: '病假',
            remarkDate: this.remarkGenerate(this.leaveItem.sicklist , 'sickId').match(pattern),
            days: this.leaveItem.sicklist.length / 2
          }
          days += this.leaveItem.sicklist.length / 2
          remarkTable.push(remarkItem)
        }
        if (this.leaveItem.annuallist.length !== 0) {
          let remarkItem = {
            typeName: '年假',
            remarkDate: this.remarkGenerate(this.leaveItem.annuallist , 'annualId').match(pattern),
            days: this.leaveItem.annuallist.length / 2
          }
          days += this.leaveItem.annuallist.length / 2
          remarkTable.push(remarkItem)
        }
        if (this.leaveItem.affairlist.length !== 0) {
          let remarkItem = {
            typeName: '事假',
            remarkDate: this.remarkGenerate(this.leaveItem.affairlist , 'affairId').match(pattern),
            days: this.leaveItem.affairlist.length / 2
          }
          days += this.leaveItem.affairlist.length / 2
          remarkTable.push(remarkItem)
        }
        if (this.leaveItem.paternlist.length !== 0) {
          let remarkItem = {
            typeName: '陪产假',
            remarkDate: this.remarkGenerate(this.leaveItem.paternlist , 'paternId').match(pattern),
            days: this.leaveItem.paternlist.length / 2
          }
          days += this.leaveItem.paternlist.length / 2
          remarkTable.push(remarkItem)
        }
        if (this.leaveItem.babylist.length !== 0) {
          let remarkItem = {
            typeName: '产假',
            remarkDate: this.remarkGenerate(this.leaveItem.babylist , 'babyId').match(pattern),
            days: this.leaveItem.babylist.length / 2
          }
          days += this.leaveItem.babylist.length / 2
          remarkTable.push(remarkItem)
        }
        if (this.leaveItem.maritallist.length !== 0) {
          let remarkItem = {
            typeName: '婚假',
            remarkDate: this.remarkGenerate(this.leaveItem.maritallist , 'maritalId').match(pattern),
            days: this.leaveItem.maritallist.length / 2
          }
          days += this.leaveItem.maritallist.length / 2
          remarkTable.push(remarkItem)
        }
        this.leaveItem.leave = days
        this.remarkTable = remarkTable
      },
      // 出勤列表初始化
      attendInit (renAttendList) {
        let branchId = 0
        let size = 1
        let sizeList = []
        for (let i = 0; i < renAttendList.length ; i++) {
          if (branchId !== renAttendList[i].branchId) {
            if (size !== 1 ) {
              sizeList.push([branchId,size])
            }
            size = 1
            branchId = renAttendList[i].branchId
            if (i === renAttendList.length - 1){
              sizeList.push([branchId,size])
            }
            renAttendList[i].isFirst = true
          } else {
            size += 1
            renAttendList[i].isFirst = false
          }
        }
        for (let attend of renAttendList) {
          if (attend.remark === null) attend.remark = ''
          if (attend.sicklist === null) attend.sicklist = ''
          if (attend.affairlist === null) attend.affairlist = ''
          if (attend.maritallist === null) attend.maritallist = ''
          if (attend.babylist === null) attend.babylist = ''
          if (attend.paternlist === null) attend.paternlist = ''
          if (attend.annuallist === null) attend.annuallist = ''
          attend.sicklist = attend.sicklist === '' ? [] : attend.sicklist.split(',')
          attend.affairlist = attend.affairlist === '' ? [] : attend.affairlist.split(',')
          attend.maritallist = attend.maritallist === '' ? [] : attend.maritallist.split(',')
          attend.paternlist = attend.paternlist === '' ? [] : attend.paternlist.split(',')
          attend.babylist = attend.babylist === '' ? [] : attend.babylist.split(',')
          attend.annuallist = attend.annuallist === '' ? [] : attend.annuallist.split(',')
          for (let sizeItem of sizeList) {
            if (sizeItem[0] === attend.branchId) {
              attend.sizeItem = sizeItem[1]
            }
          }
          // 内业天数 外业天数 加班天数 为空 设置默认值
          if (attend.inDay === null) attend.inDay = this.dataForm.attendDays
          if (attend.outDay === null) attend.outDay = 0
          if (attend.overtime === null) attend.overtime = 0
          if (attend.leave === null) attend.leave = 0

        }
        this.attendList = renAttendList
        console.log(this.attendList)
      },
      // 出勤编辑事件
      editLeaveHandle (item) {
        this.leaveItem = JSON.parse(JSON.stringify(item))
        this.leaveAmId = ''
        this.leavePmId = ''
        this.remarkTable = []
        this.dialogKey = Math.random()
        this.calendarArr.leaveItem = this.leaveItem
        this.leaveVisible = true
        this.remarkTableGenerate()
      },
      // 点击日历
      handleClickDay (item) {
        this.setTimeTitle = item.year + '年' + item.month + '月' + item.day + '日'
        this.curDay = item.day
        this.leaveAmId = ''
        this.leavePmId = ''
        let index = -1
        if ((index = this.leaveItem.sicklist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 0
        if ((index = this.leaveItem.affairlist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 1
        if ((index = this.leaveItem.annuallist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 2
        if ((index = this.leaveItem.paternlist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 3
        if ((index = this.leaveItem.babylist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 4
        if ((index = this.leaveItem.maritallist.indexOf(item.day + '-1')) !== -1) this.leaveAmId = 5
        if ((index = this.leaveItem.sicklist.indexOf(item.day + '-2')) !== -1) this.leavePmId = 0
        if ((index = this.leaveItem.affairlist.indexOf(item.day + '-2')) !== -1) this.leavePmId = 1
        if ((index = this.leaveItem.annuallist.indexOf(item.day + '-2')) !== -1) this.leavePmId = 2
        if ((index = this.leaveItem.paternlist.indexOf(item.day + '-2')) !== -1) this.leavePmId = 3
        if ((index = this.leaveItem.babylist.indexOf(item.day + '-2')) !== -1) this.leaveAmId = 4
        if ((index = this.leaveItem.maritallist.indexOf(item.day + '-2')) !== -1) this.leavePmId = 5
      },
      // 请假编辑确定
      setAttendLeaveHanle () {
        for (let attend of this.attendList) {
          if (attend.userId === this.leaveItem.userId){
            attend.affairlist = this.leaveItem.affairlist
            attend.sicklist = this.leaveItem.sicklist
            attend.annuallist = this.leaveItem.annuallist
            attend.maritallist = this.leaveItem.maritallist
            attend.babylist = this.leaveItem.babylist
            attend.paternlist = this.leaveItem.paternlist
            attend.remark = this.leaveItem.remark
            attend.leave = this.leaveItem.leave
            console.log(attend)
            break
          }
        }
        this.leaveVisible = false
      },
      // 提交出勤表
      attendListSubmit () {
        let attendlist = JSON.parse(JSON.stringify(this.attendList))
        for (let attend of attendlist) {
          attend.affairlist = attend.affairlist.join(',')
          attend.sicklist = attend.sicklist.join(',')
          attend.annuallist = attend.annuallist.join(',')
          attend.maritallist = attend.maritallist.join(',')
          attend.babylist = attend.babylist.join(',')
          attend.paternlist = attend.paternlist.join(',')
          attend.allDay = parseFloat(attend.inDay) + parseFloat(attend.outDay) + parseFloat(attend.overtime)
          attend.attendTime = this.dataForm.date
        }
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/ren/attend/save'),
            method: 'POST',
            data: this.$http.adornData({
              'renAttendlist': attendlist
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(this.dataList)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.attendListSubmit().then(success => {
              this.$http({
                url: this.$http.adornUrl('/ren/attenddays/save'),
                method: 'POST',
                data: this.$http.adornData({
                  'date': this.dataForm.date,
                  'attendDays': this.dataForm.attendDays
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
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .tab_card{

    box-shadow: 5px 5px 3px rgba(73, 148, 204, 0.15);
  }
  .tab_card .tab_card_title{
    font-size: 11pt;
    font-weight: 700;
    padding: 10px;
    color: #00a0e9;
  }
  .edit_leave_title{
    font-size: 12pt;
    font-weight: 700;
  }
  .edit_leave_title .span_item{
    color: #00a0e9;
  }
  .set_time_title{
    font-weight: 700;
    font-size: 13pt;
  }
  .set_time_title .time_span{
    color: #00a0e9;
  }
  .set_time_detail{
    padding: 10px;
    margin-top: 10px;
    border: 1px dashed #1fd3e9;
  }
  .time_select_btn{
    width: 150px;
  }
  .set_leave_title{
    color: #00a0e9;
    margin-top: 20px;
    margin-bottom: 5px;
    font-size: 12pt;
  }
</style>
