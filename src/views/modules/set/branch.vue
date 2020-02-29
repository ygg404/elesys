<template>
  <div class="mod-config">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button size="large" type="primary" icon="el-icon-plus" @click="addBranchHandle()">添加部门</el-button>
      </div>

      <div class="col-md-10 col-md-offset-1" v-loading="loading">
        <el-row>
          <el-col :span="18">
            <el-card>
              <div slot="header" class="clearfix">
                <span class="card_title"> 组织结构图表</span>
              </div>
              <div class="text-center" v-for="branchTree in branchTreeDat">
                <branch-tree name="test"
                             :data="branchTree"
                             :horizontal="true"
                             :collapsable="false"
                             :props="branchTreeProps"
                             :label-class-name="labelClassName"
                             :render-content="renderContent"
                             @on-node-click="onNodeClick"
                             @on-node-mouseover="showNodeClick"
                             @on-node-itop="sortClickHandle"
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
              <el-card style="position: fixed;min-width: 290px;" v-if="branchShowDat !== ''">
                <div slot="header" class="clearfix"><span class="card_title"> 部门详情</span></div>
                <div class="detail_content" >
                  <el-row class="content_row"><el-col :span="8" >部门名称：</el-col>
                    <el-col :span="16" style="color: #1fd3e9">{{branchShowDat.branchName}}</el-col>
                  </el-row>
                  <div v-for="(recordVo,index) in branchShowDat.recordVoList">
                    <el-row class="content_row tag-group" >
                      <el-col :span="8" style="line-height: 200%;">{{index == 0? '部门成员：': '&ensp; ' }}</el-col>
                      <el-col :span="8" style="color: #00a0e9;vertical-align: middle;"><span style="line-height: 200%;">{{recordVo.username}}</span></el-col>
                      <el-col :span="8"><el-tag v-if="recordVo.userId === branchShowDat.mdeputyId" type="danger">主要负责人</el-tag></el-col>
                      <el-col :span="8"><el-tag v-if="recordVo.userId === branchShowDat.sdeputyId" type="success">副负责人</el-tag></el-col>
                    </el-row>
                  </div>
                </div>
                <div class="detail_footer">
                  <el-button type="primary" size="small" @click="onNodeClick( null, branchShowDat)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteBranchHandle">删除</el-button>
                </div>
              </el-card>
          </el-col>
        </el-row>

      </div>
    </el-card>
    <!-- 弹窗, 新增 / 修改 个人资料 -->
    <branch-add-or-update v-if="addOrUpdateVisible" ref="branchAddOrUpdate" @refreshDataList="getDataList" ></branch-add-or-update>
  </div>
</template>

<script>
  import BranchTree from "@/components/branch-tree/index"
  import branchAddOrUpdate from './branch-add-or-update'
  import { treeDataTranslate } from '@/utils'

  export default {
    data() {
      return {
        branchTreeDat: {},
        branchTreeProps: {
          id: 'id',
          branchName: 'label',
          children: 'children'
        },
        horizontal: false,
        collapsable: true,
        expandAll: false,
        addOrUpdateVisible: false,
        loading:false,
        labelClassName: "bg-white",
        display: false,
        branchShowDat: ''    // 展示的部门详情
      }
    },
    components: {
      BranchTree,
      branchAddOrUpdate
    },
    activated(){
      this.getDataList()
    },
    methods: {
      getDataList(){
        this.loading = true
        this.$http({
          url: this.$http.adornUrl('/set/branch/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
            this.branchTreeDat = treeDataTranslate(data.list , 'id')
            this.branchShowDat = ''
          } else {
            this.dataList = []
          }
          this.loading = false
        })
      },
      renderContent ( h, data ) {
      },
      onNodeClick(e, data) {
        console.log(data.id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.branchAddOrUpdate.init(data.id)
        })
      },
      showNodeClick (e , data) {
        this.branchShowDat = data
        // 部门用户列表根据 主要负责人和次要负责人排序
        let recordVoList = []
        for (let recordVo of data.recordVoList) {
            if (data.mdeputyId === recordVo.userId) {
              recordVoList.push(recordVo)
            }
        }
        for (let recordVo of data.recordVoList) {
          if (data.sdeputyId === recordVo.userId) {
            recordVoList.push(recordVo)
          }
        }
        for (let recordVo of data.recordVoList) {
          if (data.mdeputyId !== recordVo.userId && data.sdeputyId !== recordVo.userId) {
            recordVoList.push(recordVo)
          }
        }
        data.recordVoList = recordVoList
      },
      addBranchHandle(){
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.branchAddOrUpdate.init()
        })
      },
      showBranchHandle(){
        this.display = !this.display
      },
      // 顺序排序
      sortClickHandle (e , data) {
        console.log( data.id)
        this.$http({
          url: this.$http.adornUrl('/set/branch/sort'),
          method: 'post',
          data: this.$http.adornData({
            'id': data.id,
            'parentId': data.parentId,
            'orderNum': data.orderNum
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 删除部门
      deleteBranchHandle () {
        let tip = '是否删除部门 [' + this.branchShowDat.branchName + '] 及其下级部门所有的信息?'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/set/branch/delete'),
            method: 'post',
            data: this.$http.adornData([this.branchShowDat.id], false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }

    }
  }
</script>
<style type="text/css">
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
