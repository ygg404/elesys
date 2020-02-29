<template>
  <div class="mod-config">
    <el-card>
      <el-collapse class="collapse_item">
        <el-collapse-item  name="1">
          <template slot="title">
            <span class="collapse_item_title">基本工资设置</span>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
        <el-collapse-item  name="2">
          <template slot="title">
            <span class="collapse_item_title">绩效设置</span>
          </template>
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'payset'
  }
</script>

<style scoped>
  .collapse_item{
    border: 1px solid #8c939d;
  }
  .collapse_item_title{
    padding: 5px;
    font-size: 14pt;
    font-weight: 700;
  }
</style>
