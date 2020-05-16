<template>
  <div class="role_mod" id="rolePanel">
      <div class="role_left">
        <el-card >
          <div slot="header"><h1>未分组人员</h1></div>
          <div>
            <el-input prefix-icon="el-icon-search" placeholder="搜索成员关键字"
                      v-model="keySearch" ></el-input>
            <div class="role_content">
              <draggable v-model="roleList[0].userList"  @change="changeDragHandle" @end="endDropEvent" id="0"
                         v-bind="{animation: 200,  group: 'role', disabled: false, chosenClass: 'choose', ghostClass: 'ghost'}" tag="ul">
                <li v-for="(item, index) in roleList[0].userList" :key="item.userId" v-if="item.username.indexOf(keySearch.trim()) != -1" class="role_content_card" >
                  <icon-svg name="admin"></icon-svg>{{item.username}}
                </li>
              </draggable>

            </div>
          </div>
        </el-card>
      </div>
      <div class="role_right" :style="'width:' + rightWidth + 'px;max-height:' + rightHeight + 'px'">
        <div v-for="(item, index) in roleList" style="width: 200px;display:inline-block;" v-if="item.roleId != 0">
          <el-card>
            <div slot="header"><h1>{{item.roleName}}</h1></div>
            <div>
                <draggable v-model="item.userList" :id="item.roleId"  @change="changeDragHandle" @end="endDropEvent" class="role_right_content"
                           v-bind="{animation: 200,  group: 'role', disabled: false,chosenClass: 'choose', ghostClass: 'ghost'}" tag="ul">
                  <li v-for="user in item.userList" :key="user.userId" class="role_content_card">
                    <icon-svg name="admin"></icon-svg>{{user.username}}
                  </li>
                </draggable>
            </div>
          </el-card>
        </div>


    </div>
  </div>
</template>

<script>
  import elementResizeDetectorMaker from 'element-resize-detector'
  import draggable from 'vuedraggable'

  export default {
    data () {
      return {
        rightWidth: 700,
        rightHeight: 600,
        userAllList: [],
        roleList: [{
          'roleId': 0,
          'roleName': ''
        }], // 岗位表
        roleUserList: [], // 岗位与成员关系表
        keySearch: '',
        dragElement: {}
      }
    },
    mounted () {
      // 监听窗口大小
      let _this = this
      const erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementById('rolePanel'), element => {
        _this.$nextTick(() => {
          // 监听到事件后执行的业务逻辑
          _this.rightWidth = document.getElementById('rolePanel').clientWidth - 260
          _this.rightHeight = _this.documentClientHeight - 220
          console.log(document.getElementById('rolePanel').clientHeight)
        })
      })
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        },
        set (val) {
          this.$store.commit('common/updateDocumentClientHeight', val)
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      // 数据列表初始化
      init () {
        let roleList = [{
          'roleId': 0,
          'roleName': ''
        }]
        let roleUserList = []
        let userAllList = []
        this.getRoleList().then(data => {
          roleList = roleList.concat(data)
          this.getRoleUserList().then(list => {
            roleUserList = list
            this.getAllUserList().then(userList => {
              userAllList = userList
              for (let user of userAllList) {
                user.roleId = 0   // 默认为未分组岗位
                for (let roleuser of roleUserList) {
                  if (roleuser.userId === user.userId) {
                    user.roleId = roleuser.roleId
                  }
                }
              }
              for (let role of roleList) {
                role.userList = []
                for (let user of userAllList) {
                  if (role.roleId === user.roleId) {
                    role.userList.push(user)
                  }
                }
              }
              this.roleList = roleList
            })
          })
        })
      },
      getAllUserList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/getAllUserList'),
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
      getRoleUserList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/userrole/list'),
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
      // 拖拽过程
      changeDragHandle (event) {
        if (event['added'] !== undefined) {
          this.dragElement = event['added'].element
          console.log(event['added'].element)
        }
      },
      // 拖拽结束事件
      endDropEvent (event) {
        let oldroleId = event.from.id
        let roleId = event.to.id
        if (oldroleId === roleId) {
          return
        }
        let userId = this.dragElement.userId
        this.$http({
          url: this.$http.adornUrl(`/sys/userrole/update`),
          method: 'post',
          data: this.$http.adornData({
            'userId': userId,
            'roleId': roleId
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
      }
    }
  }
</script>

<style scoped>
  .role_mod {
    width: 100%;
    /* Chrome all / Safari all /opera15+*/
    -webkit-user-select: none;
    /* Firefox all */
    -moz-user-select: none;
    /* IE 10+ */
    -ms-user-select: none;
    /* 通用 */
    user-select: none;
  }
  .role_left{
    width: 220px;
    float: left;
    word-wrap: break-word;
  }
  .role_right{
    margin-left: 15px;
    position: relative;
    float: left;
    overflow-y: auto;
  }
  .role_content{
    max-height: 600px;
    overflow-y: auto;
  }
  .role_content_card{
    margin-top: 3px;
    margin-bottom: 3px;
    font-size: 11pt;
    cursor: pointer;
    border: 1px solid #67aed7;
    text-align: center;
    width: 118px;
    line-height: 200%;
  }
  .role_content_card li{
    height: 32px;
  }
  .role_content li:hover{
    background: #3b97d7;
    color: white;
  }
  .role_right_content {
    height: 180px;
    overflow-y: auto;
  }
  .role_right_content li:hover{
    background: #3b97d7;
    color: white;
  }
</style>
