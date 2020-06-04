<template>
  <div class="mod-config">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button v-if="isAuth('set:workgroup:save')" size="large" type="primary" icon="el-icon-plus" @click="addWorkGroupHandle()">添加工作组</el-button>
      </div>

      <div class="col-md-10 col-md-offset-1" v-loading="dataListLoading">
        <el-row>
          <el-card>
            <div slot="header" class="clearfix">
              <span class="card_title"> 工作组结构图表</span>
            </div>
            <div class="text-center" v-for="group in groupTreeDat">
              <branch-tree name="test"
                           :data="group"
                           :horizontal="true"
                           :collapsable="false"
                           :props="groupTreeProps"
                           :label-class-name="labelClassName"
                           :render-content="renderContent"
                           @on-node-click="onNodeClick"
                           @on-node-itop="sortClickHandle"/>
              <!--                             @on-node-mouseover="showNodeClick"-->

            </div>
          </el-card>

        </el-row>

      </div>
    </el-card>
    <!-- 弹窗, 新增 / 修改 个人资料 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" ></add-or-update>
  </div>
</template>

<script>
  import BranchTree from '@/components/branch-tree/index'
  import addOrUpdate from './workgroup-add-or-update'
  import { treeDataTranslate } from '@/utils'
  import {stringIsNull} from '../../../utils'

  export default {
    data () {
      return {
        groupTreeDat: {},
        groupTreeProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        },
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        labelClassName: 'bg-white',
        horizontal: false,
        collapsable: true,
        expandAll: false,
      }
    },
    components: {
      addOrUpdate,
      BranchTree
    },
    activated () {
      this.init()
    },
    methods: {
      init () {
        this.getDataList().then( groupList => {
          this.groupTreeDat = treeDataTranslate(groupList , 'id', 'pid')
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/set/workgroup/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.dataList = []
            }
            this.dataListLoading = false
          })
        })
      },
      renderContent (h, data) {
        return h('div', {
          domProps: {
            className: 'span_detail'
          }
        },[
          stringIsNull(data.headId) ? h() : h('div',[h('span', '队长:'),h('span',data.headMan )]),
          stringIsNull(data.deputyId) ? h() : h('div',[h('span', '副队:'), ,h('span',data.deputyLeader )])
        ])
      },
      // 新增 / 修改
      addWorkGroupHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      onNodeClick(e, data) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(data.id)
        })
      },
      // 调整顺序
      sortClickHandle (e,data) {
        console.log(data)
        this.$http({
          url: this.$http.adornUrl('/set/workgroup/sort'),
          method: 'post',
          data: this.$http.adornData({
            id: data.id,
            pid: data.pid
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            // 成功
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            // 更新数据
            this.init()
          } else {
            // 失败
            this.$message.error(data.msg)
          }
        })
      },

    }
  }
</script>

<style>
  .span_detail {
    margin-top: 2px;
    font-size: 10pt;
    color: #6f7180;
  }
  .branch {
    border: 2px solid #0BB2D4;
    box-shadow: 5px 5px 3px rgba(73, 148, 204, 0.15);
    width: 145px;
    height: auto;
    font-size: 17pt;
    padding: 5px;
    border-radius: 5px;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    cursor: pointer;
  }
  .branch>.branch_header{
    display: flex;
    justify-content: space-between;
  }
  .branch>.branch_header>.branch_name{
    font-size: 13pt;
    vertical-align: middle;
    min-width: 70%;
  }
  .branch>.branch_detail_show{
    height: auto;
    display: block;
  }
  .branch>.branch_detail_close{
    height: 0;
    display: none;
  }

  .branch>.branch_header:hover{
    color: #00a2d4;
  }
  .branch>.branch_header i:hover{
    color: red;
  }

  .card_title{
    font-size: 19pt;
    font-weight: 700;
  }
  .detail_content{
    font-size: 11pt;
  }
  .detail_content .content_row{
    margin-bottom: 10px;
  }

  .detail_content .content_row .maintag{
    font-size: 10pt;
    height: 100%;
    max-width: 100px;
    text-align: center;
    color: #ff2a2c;
    background-color: #ffd2dc;
    border-radius: 3px;
  }
  .detail_content .content_row .secondtag{
    font-size: 10pt;
    height: 100%;
    max-width: 100px;
    text-align: center;
    color: #67c23a;
    background-color: #f0f9e6;
    border-radius: 3px;
  }
  .detail_footer{
    margin-top: 32px;
    border-top: 1px dashed silver;
    display: flex;
    padding: 12px 0px 0px 0px;
    justify-content: flex-end;
  }
  .on-node-itop {
    margin-left: 7px;
    font-size: 14pt;
    font-weight: 700;
    vertical-align: middle;
  }
  .on-node-itop:hover{
    color: red;
  }
  .org-tree-node-label .org-tree-node-label-inner span{
    font-size: 11pt;
  }
  .org-tree-node-label .org-tree-node-label-inner span:hover{
    border-bottom: 1px double #00a0e9;
    color: red;
    font-size: 11pt;
    text-decoration: underline;
  }
</style>
