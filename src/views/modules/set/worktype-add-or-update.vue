<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="类型姓名" prop="typeName">
      <el-input v-model="dataForm.typeName" placeholder="类型姓名"></el-input>
    </el-form-item>
    <el-form-item label="单位" prop="unit">
      <el-input v-model="dataForm.unit" placeholder="单位"></el-input>
    </el-form-item>
    <el-form-item label="单位产值" prop="unitOutput">
      <el-input v-model="dataForm.unitOutput" placeholder="单位产值"></el-input>
    </el-form-item>

      <el-form-item label="项目类型" prop="ProjectTypeIdList">
    <el-select v-model="dataForm.ProjectTypeIdList" outlined multiple placeholder="请选择项目类型" style="width: 100%;">
                                    <el-option
                                            v-for="item in ProjectTypeList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
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
        dataForm: {
          id: 0,
          typeName: '',
          unit: '',
          unitOutput: '',
          startDateTime: '',
          updateDateTime: '',
         ProjectTypeIdList:[]
        },
        dataRule: {
          typeName: [
            { required: true, message: '类型姓名不能为空', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '单位不能为空', trigger: 'blur' }
          ],
          unitOutput: [
            { required: true, message: '单位产值不能为空', trigger: 'blur' }
          ]
        },
        //项目类型数据
        ProjectTypeList:[]
       
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/set/worktype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.typeName = data.workType.typeName
                this.dataForm.unit = data.workType.unit
                this.dataForm.unitOutput = data.workType.unitOutput
                this.dataForm.ProjectTypeIdList = data.workType.projectTypeIdList
//console.log('ProjectTypeIdList' + this.dataForm.ProjectTypeIdList);
              }
            })
          }
           this.getProjectTypeListFromApi();
        })
      },

      //从后台获得下拉列表内容  填充至选项
       getProjectTypeListFromApi() {
      return new Promise((resolve,reject) =>{
       this.$http({
          url: this.$http.adornUrl('/set/projecttype/selectprojecttype'),
          method:'get'
        }).then(({data}) => {
            if (data && data.code === 0) {
                //项目类型数据 赋值
                this.ProjectTypeList = data.list;
                
                // for(let item of data.list){
                //   let option = {
                //     value:item.id,
                //     label:item.name
                //   };
                //   this.ProjectTypeIdList.push(option);
               // }
               resolve(data.list)
            } else {
              //this.dataList = []
            }
        })
      })
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/set/worktype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'typeName': this.dataForm.typeName,
                'unit': this.dataForm.unit,
                'unitOutput': this.dataForm.unitOutput,
                'projectTypeIdList': this.dataForm.ProjectTypeIdList
               
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log('接收到ProjectTypeIdList' + this.dataForm.ProjectTypeIdList);
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
