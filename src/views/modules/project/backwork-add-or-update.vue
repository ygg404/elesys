<template>
  <el-dialog title="项目返修内容" :close-on-click-modal="false" :visible.sync="visible" :before-close="reportDialogClose" width="80%">
    <el-table :data="dataList">
      <el-table-column prop="backCreateTime" header-align="center" align="center" label="返修日期" ></el-table-column>
      <el-table-column prop="backNote" header-align="center" align="center" label="返修要求" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="checkReportHandle(scope.row)">查看内容</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="submitCreateTime" header-align="center" align="center" label="修改日期"></el-table-column>
      <el-table-column prop="submitNote" header-align="center" align="center" label="修改说明"></el-table-column>
      <el-table-column header-align="center" align="center"  label="操作" v-if="isEdit">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addNoteHandle(scope.row)" v-if="scope.row.submitNote == null">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 质检反馈报告-->
    <el-card class="quality_card" v-if="proLoading">
      <div  class="loading_clss">
        <el-progress type="circle" :percentage="curRate"></el-progress>
      </div>
    </el-card>
    <el-card :class="proLoading == false && reportVisible? 'anim_report_view' : 'anim_not_view' " >
      <div class="quality_card_title">{{reportTitle}}</div>
      <div ref="reportId" class="quality_report" ></div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,reportVisible = false">取消</el-button>
    </span>

    <el-dialog title="编辑回复" :close-on-click-modal="false" :visible.sync="noteVisible" append-to-body width="80%"
        v-loading="postLoading" :element-loading-text="loadingText">
      <div  class="loading_clss" v-if="editLoading">
        <el-progress type="circle" :percentage="curRate"></el-progress>
        <div style="color: #2D64B3">正在加载文档请稍等。。。</div>
      </div>
      <wang-editor v-if="!editLoading && !postLoading" ref="wangEditor" :content="ueContent" @refreshContent="getReportHandle"></wang-editor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteVisible = false">取消</el-button>
        <el-button @click="dataFormSubmit" type="primary">提交</el-button>
      </span>
    </el-dialog>

  </el-dialog>
</template>

