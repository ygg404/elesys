<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="init()">
      <el-form-item label="评分列表文件：">
        <el-select v-model="dataForm.fileNo" style="width: 135px;" @change="getDataList()"
                   class="select_btn">
          <el-option v-for="item in fileList" :label="item" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-button v-if="isAuth('set:qualityscore:delete')" type="danger" icon="el-icon-delete" @click="deleteHandle()">
        删除当前列表
      </el-button>
      <el-form-item>
        <el-upload :action="upExcelUrl" style="display:inline-block"
                   :limit="1"
                   name="file"
                   ref="upload"
                   accept=".xls,.xlsx"
                   :headers="tokenHeaders"
                   :before-upload="handleBeforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleError">
          <el-button v-if="isAuth('set:qualityscore:import')" type="success" icon="el-icon-s-fold">导入Excel</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" :span-method="objectSpanMethod" border v-loading="dataListLoading"
              :header-cell-style="tableHeaderColor" style="width: 100%;">
      <!--      <el-table-column prop="typeId" header-align="center" align="center" label="评分选项ID"></el-table-column>-->
      <el-table-column prop="qualityCate" header-align="center" align="center" label="质量元素类别" width="140"></el-table-column>
      <el-table-column prop="scoreRadio" header-align="center" align="center" label="评分权重" width="100"></el-table-column>
      <el-table-column prop="typeaName" header-align="center" align="center" label="A类错误(42)"></el-table-column>
      <el-table-column prop="typebName" header-align="center" align="center" label="B类错误(12)"></el-table-column>
      <el-table-column prop="typecName" header-align="center" align="center" label="C类错误(4)"></el-table-column>
      <el-table-column prop="typedName" header-align="center" align="center" label="D类错误(1)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data () {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc',
          fileNo: ''
        },
        upExcelUrl: window.SITE_CONFIG['baseUrl'] + '/set/qualityscore/importFile/',  // EXCEL上传地址
        tokenHeaders: {token: Vue.cookie.get('token')},  // token请求
        fileList: [], // 文件列表
        dataList: [],
        spanArr: [],
        dataListLoading: false
      }
    },
    activated () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.dataList = []
        this.dataForm.fileNo = ''
        this.getScoreFileList().then(fileList => {
          this.fileList = fileList
          if (fileList.length > 0) this.dataForm.fileNo = fileList[0]
          this.getDataList(this.dataForm.fileNo).then(list => {
            this.dataList = list
          })
        })
      },
      // 获取数据列表
      getDataList () {
        return new Promise((resolve, reject) => {
          this.dataListLoading = true
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
              this.dataListLoading = false
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
      // 删除
      deleteHandle () {
        this.$confirm(`确定对[文件编号=${this.dataForm.fileNo}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/qualityscore/delete'),
            method: 'post',
            params: this.$http.adornParams({
              fileNo: this.dataForm.fileNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.init()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 合并单元格
      objectSpanMethod ({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      // 文件上传成功时的钩子
      handleSuccess (res, file, fileList) {
        let type = res.code === 0 ? 'success' : 'danger'
        let message = res.code === 0 ? '提交文件成功！' : '读取文件失败！'
        console.log(res.code)
        this.$message({
          message: message,
          type: type,
          duration: 1500,
          onClose: () => {
            this.$refs.upload.clearFiles()
          }
        })
        this.init()
      },
      // 文件上传失败时的钩子
      handleError (err, file, fileList) {
        this.$message.error('文件上传失败')
      },
      // 修改table header的背景色
      tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: lightblue;color: #fff;font-weight: 700;line-height:200%'
        }
      }
    }
  }
</script>
