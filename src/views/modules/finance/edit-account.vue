<template>

  <el-dialog
    width="70%"
    title="财务操作"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :before-close="handleDialogClose"
    append-to-body>

    <!-- 添加收支数据 对话框-->
    <el-dialog
      :title="'添加收支数据' "
      :close-on-click-modal="false"
      :visible.sync="AccountaddVisible"
      append-to-body>

      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="80px">
        <el-form-item label="金额" prop="accountNum">
          <el-input v-model="dataForm.accountNum" placeholder="金额"></el-input>
        </el-form-item>
        <el-form-item label="支出类型" prop="accountType">
          <template>
            <el-radio v-model="dataForm.accountType" label="0">收款</el-radio>
            <el-radio v-model="dataForm.accountType" label="1">支出</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="accountNote">
          <el-input v-model="dataForm.accountNote" placeholder="收支内容"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="accountAddDateTime">
          <el-date-picker v-model="dataForm.accountAddDateTime" type="date" value-format="yyyy-MM-dd" placeholder="添加时间"
                          style="width: 200px;"></el-date-picker>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="AccountaddVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="合同基本信息" name="1" class="span_title">

        <el-card>

          <div>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同编码：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractNo}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同名称：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractName}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同金额：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractMoney}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同类型：</span></el-col>
              <el-col :span="16"><span>{{this.contracttypeName}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同委托单位：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractAuthorize}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>业务负责人：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractBusiness}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>联系人：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.userName}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>联系电话：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.userPhone}}</span></el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="4"><span>合同签订时间：</span></el-col>
              <el-col :span="16"><span>{{this.ContractInfo.contractAddTime}}</span></el-col>
            </el-row>
          </div>
        </el-card>
      </el-collapse-item>

      <el-collapse-item title="收支信息" name="2">
        <el-card>
          <div>
            <el-col :span="6">
              <div class="grid-header"> 项目应收: {{this.settlementmoney.Receivable}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-header"> 未收款项: {{this.settlementmoney.NotReceipts}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-header">已收款项: {{this.settlementmoney.ActuallyReceipts}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-header">支出款项: {{this.settlementmoney.Expenditure}}</div>
            </el-col>

          </div>
        </el-card>
      </el-collapse-item>

      <template>
        <div class="mod-config">
          <el-card>
            <div class="table_class">
              <el-table :data="AccountList" border v-loading="dataListLoading" @sort-change="changeSort"
                        style="width: 100%;">
                <el-table-column prop="accountAddDateTime" header-align="center" align="center"
                                 label="日期"></el-table-column>
                <el-table-column prop="accountTypeName" header-align="center" align="center"
                                 label="收支"></el-table-column>
                <el-table-column prop="accountNum" header-align="center" align="center" label="金额"></el-table-column>
                <el-table-column prop="accountNote" header-align="center" align="center" label="备注"></el-table-column>
                <el-table-column header-align="center" align="center" width="150" label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle
                               @click="DeleteOneAccount(scope.row.id)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="bottom_btn">
                <el-button type="success" @click="AddAcountInfoHandle()" class="AddBtn">新增</el-button>
                <el-button type="danger" @click="CloseThisDialog()" class="ReturnBtn">返回</el-button>
              </div>

            </div>
          </el-card>
        </div>
      </template>

    </el-collapse>

  </el-dialog>
</template>

<
<script>

  export default {
    data: () => ({
      //表单
      dataForm: {
        //合同编号
        // contractNo:'',
        accountNum: '',
        accountType: '',
        accountNote: '',
        accountAddDateTime: ''
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
      ProjectInfoPanel: [false],
      accountPanel: [true],
      addAccountDialog: false,
      dateMenu: false,
      chooseType: '0',
      accountMoney: 0,
      accountNote: '',
      accountType: '',
      startDateTime: new Date().toISOString().substr(0, 10),
      projectNo: '',
      projectNot: 0,
      projectGet: 0,
      projectOut: 0,

      //新建对话框 弹窗
      AccountaddVisible: false,
      //给添加财务操作使用的
      OpercontractNo: '',

      //项目信息
      ContractInfo: {
        contractAddTime: '',
        contractAuthorize: '',
        contractBusiness: '',
        contractCreateTime: '',
        contractMoney: '',
        contractName: '',
        contractNo: '',
        contractNote: '',
        contractStage: '',
        contractType: '',
        userName: '',
        userPhone: ''
      },

      //将标识符转换成 文字信息
      //合同类型: 0.合同委托 1.一般委托
      contracttypeName: '',
      //合同状态: 1.正常2.回收站
      contractstageName: '',

      //结算信息
      settlementmoney: {
        Receivable: '',
        ActuallyReceipts: '',
        NotReceipts: '',
        Expenditure: ''
      },
      AccountList: [],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 25,
      totalPage: 0,
      snackbar: false,
      snackbarColor: '',
      snackbarText: '',
      snackbarTimeout: 2000
    }),
    methods: {
      //初始化
      init (contractNo) {
        this.visible = true
        //1.获得合同编号对应的项目信息
        this.getContractInfoByContractNo(contractNo)
        //2 .获得合同编号对应的财务操作 数据
        this.getAccountListByContractNo(contractNo)
        //3 . 获取 项目应收 未收款项 已收款项 支出款项
        this.getSettlementMoneyByContractNo(contractNo)
        //设置 对话框的合同编号
        this.OpercontractNo = contractNo
      },

      // 财务操作列表
      getAccountListByContractNo (contractNo) {
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

      //合同编号对应的合同信息
      getContractInfoByContractNo (contractNo) {
        this.dataListLoading = true
        this.$http({
          //这里错了
          url: this.$http.adornUrl(`/finance/account/getContractByContractNo/` + contractNo),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.ContractInfo.contractAddTime = data.ContractInfo.contractAddTime
            this.ContractInfo.contractAuthorize = data.ContractInfo.contractAuthorize
            this.ContractInfo.contractBusiness = data.ContractInfo.contractBusiness
            this.ContractInfo.contractCreateTime = data.ContractInfo.contractCreateTime
            this.ContractInfo.contractMoney = data.ContractInfo.contractMoney
            this.ContractInfo.contractName = data.ContractInfo.contractName
            this.ContractInfo.contractNo = data.ContractInfo.contractNo
            this.ContractInfo.contractNote = data.ContractInfo.contractNote
            this.ContractInfo.contractStage = data.ContractInfo.contractStage
            this.ContractInfo.contractType = data.ContractInfo.contractType
            this.ContractInfo.userName = data.ContractInfo.userName
            this.ContractInfo.userPhone = data.ContractInfo.userPhone
            if (this.ContractInfo.contractStage == 0) {
              this.contractstageName = '正常'
            }
            if (this.ContractInfo.contractStage == 1) {
              this.contractstageName = '回收站'
            }
            if (this.ContractInfo.contractType == 0) {
              this.contracttypeName = '合同委托'
            }
            if (this.ContractInfo.contractType == 1) {
              this.contracttypeName = '一般委托'
            }
          } else {

          }
          this.dataListLoading = false
        })
      },

      //通过合同编号获得相应的结算
      getSettlementMoneyByContractNo (contractNo) {
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
            this.settlementmoney.Expenditure = data.settlementMoneyVoEntity.expenditure
          } else {

          }
          this.dataListLoading = false
        })
      },

//返回按钮点击事件
      CloseThisDialog () {
        this.$emit('refreshDataList')
        this.visible = false
      },

//新增按钮点击事件
      AddAcountInfoHandle () {
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
                'contractNo': this.OpercontractNo,
                'accountNote': this.dataForm.accountNote,
                'accountNum': this.dataForm.accountNum,
                'accountType': this.dataForm.accountType,
                'accountAddDateTime': this.dataForm.accountAddDateTime
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
              this.getContractInfoByContractNo(this.OpercontractNo)
              //2 .获得合同编号对应的财务操作 数据
              this.getAccountListByContractNo(this.OpercontractNo)
              //3 . 获取 项目应收 未收款项 已收款项 支出款项
              this.getSettlementMoneyByContractNo(this.OpercontractNo)

            })
          }
        })
      },

      // 删除
      DeleteOneAccount (id) {
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
              this.getContractInfoByContractNo(this.OpercontractNo)
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
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose () {
        this.$emit('refreshDataList')
        this.visible = false
      }
    },
    mounted () {
      // this.getProjectsFromApi().then(success=>{}).catch(error=>{})
    }

  }
</script>

<style>


  .bottom_btn {
    margin: 20px;
    width: 100%;
    text-align: center;
  }


</style>


