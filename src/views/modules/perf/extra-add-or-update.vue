<template>
  <el-dialog customClass="customWidth"
    :title="'个人加减分编辑（  被考核人：' + checkUserItem.userName + '）'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table :data="extraScoreList" border :span-method="objectSpanMethod" show-summary>
      <el-table-column prop="extraType" label="类型" width="40">
        <template slot-scope="scope">
          <div v-if="scope.row.extraType == 0">加分项</div>
          <div v-if="scope.row.extraType == 1">减分项</div>
        </template>
      </el-table-column>
      <el-table-column prop="extraItem" label="加减分项"></el-table-column>
      <el-table-column prop="standard" label="计分标准"></el-table-column>
      <el-table-column prop="extraNum" label="分数">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.extraNum" size="samll" width="120"
                           :min="scope.row.extraType == 0 ? 0 : -100" :max="scope.row.extraType == 1? 0:100"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
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
        extraList: [],
        checkUserItem: {},
        extraScoreList: []
      }
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.isFirst || rowIndex === 0) {
            return {
              rowspan: row.size,
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
      init (item) {
        this.checkUserItem = item
        this.visible = true
        this.getExtralist().then(extraList => {
          this.extraList = extraList
          this.getExtraScoreList(item).then(scoreList => {
            this.extraScoreInit(extraList,scoreList)
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        let scoreList = []
        for (let scoreExtra of this.extraScoreList) {
          if (scoreExtra.extraNum !== 0) scoreList.push(scoreExtra)
        }
        this.$http({
          url: this.$http.adornUrl(`/perf/extrascoring/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'checkUserId': this.checkUserItem.userId,
            'year': this.checkUserItem.year,
            'updown': this.checkUserItem.updown,
            'scoreList': scoreList
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
      },
      // 获取加减分项列表
      getExtralist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extra/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 获取该年度用户的加减分的数据列表
      getExtraScoreList (item) {
        console.log(item)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/perf/extrascoring/list'),
            method: 'get',
            params: this.$http.adornParams({
              year: item.year,
              updown: item.updown,
              checkUserId: item.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data)
            }
          })
        })
      },
      // 评分列表初始化
      extraScoreInit (extraList,scoreList) {
        let sizeList = []
        let extrascoreList = []
        let type = -1
        let size = 0
        // 先计算加分项
        for (let extra of extraList) {
          let extraPart = {
            extraId: extra.id,
            extraItem: extra.extraItem,
            standard: extra.standard,
            remark: extra.remark,
            extraType: extra.extraType,
            year: this.checkUserItem.year,
            updown: this.checkUserItem.updown,
            checkUserId: this.checkUserItem.userId,
            checkUserName: this.checkUserItem.userName,
            isFirst: false
          }
          if (extra.extraType !== type) {
            type = extra.extraType
            sizeList.push(size)
            size = 0
            extraPart.isFirst = true
          }
          size += 1
          let score = scoreList.find(scoeItem => scoeItem.extraId === extra.id)
          if (!stringIsNull(score)) {
            extraPart.extraNum = score.extraNum
          } else {
            extraPart.extraNum = 0
          }
          extrascoreList.push(extraPart)
        }
        if (size > 0) sizeList.push(size)
        let index = 0
        for (let extrascore of extrascoreList) {
          if (extrascore.isFirst) extrascore.size = sizeList[++index]
        }
        this.extraScoreList = extrascoreList
      }
    }
  }
</script>

<style>
  .customWidth{
    width:860px;
  }
</style>
