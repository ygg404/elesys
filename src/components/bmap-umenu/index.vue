<template>
  <el-card class="box_card" :body-style="{ padding: '3px' }">
    <div class="text_item">
      <div :underline="false" @click="addProHandle(null,0)"><i class="el-icon-tickets"></i><span>创建图层</span></div>
    </div>
    <div class="text_item">
      <div :underline="false">
        <input type="file" class="kml_input" accept=".kml" id="kml" @change="importKMLHandle"/>
        <i class="el-icon-document"></i>  <span>导入KML</span>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {stringIsNull} from '@/utils'

  export default {
    props: {
      vueObj: {
        type: Object,
        required: true
      },
      selectNode: {
        type: Object,
        required: true
      },
      copyItem: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 右键菜单 添加项目
      addProHandle (id, pId) {
        this.vueObj.addProjectHandle(id, pId)
      },
      // 右键菜单 导入Kml 文件
      importKMLHandle (e) {
        if (e.target.files && e.target.files.length === 1) {
          let fd = new FormData()
          fd.append('file', e.target.files[0])
          fd.append('parentId', 0)
          this.$http({
            url: this.$http.adornUrl(`/dop/bmap/upKmlFile`),
            method: 'post',
            headers: {
              'Content-Type': 'multipart/form-data;charset=UTF-8'
            },
            data: fd
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.vueObj.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
          e.target.value = null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/assets/scss/_variables.scss";
  .box_card {
    box-shadow: 5px 0px 5px $navbar--background-color;
    .text_item :hover {
      color: red;
      font-weight: 700;
      cursor: pointer;
    }
    .text_item {
      width: 100%;
      padding: 4px;
      border-bottom: 1px dashed $navbar--background-color;
      color: $navbar--background-color;
    }
    .text_item i{
      font-size: 14pt;
    }
    .text_item span{
      font-size: 13pt;
    }
  }
  .add_item_box:hover .add_item{
    display: block;
  }
  .add_item {
    font-size: 11pt;
    position:absolute;
    left:115px;
    top:100px;
    min-width:138px;
    display: none;
  }
  .kml_input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
</style>

