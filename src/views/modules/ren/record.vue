<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @expand-change="recordLoadHandle" style="width: 100%;"  >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-card v-loading="infoloading" element-loading-text="正在加载个人资料...">
            <div slot="header" class="clearfix">
              <span class="card_head">详细资料</span>
            </div>
            <div>
              <el-row>
                <el-col :span="18" style="margin-top:20px;">
                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span" >姓名：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.username}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">出生日期：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.birthday}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">性别：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-tag v-if="scope.row.sex === 1" type="primary">男</el-tag>
                          <el-tag v-else-if="scope.row.sex === 2" type="warning">女</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span" >身份证号：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.idNo}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">籍贯：</span>
                        </el-col>
                        <el-col :span="16">
                          <span
                            class="card_detail_content"
                          >{{getPlaceName(scope.row.nativeProvince,scope.row.nativeCity)}}</span>
                        </el-col>
                      </el-row>
                    </el-col>

                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">婚姻状况：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">
                            <el-tag v-if="scope.row.maritalStatus === 0" type="success">未婚</el-tag>
                            <el-tag v-else-if="scope.row.maritalStatus === 1" type="primary">已婚</el-tag>
                            <el-tag v-else-if="scope.row.maritalStatus === 2" type="warning">离异</el-tag>
                            <el-tag v-else-if="scope.row.maritalStatus === 3" type="danger">丧偶</el-tag>
                          </span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">最高学历：</span>
                        </el-col>
                        <el-col :span="12">
                          <span class="card_detail_content">
                            {{scope.row.edName}}/{{scope.row.edTypeName}}
                          </span>
                        </el-col>
                      </el-row>
                    </el-col>

                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">职称等级：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">
                            {{scope.row.titleName}}
                          </span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">入职时间：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.entryTime }}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">试用期：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.trialPeriod}} 个月</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>

                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">邮箱：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.email}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">手机号：</span>
                        </el-col>
                        <el-col :span="16">
                          <span class="card_detail_content">{{scope.row.mobile}}</span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row class="card_elrow_margin">
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="8">
                          <span class="card_detail_span">工作类型：</span>
                        </el-col>
                        <el-col :span="16">
                          <el-tag v-if="scope.row.jobType === 1" type="primary">全职</el-tag>
                          <el-tag v-else-if="scope.row.jobType === 2" type="success">兼职</el-tag>
                          <el-tag v-else-if="scope.row.jobType === 2" type="info">实习</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-col :span="8">
                        <span class="card_detail_span">职务：</span>
                      </el-col>
                      <el-col :span="16">
                        <span>{{scope.row.dutyName}}</span>
                      </el-col>
                    </el-col>
                  </el-row>
                </el-col>

                <el-col :span="6">
                  <img :src="scope.row.headImg" class="card_detail_img" />
                </el-col>
              </el-row>
              <el-row class="card_table_title"><span>教育背景</span></el-row>
              <el-row>
                <el-table border :data="scope.row.edBackgroundList">
                  <el-table-column header-align="center" align="center" label="日期">
                    <template slot-scope="slot">
                      <span>{{slot.row.startDate}} 至 {{slot.row.endDate}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="educationBackground" header-align="center" align="center"
                                   label="学历"></el-table-column>
                  <el-table-column prop="educationSchool" header-align="center" align="center"
                                   label="学校"></el-table-column>
                  <el-table-column prop="major" header-align="center" align="center" label="专业"></el-table-column>
                </el-table>
              </el-row>
              <el-row class="card_table_title"><span>工作经历</span></el-row>
              <el-row>
                <el-table border :data="scope.row.workBackgroundList">
                  <el-table-column header-align="center" align="center" label="日期">
                    <template slot-scope="slot">
                      <span>{{slot.row.startDate}} 至 {{slot.row.endDate}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="company" header-align="center" align="center" label="企业"></el-table-column>
                  <el-table-column prop="jobPosition" header-align="center" align="center" label="职位"></el-table-column>
                  <el-table-column prop="jobDescription" header-align="center" align="center" label="工作描述"></el-table-column>
                </el-table>
              </el-row>
            </div>
          </el-card>
        </template>
      </el-table-column>
      <el-table-column prop="userId" header-align="center" align="center" label="用户id" width="90px;"></el-table-column>
      <el-table-column prop="useraccount" header-align="center" align="center" label="账号" width="100px;"></el-table-column>
      <el-table-column prop="username" header-align="center" align="center" label="姓名" width="120px;"></el-table-column>
      <el-table-column prop="headImg" header-align="center" align="center" label="照片" width="90px;">
        <template slot-scope="scope">
          <img :src='scope.row.headImg' class="head_image"/>
        </template>
      </el-table-column>
      <el-table-column prop="email" header-align="center" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" label="手机号"></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.userId)">编辑</el-button>
          <el-button type="danger" size="mini" @click="auditHandle(scope.row.userId)" v-if="scope.row.isAudit === 0">待审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[25, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 个人资料 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--审核 个人资料 -->
    <rencord-temp-add-or-update v-if="rencordTempVisible" ref="rencordTempAddOrUpdate" @refreshDataList="getDataList"></rencord-temp-add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './record-add-or-update'
  import RencordTempAddOrUpdate from './recordtemp-add-or-update'
  import {provinceAndCityData} from 'element-china-area-data'

  export default {
    data() {
      return {
        dataForm: {
          key: '',
          sidx: 'id',
          order: 'desc'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 25,
        totalPage: 0,
        dataListLoading: false,
        infoloading: true, // 个人资料Loading
        dataListSelections: [],
        placeOptions: provinceAndCityData,
        addOrUpdateVisible: false,
        rencordTempVisible: false
      }
    },
    components: {
      AddOrUpdate,
      RencordTempAddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 排序字段改变
      changeSort(val) {
        console.log(val)
        switch (val.order) {
          case 'ascending':
            this.dataForm.order = 'asc'
            break
          case 'descending':
            this.dataForm.order = 'desc'
            break
          default:
            this.dataForm.order = 'desc'
        }
        this.dataForm.sidx = val.prop
        this.getDataList()
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/ren/record/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'sidx': this.dataForm.sidx,
            'order': this.dataForm.order
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 审核步骤
      auditHandle (userId) {
        this.rencordTempVisible = true
        this.$nextTick(() => {
          this.$refs.rencordTempAddOrUpdate.init(userId , 1)
        })
      },
      // 获取个人详细资料
      recordLoadHandle (row, expandedRows) {
        console.log(expandedRows.length)
        if (expandedRows.length < 1) return
        this.infoloading = true
        this.$http({
          url: this.$http.adornUrl(`/ren/record/info/${row.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.infoloading = false
          if (data && data.code === 0) {
            row.username = data.renRecordVo.username
            row.idNo = data.renRecordVo.idNo
            row.sex = data.renRecordVo.sex
            row.birthday = data.renRecordVo.birthday
            row.entryTime = data.renRecordVo.entryTime
            row.jobType = data.renRecordVo.jobType
            row.houseType = data.renRecordVo.houseType
            row.education = data.renRecordVo.education
            row.titleLever = data.renRecordVo.titleLever
            row.email = data.renRecordVo.email
            row.mobile = data.renRecordVo.mobile
            row.trialPeriod = data.renRecordVo.trialPeriod
            row.nativeProvince = data.renRecordVo.nativeProvince
            row.nativeCity = data.renRecordVo.nativeCity
            row.nativePlace = [data.renRecordVo.nativeProvince, data.renRecordVo.nativeCity]
            row.maritalStatus = data.renRecordVo.maritalStatus
            row.headImg = data.renRecordVo.headImg
            row.edBackgroundList = data.renRecordVo.edBackgroundList
            row.workBackgroundList = data.renRecordVo.workBackgroundList
            row.edName = data.renRecordVo.edName
            row.edTypeName = data.renRecordVo.edTypeName
            row.dutyName = data.renRecordVo.dutyName
            row.titleName = data.renRecordVo.titleName
          }
        })
      },
      // 获取省市名称
      getPlaceName(nProvinceId, nCityId) {
        let pName = ''
        for (let provinceOption of this.placeOptions) {
          if (provinceOption.value === nProvinceId) {
            pName += provinceOption.label
            for (let cityOption of provinceOption.children) {
              if (cityOption.value === nCityId) pName += cityOption.label
            }
            break
          }
        }
        return pName
      }
    }
  }
</script>

<style scoped>
  .head_image {
    height: 50px;
    width: 50px;
    border-radius: 45%;
  }

  .card_head {
    font-size: 16pt;
    font-weight: 700;
  }

  .card_detail_span {
    font-weight: 700;
    font-size: 12pt;
  }

  .card_detail_content {
    font-size: 12pt;
  }

  .card_elrow_margin{
    margin-bottom:12px;
  }

  .card_table_title {
    border-bottom: 2px solid #00a2d4;
    font-size: 14pt;
    font-weight: 700;
    margin-top: 10px;
  }

  .card_detail_img {
    min-width: 180px;
    min-height: 243px;
    width: 180px;
    height: 243px;
    border: 1px solid #00b7ee;
    border-radius: 10px;
  }
</style>
