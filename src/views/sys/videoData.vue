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
            <el-button type="primary" round icon="el-icon-search" @click="getVideoList">查询</el-button>
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
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-picture-outline" size="mini" @click="showVideo(scope.row)">查看视频</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteVideo(scope.row.id)">删除记录</el-button>
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
    <!-- 视频展示 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" @close="resetForm">
      <div id="app">
        <div class="player-container">
          <!-- <vue-core-video-player  :src="videoSource" :cover="cover" :title= "title"  autoplay loop="true"/> -->
          <video :src="videoSource" ref="video" controls></video>
        </div>
      </div>
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
      dialogFormVisible: false,
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      dataList: [],
      videoSource: ''
    }
  },
  methods: {
    deleteVideo(id) {
      this.$confirm(`您确定删除第${id}号记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteVideoById(id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getVideoList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }) 
    },
    resetForm() {
      
    },
    showVideo(data) {
      this.title = data.action + ' 详情'
      api.getVideoURL(data.id).then(response => {
        this.videoSource = response.src
        console.log(this.videoSource)
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
    getVideoList() {
      api.getVideoList(this.searchModel).then(response => {
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
    this.getVideoList()
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
