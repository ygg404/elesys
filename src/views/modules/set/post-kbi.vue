<template>
  <div class="role_mod">
    <el-form :inline="true" >
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" size="large" @click="editKbiHandle()">编辑考核项</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column label="岗位" prop="roleName"></el-table-column>
      <el-table-column v-for="item in kbiList" :label="item.kbiName + '(%)'" :key="item.id" :prop="'kbi' + item.id">
        <template slot-scope="scope">
          <input v-model="scope.row['kbi' + item.id]" min="0" max="100" type="number" style="width: 60px;" @change="inputChangeHandle"></input>
        </template>
      </el-table-column>
      <el-table-column label="合计" prop="allRatio">
        <template slot-scope="scope">
          <span :class="scope.row.allRatio == 100? 'green_span': 'red_span'">{{scope.row.allRatio}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn_class">
      <el-button type="success" size="large" @click="dataFormSubmit">提交并保存设置</el-button>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init"></add-or-update>
    <!-- 弹窗, 编辑考核项目 -->
    <post-kbi-list v-if="kbiListVisible" ref="postKbiList" @refreshDataList="init"></post-kbi-list>
  </div>
</template>

<script>
  import AddOrUpdate from './post-kbi-add-or-update'
  import PostKbiList from './post-kbi-list'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        dataListLoading: false,
        addOrUpdateVisible: false,
        kbiListVisible: false,
        dataList: [],
        kbiList: [],
        roleList: [],
      }
    },
    components: {
      AddOrUpdate,
      PostKbiList
    },
    methods: {
      // 初始化
      init () {
        this.dataList = []
        this.getRoleList().then(list =>{
          this.roleList = list
          this.getRoleKbiList().then(roleKBIList => {
            this.getKbiList().then(list => {
              this.kbiList = list
              for (let role of this.roleList) {
                let roleKbiItem = {
                  roleId: role.roleId,
                  roleName: role.roleName,
                  allRatio: 0
                }
                // 根据考核项动态添加 键值
                for (let kbi of list) {
                  roleKbiItem['kbi' + kbi.id] = 0 // 默认考核项的分数为0
                }
                if (role.roleId !== 1) this.dataList.push(roleKbiItem)
              }
              // 根据岗位与考核项对应的分数
              for (let data of this.dataList) {
                for (let roleKbi of roleKBIList) {
                  if (data.roleId === roleKbi.roleId) {
                    data['kbi' + roleKbi.kbiId] = roleKbi.kbiRatio
                  }
                }
              }
              console.log(this.dataList)
              this.inputChangeHandle()
            })
          })
        })

      },
      // 获取数据列表
      getRoleKbiList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/rolekbi/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.kbiList = []
            }
          })
        })
      },
      // 获取角色列表
      getRoleList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get'
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
      // 获取KBI考核项的列表
      getKbiList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/kbi/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.kbiList = []
            }
          })
        })
      },
      // 输入数值改变
      inputChangeHandle () {
        for (let data of this.dataList) {
          let allratio = 0
          for (var prop in data) {
            if (prop.indexOf('kbi') !== -1) {
              if (stringIsNull(data[prop])) data[prop] = 0
              allratio += parseInt(data[prop])
            }
          }
          data.allRatio = allratio
        }
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 编辑考核项
      editKbiHandle () {
        this.kbiListVisible = true
        this.$nextTick(() => {
          this.$refs.postKbiList.init()
        })
      },
      dataFormSubmit () {
        let roleKbiList = []
        for (let data of this.dataList) {
          if (data.allRatio !== 100) {
            this.$message.error('[' + data.roleName + ']合计占比不满足100%')
            return
          } else {
            for (var prop in data) {
              if (prop.indexOf('kbi') !== -1) {
                let dat = {
                  roleId: data.roleId,
                  kbiId: prop.replace('kbi',''),
                  kbiRatio: parseInt(data[prop])
                }
                roleKbiList.push(dat)
              }
            }
          }
        }
        console.log(roleKbiList)
        this.$http({
          url: this.$http.adornUrl(`/sys/rolekbi/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'rkList': roleKbiList
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .btn_class{
    width: 100%;
    text-align: center;
    padding: 20px;
  }
  .green_span {
    color: green;
  }
  .red_span{
    color: red;
  }
</style>
