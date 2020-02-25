<template>
  <div class="mod-config">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button size="large" type="primary" icon="el-icon-plus" @click="addBranchHandle()">添加部门</el-button>
      </div>
<!--      <div style="width: 100%;height: 500px;overflow: hidden; position:relative;" v-loading="loading">-->
        <div class="branch_cell"  >
          <div class="header" >
            <span class="groupname">测绘队</span>
            <i class="el-icon-top"></i>
          </div>
          <div class="groupdetail">
            <div class="usercontent"></div>
            <div class="btnfooter">
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </div>
          </div>
        </div>

      <div class="branch_cell"  >
        <div class="header" >
          <span class="groupname">测绘队</span>
          <i class="el-icon-top"></i>
        </div>
        <div class="groupdetail">
          <div class="usercontent"></div>
          <div class="btnfooter">
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </div>
        </div>
      </div>
<!--        </div>-->
<!--        <div class="div" v-drag style="border: 1px solid #00ff00;width: 100px;height: 100px;background-color: red;position: absolute;"></div>-->


      <div class="col-md-10 col-md-offset-1" v-loading="loading">


        <div class="text-center" v-for="branchTree in branchTreeDat">
          <branch-tree name="test"
                         :data="branchTree"
                         :horizontal="true"
                         :collapsable="false"
                         :props="branchTreeProps"
                         :label-class-name="labelClassName"
                         :render-content="renderContent"
                         @on-node-click="onNodeClick"
          />
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
            this.branchTreeDat = treeDataTranslate(data.list , 'id')
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
        console.log(data.id)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.branchAddOrUpdate.init(data.id)
        })
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
    width: 145px;
    height: auto;
    font-size: 18pt;
    padding: 5px;
    border-radius: 5px;
  }
  .branch_cell > .header{
    display: flex;
    justify-content: space-between;
  }

  .branch_cell > .header i{
    font-size: 17pt;
    vertical-align: middle;
  }
  .branch_cell > .header i:hover{
    color: red;
  }
  .branch_cell > .header >.groupname{
    font-size: 13pt;
    vertical-align: middle;
  }
  .branch_cell >.groupdetail{
    min-height: 10px;
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
  .branch_cell >.groupdetail > .btnfooter {

  }
  .branch_cell > .groupfooter{
    display: none;
  }
  .branch_cell :hover{
    cursor: pointer;
    color: #00a0e9;
  }
  .branch_cell > .header :checked ~.groupdetail {
    display: block;
  }

  /*.branch_cell > .groupdetail :hover {*/
  /*  display: block;*/
  /*}*/


</style>