<script>
  import WangEditor from '@/components/WangEditor/index'
  import Vue from  'vue'
  import Viewer from 'v-viewer'
  import 'viewerjs/dist/viewer.css'

  Vue.use(Viewer)
  Viewer.setDefaults({
    'inline':true,
    'button':true, //右上角按钮
    "navbar": true, //底部缩略图
    "title": true, //当前图片标题
    "toolbar": true, //底部工具栏
    "tooltip": true, //显示缩放百分比
    "movable": true, //是否可以移动
    "zoomable": true, //是否可以缩放
    "rotatable": true, //是否可旋转
    "scalable": true, //是否可翻转
    "transition": true, //使用 CSS3 过度
    "fullscreen": true, //播放时是否全屏
    "keyboard": true, //是否支持键盘
    "url": "data-source",
    ready: function (e) {
      console.log(e.type,'组件以初始化');
    },
    show: function (e) {
      console.log(e.type,'图片显示开始');
    },
    shown: function (e) {
      console.log(e.type,'图片显示结束');
    },
    hide: function (e) {
      console.log(e.type,'图片隐藏完成');
    },
    hidden: function (e) {
      console.log(e.type,'图片隐藏结束');
    },
    view: function (e) {
      console.log(e.type,'视图开始');
    },
    viewed: function (e) {
      console.log(e.type,'视图结束');
      // 索引为 1 的图片旋转20度
      if(e.detail.index === 1){
        this.viewer.rotate(20);
      }
    },
    zoom: function (e) {
      console.log(e.type,'图片缩放开始');
    },
    zoomed: function (e) {
      console.log(e.type,'图片缩放结束');
    }
  })

  export default {
    data () {
      return {
        visible: false,
        noteVisible: false,
        reportVisible: false,
        reportTitle: '',
        isEdit: true,
        imageList: [], // 报告图片列表
        curprog: 0,   // 当前进度
        totalprog: 1,  // 总进度
        curRate: 0,  // 进度百分比
        proLoading: false, // 获取进度显示
        editLoading: false, // 编辑获取文章进度
        ueContent: '', // 修改说明在线编辑内容
        postLoading: false, // 上传
        loadingText: '', // 上传文本
        dataForm: {
          id: 0,
          projectno: '',
          backnote: '',
          backcreatetime: '',
          submitNote: '',
          submitcreatetime: '',
          backstage: '',
          backdatenum: '',
          groupid: ''
        },
        dataRule: {
          submitNote: [
            { required: true, message: '提交内容不能为空', trigger: 'blur' }
          ]
        },
        dataList: []
      }
    },
    components: {
      WangEditor
    },
    methods: {
      init (projectNo,isEdit) {
        this.visible = true
        this.isEdit = isEdit
        this.$nextTick(() => {
          if (projectNo) {
            this.$http({
              url: this.$http.adornUrl(`/project/backwork/list/${projectNo}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.list
                this.$refs.reportId.innerHTML = ''
              }
            })
          }
        })
      },
      // 查看质检反馈内容
      checkReportHandle (item) {
        this.reportVisible = true
        this.reportTitle = '质检反馈报告（ 日期：' + item.backCreateTime + ')'
        this.curprog = 0
        this.$refs.reportId.innerHTML = ''
        this.getReportFromApi(item,true).then(data => {
          this.curRate = 0
          this.curprog = 0
          this.totalprog = data.space
          this.proLoading = true
          this.getReportFromApi(item,false).then(bdata => {
            this.proLoading = false
            this.$refs.reportId.innerHTML = bdata.backwork.backNote
          })
        })
      },
      // 通过后台获取质检返修记录的反馈(spaceFlag为true先获取文章大小)
      getReportFromApi (item , spaceFlag = false) {
        let totalprog = this.totalprog
        let that = this
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/backwork/info`),
            method: 'get',
            params: this.$http.adornParams({
              'spaceFlag': spaceFlag,
              'id': item.id
            }),
            // 加载进度的事件
            onDownloadProgress: function (progressEvent) {
              if (!spaceFlag) {
                this.curprog = progressEvent.loaded
                that.curRate = parseInt( this.curprog * 100 / totalprog)
              }
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 返修列表关闭事件
      reportDialogClose () {
        this.reportVisible = false
        this.visible = false
      },
      // 添加提交内容
      addNoteHandle (item) {
        console.log(item)
        this.dataForm.id = item.id
        this.dataForm.projectNo = item.projectNo
        this.noteVisible = true
        this.reportVisible = false
        this.curprog = 0
        this.$refs.reportId.innerHTML = ''
        this.getReportFromApi(item,true).then(data => {
          this.curRate = 0
          this.curprog = 0
          this.totalprog = data.space
          this.editLoading = true
          this.getReportFromApi(item,false).then(bdata => {
            this.editLoading = false
            this.ueContent = bdata.backwork.backNote
          })
        })
      },
      // 实时获取编辑报告内容
      getReportHandle (content) {
        this.ueContent = content
      },
      // 表单提交
      dataFormSubmit () {
        let that = this
        that.loadingText = ''
        that.postLoading = true
        this.$http({
          url: this.$http.adornUrl(`/project/backwork/update`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id,
            'projectNo': this.dataForm.projectNo,
            'submitNote': this.ueContent,
            'backStage': 1
          }),
          // 加载进度的事件
          onUploadProgress: function (progressEvent) {
            that.loadingText = '正在上传中...（' + parseInt(progressEvent.loaded * 100 / progressEvent.total).toString() + '%)'
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            that.postLoading = false
            this.noteVisible = false
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .quality_card{
    margin-top: 15px;
  }
  .quality_card .quality_card_title{
    font-weight: 700;
    font-size: 13pt;
    border-bottom: 1px solid #00a0e93f;
  }
  .quality_report{
    overflow: auto;
    padding: 8px;
  }

  .anim_not_view{
    opacity: 0;
  }
  /* 下拉动画 */
  .anim_report_view{
    display: block;
    animation:2s report_view 0s;
  }

  @keyframes report_view{
    0%{opacity:0}
    50%{opacity:.8;}
    100%{opacity:0;}
  }

  .loading_clss{
    width: 100%;
    text-align: center;
    background-color: #6f71805f;
    opacity: 0.8;
  }
</style>
