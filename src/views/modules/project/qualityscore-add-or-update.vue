<template>
  <el-dialog
    title="质量评分" :close-on-click-modal="false" :visible.sync="visible" >
    <span class="span_output">质量评分</span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: true,
        totalOutPut: 0,
        tOutPut: 0,  // 计算中的产值和占比
        tRate: 0,
        projectNo: '',
        dataForm: {
          id: 0,
          projectNo: '',
          groupId: '',
          outputRate: '',
          shortDateTime: '',
          lastDateTime: '',
          projectOutput: '',
          projectActuallyOutput: ''
        },
        qualityScoreList: []
      }
    },
    mounted () {
    },
    methods: {
      init (projectNo) {
        this.getQualityScoreList(projectNo).then(data => {
          this.qualityScoreList = data
        })
        this.visible = true
      },
      // 根据项目编号获取质量评分列表
      getQualityScoreList (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/qualityscore/list`),
            method: 'get',
            params: this.$http.adornParams(
              { 'projectNo': projectNo }
            )
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
