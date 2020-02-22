<template>
  <div class="mod-config">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button size="large" type="primary" icon="el-icon-plus" @click="addBranchHandle()">添加部门</el-button>
      </div>
      <!--<div style="width: 100%;height: 500px;overflow: hidden; position:relative;" v-loading="loading">-->
        <!--<div class="branch_cell" >-->
          <!--<div class="header">-->
            <!--<i class="el-icon-school"></i>-->
            <!--<span class="groupname">测绘队</span>-->
          <!--</div>-->
          <!--<div class="groupdetail">-->
            <!--<div class="usercontent"></div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="div" v-drag style="border: 1px solid #00ff00;width: 100px;height: 100px;background-color: red;position: absolute;"></div>-->
      <!--</div>-->

      <div class="col-md-10 col-md-offset-1" v-loading="loading">

        <div class="text-center">

          <branch-tree name="test"
                         :data="branchTreeDat"
                         :horizontal="true"
                         :collapsable="false"
                         :props="branchTreeProps"
                         :label-class-name="labelClassName"
                         :render-content="renderContent"
                         @on-node-click="onNodeClick"
          />
          <el-transfer v-model="value" :data="data"></el-transfer>
        </div>
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
        branchTreeDat:{},
        data: {
          id: 0,
          label: "XXX科技有限公司",
          children: [
            {
              id: 2,
              label: "产品研发部",
              children: [
                {
                  id: 5,
                  label: "研发-前端"
                },
                {
                  id: 6,
                  label: "研发-后端"
                },
                {
                  id: 9,
                  label: "UI设计"
                },
                {
                  id: 10,
                  label: "产品经理"
                }
              ]
            },
            {
              id: 3,
              label: "销售部",
              children: [
                {
                  id: 7,
                  label: "销售一部"
                },
                {
                  id: 8,
                  label: "销售二部"
                }
              ]
            },
            {
              id: 4,
              label: "财务部"
            },
            {
              id: 9,
              label: "HR人事"
            }
          ]
        },
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
        labelClassName: "bg-white"
      };
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
            for(let dat of data.list){
              dat.label = dat.branchName
            }
            this.branchTreeDat = treeDataTranslate(data.list , 'id')[0]
            console.log(this.branchTreeDat)
          } else {
            this.dataList = []
          }
          this.loading = false
        })
      },
      renderContent(h, data) {
        return data.label;
      },
      onNodeClick(e, data) {
        alert(data.label);
      },
      collapse(list) {
        var _this = this;
        list.forEach(function(child) {
          if (child.expand) {
            child.expand = false;
          }
          child.children && _this.collapse(child.children);
        });
      },
      addBranchHandle(){
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.branchAddOrUpdate.init()
        })
      }
    },
    directives: {
      drag: {
        // 指令的定义
        bind: function (el) {
          let odiv = el;   //获取当前元素
          el.onmousedown = (e) => {
            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            let left = '';
            let top = '';
            document.onmousemove = (e) => {
              //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
              left = e.clientX - disX;
              top = e.clientY - disY;
              //绑定元素位置到positionX和positionY上面
              //移动当前元素
              odiv.style.left = left + 'px';
              odiv.style.top = top + 'px';
            };
            document.onmouseup = (e) => {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      }
    }
  };
</script>
<style type="text/css">


  .branch_cell {
    /*position: absolute;*/
    border: 2px solid #0BB2D4;
    box-shadow: 5px 5px 3px rgba(73, 148, 204, 0.15);
    width: 120px;
    height: auto;
    font-size: 18pt;
    padding: 5px;
    border-radius: 5px;
  }
  .branch_cell > .header i{
    font-size: 17pt;
    vertical-align: middle;
  }
  .branch_cell > .header >.groupname{
    font-size: 13pt;
    vertical-align: middle;
  }
  .branch_cell >.groupdetail{
    border-top: 1px dashed #00a0e9;
    display: none;
  }
  .branch_cell >.groupdetail > .usercontent{
    display: flex;
    justify-content: space-between;
    font-size: 10pt;
  }
  .branch_cell >.groupdetail > .usercontent i{
    font-size: 9pt;
  }
  .branch_cell :hover{
    cursor: pointer;
    color: #00a0e9;
  }
  .branch_cell :hover + .groupdetail{
    display: block;
  }

</style>
