<template>
  <div class="cc-calendar">
    <div class="calendar_timetitle">{{timeTitle}}</div>
    <ul class="calendar-week clear">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item">{{item}}</li>
    </ul>
    <ul class="calendar-view clear">
      <li v-for="(item, index) in visibleCalendar"
        :key="index"
        class="date-view"
        :class="[
          {'month-class': !isCurrentMonth(item.date)},
          {handleDay: item.clickDay}
        ]"
        @click="handleClickDay(item)"
      >
        <span class="date-day"
          :class="[{'opacity-class': !isCurrentMonth(item.date)}]"
        >
          {{item.day}}
        </span>
        <div style="text-align: center;width: 100%;margin-top: 5px;" v-if="isCurrentMonth(item.date)">
          <el-tag type="danger" v-if="handleDayList(leaveItem.sicklist).indexOf(item.day.toString()) != -1">病假</el-tag>
          <el-tag type="warning" v-if="handleDayList(leaveItem.affairlist).indexOf(item.day.toString()) != -1">事假</el-tag>
          <el-tag type="primary" v-if="handleDayList(leaveItem.annuallist).indexOf(item.day.toString()) != -1">年假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.paternlist).indexOf(item.day.toString()) != -1">陪产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.babylist).indexOf(item.day.toString()) != -1">产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.maritallist).indexOf(item.day.toString()) != -1">婚假</el-tag>

          <el-tag type="danger" v-if="handleDayList(leaveItem.sicklist).indexOf(item.day + '-1') != -1">上午病假</el-tag>
          <el-tag type="warning" v-if="handleDayList(leaveItem.affairlist).indexOf(item.day + '-1') != -1">上午事假</el-tag>
          <el-tag type="primary" v-if="handleDayList(leaveItem.annuallist).indexOf(item.day + '-1') != -1">上午年假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.paternlist).indexOf(item.day + '-1') != -1">上午陪产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.babylist).indexOf(item.day + '-1') != -1">上午产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.maritallist).indexOf(item.day + '-1') != -1">上午婚假</el-tag>

          <el-tag type="danger" v-if="handleDayList(leaveItem.sicklist).indexOf(item.day + '-2') != -1">下午病假</el-tag>
          <el-tag type="warning" v-if="handleDayList(leaveItem.affairlist).indexOf(item.day + '-2') != -1">下午事假</el-tag>
          <el-tag type="primary" v-if="handleDayList(leaveItem.annuallist).indexOf(item.day + '-2') != -1">下午年假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.paternlist).indexOf(item.day + '-2') != -1">下午陪产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.babylist).indexOf(item.day + '-2') != -1">下午产假</el-tag>
          <el-tag type="success" v-if="handleDayList(leaveItem.maritallist).indexOf(item.day + '-2') != -1">下午婚假</el-tag>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import './css/reset.min.css'
  import calendarHeader from './calendar-head.vue'
  import * as utils from './js/utils.js'

  export default {
    name: 'cc-calendar',
    componentName: 'cc-calendar',
    props: {
      options: Object
    },
    components: {
      calendarHeader
    },
    data() {
      let {year, month, day} = utils.getNewDate(this.options.attendTime);
      return {
        headOptions: {
          type: this.options.type,
          style: this.options.headStyle,
          date: '',
        },
        calendarTitleArr: ['日', '一', '二', '三', '四', '五', '六'],
        timeTitle: year + '年' + (month + 1) + '月',
        time: {year, month, day},
        calendarList: [],
        leaveItem: this.options.leaveItem
      }
    },
    computed: {
      dayStyle : function () {
        return {
          textAlign: this.options.viewStyle.day,
        }
      },
      visibleCalendar () {
        let calendatArr = [];
        let {year, month, day} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1))

        let currentFirstDay = utils.getDate(year, month, 1);

        // 获取当前月第一天星期几
        let weekDay = currentFirstDay.getDay();
        let startTime = currentFirstDay - (weekDay) * 24 * 60 * 60 * 1000;

        let monthDayNum;
        if (weekDay == 5 || weekDay == 6){
          monthDayNum = 42
        }else {
          monthDayNum = 35
        };

        for (let i = 0; i < monthDayNum; i++) {
          calendatArr.push({
            date: new Date(startTime + i * 24 * 60 * 60 * 1000),
            year: year,
            month: month + 1,
            day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
            clickDay: false,
          })
        };

        this.headOptions.date = `${utils.englishMonth(month)} ${year}`
        return calendatArr
      }
    },
    methods: {
      // 是否是当前月
      isCurrentMonth (date) {
        let {year: currentYear, month: currentMonth} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
        let {year, month} = utils.getNewDate(date);
        return currentYear == year && currentMonth == month
      },
      // 是否是今天
      isCurrentDay (date) {
        let {year: currentYear, month: currentMonth, day: currentDay} = utils.getNewDate(new Date())
        let {year, month, day} = utils.getNewDate(date)
        return currentYear == year && currentMonth == month && currentDay == day
      },
      // 上一个月
      handlePrevMonth () {
        let prevMonth = utils.getDate(this.time.year,this.time.month,1)
        prevMonth.setMonth(prevMonth.getMonth() - 1)
        this.time = utils.getNewDate(prevMonth)
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`
        this.$emit('handlePrevMonth')
      },
      // 下一个月
      handleNextMonth () {
        let nextMonth = utils.getDate(this.time.year,this.time.month,1)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        this.time = utils.getNewDate(nextMonth)
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`
        this.$emit('handleNextMonth')
      },
      // 点击回到今天
      handleToday () {
        this.time = utils.getNewDate(new Date());
        this.returnDate();
        this.$emit('handleToday');
      },
      // 点击某一天
      handleClickDay (item) {
        this.$forceUpdate();
        this.$emit('handleClickDay', item);
        this.calendarList.map( x => {
          x.clickDay = false;
        })
        this.$set(item, 'clickDay', true);
      },
      // 返回生成日期列表
      handleDayList (itemList) {
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
        return dayList
      }
    },
    created () {
      this.calendarList = this.visibleCalendar;
      this.calendarType = this.options.calendarType;
    }
  }
