<template>
  <div>
    <!-- 搜索 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <div class="block">
            <span class="demonstration">选择要查看的日期：</span>
            <el-date-picker
              v-model="searchModel.date"
              align="right"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-select v-model="searchModel.action" clearable placeholder="请选择要查询的行为">
              <el-option
                v-for="item in actionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button @click="getDataList" type="primary" round icon="el-icon-search">查询</el-button>
          </div>          
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
    </el-card>
    <el-divider></el-divider>
    <!-- 结果列表 -->
    <el-card>
      <el-table 
      :data="dataList" 
      style="width: 100%" 
      border 
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}">
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo-1)* searchModel.pageSize + scope.$index +1}}
          </template>
        </el-table-column>        
        <el-table-column prop="id" label="记录ID" width=""> </el-table-column>
        <el-table-column prop="time" label="时间" width=""> </el-table-column>
        <el-table-column prop="action" label="行为" width=""></el-table-column>
        <!-- <el-table-column prop="photo" label="抓拍照片">
          <template slot-scope="scope">
            <el-tag 
            :type="scope.row.role === '管理员' ? 'success' : 'info'"
            disable-transitions>{{scope.row.role}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <el-button type="primary" @click="showPhoto(scope.row)" icon="el-icon-picture-outline" size="mini">查看照片</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页组件 -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination> -->

    <!-- 照片展示 -->
    <el-dialog v-dialogDrag @close="resetForm" :title="title" :visible.sync="dialogFormVisible">
      <img :src="photoSource" alt="行为抓拍" style="width: 100%;height: 100%">
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/historyData'
export default {
  data() {
    return {
      actionOptions: [{
        value: '1',
        label: '人数变化'
      }, {
        value: '2',
        label: '使用手机'
      }, {
        value: '3',
        label: '抽烟'
      }, {
        value: '4',
        label: '喝水'
      }],
      dialogFormVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // searchDate: '',
      formLabelWidth: '130px',      
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      dataList: [],
      photoSource: ''
    }
  },
  methods: {
    resetForm() {
      // this.userForm = {}
      // this.$refs.userFormRef.clearValidate()
      // this.$refs.userFormRef.resetFields()
    },
    showPhoto(data) {
      this.title = data.action + ' 详情'
      api.getDataURL(data.id).then(response => {
        this.photoSource = response.src
      })
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getUserList()
    },
    getDataList() {
      api.getDataList(this.searchModel).then(response => {
        // this.dataList = response.data.rows
        let templist = response.data.rows
        templist.forEach((item) => {
          if(item.action==="1") {
            item.action = '人数变化'
          }
          else if(item.action==='2') {
            item.action = '使用手机'
          }
          else if(item.action==='3') {
            item.action = '抽烟'
          }
          else {
            item.action = '喝水'
          }
        });
        this.dataList = templist
        this.total = response.data.total
      })
    }
  },
  created() {
    this.getDataList()
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-input {
  width: 60%;
}
</style>