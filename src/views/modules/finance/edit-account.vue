<template>

  <el-dialog
    width="60%"
    title=""
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>

    <!-- 添加收支数据 对话框-->
    <el-dialog
      :title="'添加收支数据' "
      :close-on-click-modal="false"
      :visible.sync="AccountaddVisible"
      append-to-body>

      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="金额" prop="accountNum">
          <el-input v-model="dataForm.accountNum" placeholder="金额"></el-input>
        </el-form-item>
        <el-form-item label="支出类型" prop="accountType">
          <template>
            <el-radio v-model="dataForm.accountType" label="1">收款</el-radio>
            <el-radio v-model="dataForm.accountType" label="0">支出</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="accountNote">
          <el-input v-model="dataForm.accountNote" placeholder="收支内容"></el-input>
        </el-form-item>
        <el-form-item label="选择添加时间" prop="accountAddDateTime">
          <el-date-picker v-model="dataForm.accountAddDateTime" type="date" value-format="yyyy-MM-dd" placeholder="合同签订时间" style="width: 200px;"></el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="AccountaddVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>

    <el-collapse v-model="activeNames" >
      <el-collapse-item title="项目基本信息" name="1">
        <el-card class="box-card">
          <div class="text item">
            <p>项目名称: {{this.project.projectName}}</p>
            <p>项目编码: {{this.project.projectNo}}</p>
            <p>委托单位: {{this.project.projectAuthorize}}</p>
            <p>项目阶段: {{this.project.projectStage}}</p>
            <p>项目类型: {{this.project.projectType}}</p>
            <p>项目金额: {{this.project.projectMoney}}</p>
            <p>联系人: {{this.project.projectUser}}</p>
            <p>联系电话: {{this.project.projectPhone}}</p>
          </div>
        </el-card>
      </el-collapse-item>

      <el-collapse-item title="收支信息" name="2">
        <!--表格-->
        <template>

          <el-container>
            <el-header>
              项目应收: {{this.settlementmoney.Receivable}}
              未收款项: {{this.settlementmoney.NotReceipts}}
              已收款项: {{this.settlementmoney.ActuallyReceipts}}
              支出款项: {{this.settlementmoney.Expenditure}}
            </el-header>
            <el-main>
              <div class="mod-config">
                <el-table :data="AccountList" border v-loading="dataListLoading" @sort-change="changeSort" >
                  <el-table-column prop="accountAddDateTime" header-align="center" align="center" label="日期"></el-table-column>
                  <el-table-column prop="accountTypeName" header-align="center" align="center" label="收支"></el-table-column>
                  <el-table-column prop="accountNum" header-align="center" align="center" label="金额"></el-table-column>
                  <el-table-column prop="accountNote" header-align="center" align="center" label="备注"></el-table-column>
                  <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" circle @click="DeleteOneAccount(scope.row.id)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="pageIndex"
                  :page-sizes="[25, 50, 100]"
                  :page-size="pageSize"
                  :total="totalPage"
                  layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>

              </div>
            </el-main>
            <el-footer>
              <el-button type="success" @click="AddAcountInfoHandle()">新增</el-button>
              <el-button type="danger" @click="CloseThisDialog()">返回</el-button>

            </el-footer>
          </el-container>

        </template>
      </el-collapse-item>
    </el-collapse>

  </el-dialog>
</template>