</script>

<style lang="less">
  .calendar_timetitle{
    font-weight: 700;
    font-size: 14pt;
    text-align: center;
    margin-bottom: 16px;
  }
  .cc-calendar {
    padding: 23px 30px 30px;
    width: 100%;
    height: 100%;
    background: #F9FAFC;
    box-sizing: border-box;
    -moz-user-select:none;		/* 火狐 */
    -webkit-user-select:none;	/* 谷歌 */
    -ms-user-select:none;		/* IE */
    user-select:none;
    .calendar-week {
      width: 100%;
      height: 46px;
      line-height: 46px;
      border: 1px solid #E4E7EA;
      border-right: none;
      .week-item {
        float: left;
        width: 14.285%;
        text-align: center;
        font-size: 14px;
        color: #424953;
        border-right: 1px solid #E4E7EA;
        font-weight: 600;
      }
    }
    .calendar-view {
      width: 100%;
      border-left: 1px solid #E4E7EA;
      .date-view {
        float: left;
        width: 14.285%;
        min-height: 100px;
        border-right: 1px solid #E4E7EA;
        border-bottom: 1px solid #E4E7EA;
        cursor: pointer;
        .date-day {
          padding: 8px 8px 0;
          display: block;
          width: 100%;
          font-size: 15px;

        }
        .calendar-num {
          margin-top: 6px;
          display: block;
          width: 100%;
          text-align: center;
          font-size: 30px;
          color: #424953;
        }
      }
      .opacity-class {
        opacity: .5;
      }
      .month-class {
        background-image: linear-gradient(45deg,rgba(000, 000, 000, .03) 25%,transparent 25%,transparent 50%,rgba(000, 000, 000, .03) 50%,rgba(000, 000, 000, .03) 75%,transparent 75%,transparent);
        background-size: 20px 20px;
        cursor: not-allowed;
        pointer-events: none;
      }
      .todayBg {
        background: #FFFDEF;
      }
      .handleDay {
        background: #81c7ff !important;
        .date-day {
          color: #BCCFFF !important;
        }
        .calendar-num {
          color: #fff !important;
        }
      }
    }
  }
</style>
