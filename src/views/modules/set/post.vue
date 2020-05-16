<template>
  <div class="mod-role" >
    <el-tabs v-model="activeName" type="border-card" ref="Panel">
      <el-tab-pane label="岗位对照表" name="first">
        <post-index ref="postIndex"></post-index>
      </el-tab-pane>
      <el-tab-pane label="岗位划分" name="second">
        <post-user ref="postUser"></post-user>
      </el-tab-pane>
      <el-tab-pane label="岗位效能考核设置" name="third">
        <post-kbi ref="postKbi"></post-kbi>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import postIndex from './post-index'
  import postUser from './post-user'
  import postKbi from './post-kbi'

  export default {
    data () {
      return {
        activeName: 'first'
      }
    },
    components: {
      postIndex,
      postUser,
      postKbi
    },
    methods: {
    },
    watch: {
      activeName (val) {
        switch (this.activeName) {
          case 'first':
            this.$refs.postIndex.getDataList()
            break
          case 'second':
            this.$refs.postUser.init()
            break
          case 'third':
            this.$refs.postKbi.init()
            break
          default:
            break
        }
      }
    }
  }
</script>