<<script>

  export default {
    data:()=>({
      //表单
      dataForm:{
        //合同编号
        // contractNo:'',
        accountNum:'',
        accountType:'',
        accountNote:'',
        accountAddDateTime:''
      },
      dataRule: {
        accountNum: [
          {required: true, message: '金额不能为空', trigger: 'blur'}
        ],
        accountType: [
          {required: true, message: '支出类型不能为空', trigger: 'blur'}
        ],
        accountAddDateTime: [
          {required: true, message: '添加记录时间不能为空', trigger: 'blur'}
        ]
      },
      //卡片选项 默认
      activeNames: ['2'],
      //当前对话框
      visible: false,
      ProjectInfoPanel:[false],
      accountPanel:[true],
      addAccountDialog:false,
      dateMenu:false,
      chooseType:'0',
      accountMoney:0,
      accountNote:'',
      accountType:'',
      startDateTime:new Date().toISOString().substr(0, 10),
      projectNo:'',
      projectNot:0,
      projectGet:0,
      projectOut:0,

      //新建对话框 弹窗
      AccountaddVisible:false,
      //给添加财务操作使用的
      OpercontractNo:'',
      //项目信息
      project:{
        //单位
        projectAuthorize:'',
        //负责人
        projectBusiness: '',
        projectMoney:'',
        projectName:'',
        projectOutPut:0,
        //阶段
        projectStage:'',
        //项目类型
        projectType:'',
        projectUser:'',
        projectPhone:''
      },
      //结算信息
      settlementmoney:{
        Receivable:'',
        ActuallyReceipts:'',
        NotReceipts:'',
        Expenditure:''
      },
      AccountList:[],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 25,
      totalPage: 0,
      snackbar:false,
      snackbarColor:'',
      snackbarText:'',
      snackbarTimeout:2000
    }),
    methods:{
      //初始化
      init(contractNo){
        this.visible = true
        //1.获得合同编号对应的项目信息
        this.getProjectInfoByContractNo(contractNo)
        //2 .获得合同编号对应的财务操作 数据
        this.getAccountListByContractNo(contractNo)
        //3 . 获取 项目应收 未收款项 已收款项 支出款项
        this.getSettlementMoneyByContractNo(contractNo)
        //设置 对话框的合同编号
        this.OpercontractNo = contractNo



      },

// 财务操作列表
      getAccountListByContractNo(contractNo){
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/finance/account/GetAccountListByContract/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.AccountList = data.page.list
          } else {
          }
          this.dataListLoading = false
        })
      },

      //合同编号对应的项目信息
      getProjectInfoByContractNo(contractNo) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/project/project/GetProjectInfoByContractNo/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            //数据先不填
            //单位
            this.project.projectAuthorize = data.project.projectAuthorize
            //负责人
            this.project.projectBusiness = data.project.projectBusiness
            this.project.projectMoney = data.project.projectMoney
            this.project.projectName =data.project.projectName
            this.project.projectOutPut = data.project.projectOutPut
            //阶段
            this.project.projectStage = data.project.projectStage
            //项目类型
            this.project.projectType = data.project.projectType
            this.project.projectUser = data.project.projectUser
            this.project.projectPhone = data.project.projectPhone
          } else {

          }
          this.dataListLoading = false
        })
      },

//通过合同编号获得相应的结算
      getSettlementMoneyByContractNo(contractNo){
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/finance/account/GetSettlementMoneyByContractNo/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.settlementmoney.Receivable = data.settlementMoneyVoEntity.receivable
            this.settlementmoney.ActuallyReceipts = data.settlementMoneyVoEntity.actuallyReceipts
            this.settlementmoney.NotReceipts = data.settlementMoneyVoEntity.notReceipts
            this.settlementmoney.Expenditure =  data.settlementMoneyVoEntity.expenditure
          } else {

          }
          this.dataListLoading = false
        })
      },

//返回按钮点击事件
      CloseThisDialog(){
        this.visible = false
      },

//新增按钮点击事件
      AddAcountInfoHandle(){
        this.AccountaddVisible = true
      },
      // 排序字段改变
      changeSort (val) {
        console.log(val)
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        this.dataForm.sidx = val.prop

      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1

      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/finance/account/save`),
              method: 'post',
              data: this.$http.adornData({
                'contractNo':this.OpercontractNo,
                'accountNote': this.dataForm.accountNote,
                'accountNum': this.dataForm.accountNum,
                'accountType':this.dataForm.accountType,
                'accountAddDateTime':this.dataForm.accountAddDateTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
              }



              //  设置为空
              this.dataForm.accountNote = null
              this.dataForm.accountNum = null
              this.dataForm.accountType = null
              this.dataForm.accountAddDateTime = null

              this.AccountaddVisible = false

              //刷新
              this.getProjectInfoByContractNo(this.OpercontractNo)
              //2 .获得合同编号对应的财务操作 数据
              this.getAccountListByContractNo(this.OpercontractNo)
              //3 . 获取 项目应收 未收款项 已收款项 支出款项
              this.getSettlementMoneyByContractNo(this.OpercontractNo)

            })
          }
        })
      },



      // 删除
      DeleteOneAccount(id) {
        let tip = '此操作将永久删除编号为[' + id + ']的财务操作记录, 是否继续?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/finance/account/delete'),
            method: 'post',
            data: this.$http.adornData({
              'id': id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,

              })
              //
              this.getProjectInfoByContractNo(this.OpercontractNo)
              //2 .获得合同编号对应的财务操作 数据
              this.getAccountListByContractNo(this.OpercontractNo)
              //3 . 获取 项目应收 未收款项 已收款项 支出款项
              this.getSettlementMoneyByContractNo(this.OpercontractNo)

            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },

    },
    mounted(){
      // this.getProjectsFromApi().then(success=>{}).catch(error=>{})
    }



  }
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
