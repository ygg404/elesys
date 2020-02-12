<template>
  <el-dialog width="80%"
    title="编辑档案" v-loading="loading"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="姓名" prop="username">
       <span>{{dataForm.username}}</span>
    </el-form-item>
    <el-form-item label="身份证号" prop="idNo">
      <el-input v-model="dataForm.idNo" placeholder="身份证号"></el-input>
    </el-form-item>
    <el-form-item label="出生日期" prop="birthday">
      <el-date-picker v-model="dataForm.birthday" type="date" value-format="yyyy-MM-dd" placeholder="出生日期" style="width: 150px;" ></el-date-picker>
    </el-form-item>
    <el-form-item label="入职时间" prop="entryTime">
      <el-date-picker v-model="dataForm.entryTime" type="date" value-format="yyyy-MM-dd" placeholder="入职时间" style="width: 150px;" ></el-date-picker>
    </el-form-item>
    <el-form-item label="工作类型" prop="jobType">
      <el-radio-group v-model="dataForm.jobType" >
        <el-radio :label="1" >全职</el-radio>
        <el-radio :label="2" >兼职</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="最高学历" prop="education">
      <el-select v-model="dataForm.education" placeholder="请选择最高学历" style="width: 135px;" class="select_btn">
        <el-option v-for="item in educationItemList" :label="item.dateItem" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="职称等级" prop="titleLever">
      <el-select v-model="dataForm.titleLever" placeholder="请选择职称等级" style="width: 135px;" class="select_btn">
        <el-option v-for="item in titleItemList" :label="item.dateItem" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item label="试用期（月）" prop="trialPeriod">
      <el-input v-model="dataForm.trialPeriod" type="number" min="0" max="12"  placeholder="试用期（月）"></el-input>
    </el-form-item>
    <el-form-item label="籍贯（省）" prop="nativeProvince">
      <el-input v-model="dataForm.nativeProvince" placeholder="籍贯（省）"></el-input>
    </el-form-item>
    <el-form-item label="籍贯（市）" prop="nativeCity">
      <el-input v-model="dataForm.nativeCity" placeholder="籍贯（市）"></el-input>
    </el-form-item>
    <el-form-item label="婚姻状况" prop="maritalStatus">
      <el-select v-model="dataForm.maritalStatus" placeholder="请选择婚姻状况" style="width: 135px;" class="select_btn">
        <el-option v-for="item in maritalItemList" :label="item.dateItem" :key="item.id" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="头像" prop="headImg">
      <el-input v-model="dataForm.headImg" placeholder="头像"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: true,
        maritalItemList: [],
        titleItemList: [],
        educationItemList: [],
        dataForm: {
          userId: 0,
          idNo: '',
          birthday: '',
          entryTime: '',
          jobType: '',
          education: '',
          titleLever: '',
          email: '',
          mobile: '',
          trialPeriod: '',
          nativeProvince: '',
          nativeCity: '',
          maritalStatus: '',
          headImg: ''
        },
        dataRule: {
          idNo: [
            { required: true, message: '身份证号不能为空', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: '出生日期不能为空', trigger: 'blur' }
          ],
          entryTime: [
            { required: true, message: '入职时间不能为空', trigger: 'blur' }
          ],
          jobType: [
            { required: true, message: '工作类型不能为空', trigger: 'blur' }
          ],
          education: [
            { required: true, message: '最高学历不能为空', trigger: 'blur' }
          ],
          titleLever: [
            { required: true, message: '职称等级不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          trialPeriod: [
            { required: true, message: '试用期（月）不能为空', trigger: 'blur' }
          ],
          nativeProvince: [
            { required: true, message: '籍贯（省）不能为空', trigger: 'blur' }
          ],
          nativeCity: [
            { required: true, message: '籍贯（市）不能为空', trigger: 'blur' }
          ],
          maritalStatus: [
            { required: true, message: '婚姻状况不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.maritalItemList = [{'id': 0, 'dateItem': '未婚'},
        {'id': 1, 'dateItem': '已婚'},
        {'id': 2, 'dateItem': '离异'},
        {'id': 3, 'dateItem': '丧偶'}]
      this.titleItemList = [{'id': 0, 'dateItem': '无'},
        {'id': 1, 'dateItem': '技术员'},
        {'id': 2, 'dateItem': '助理工程师'},
        {'id': 3, 'dateItem': '中级工程师'},
        {'id': 4, 'dateItem': '高级工程师'},
        {'id': 4, 'dateItem': '正高级工程师'}
      ]
      this.educationItemList = [{'id': 0, 'dateItem': '无'},
        {'id': 1, 'dateItem': '小学'},
        {'id': 2, 'dateItem': '初中'},
        {'id': 3, 'dateItem': '中专/高中/职高'},
        {'id': 4, 'dateItem': '专科'},
        {'id': 4, 'dateItem': '本科'},
        {'id': 4, 'dateItem': '硕士研究生'},
        {'id': 4, 'dateItem': '博士研究生'}
      ]
    },
    methods: {
      init (id) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.loading = true
          if (this.dataForm.userId) {
            this.$http({
              url: this.$http.adornUrl(`/ren/record/info/${this.dataForm.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.loading = false
              if (data && data.code === 0) {
                this.dataForm.idNo = data.renRecord.idNo
                this.dataForm.birthday = data.renRecord.birthday
                this.dataForm.entryTime = data.renRecord.entryTime
                this.dataForm.jobType = data.renRecord.jobType
                this.dataForm.education = data.renRecord.education
                this.dataForm.titleLever = data.renRecord.titleLever
                this.dataForm.email = data.renRecord.email
                this.dataForm.mobile = data.renRecord.mobile
                this.dataForm.trialPeriod = data.renRecord.trialPeriod
                this.dataForm.nativeProvince = data.renRecord.nativeProvince
                this.dataForm.nativeCity = data.renRecord.nativeCity
                this.dataForm.maritalStatus = data.renRecord.maritalStatus
                this.dataForm.headImg = data.renRecord.headImg
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/ren/record/${!this.dataForm.userId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
                'idNo': this.dataForm.idNo,
                'birthday': this.dataForm.birthday,
                'entryTime': this.dataForm.entryTime,
                'jobType': this.dataForm.jobType,
                'education': this.dataForm.education,
                'titleLever': this.dataForm.titleLever,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'trialPeriod': this.dataForm.trialPeriod,
                'nativeProvince': this.dataForm.nativeProvince,
                'nativeCity': this.dataForm.nativeCity,
                'maritalStatus': this.dataForm.maritalStatus,
                'headImg': this.dataForm.headImg
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
          }
        })
      }
    }
  }
</script>
