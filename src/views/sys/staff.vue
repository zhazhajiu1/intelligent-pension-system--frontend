<template>
  <div>
    <!-- 搜索 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <div class="block">

            <!-- <span class="demonstration">选择要查看的日期：</span>
            <el-date-picker
              v-model="searchModel.date"
              align="right"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker> -->

            <!-- <el-select v-model="searchModel.action" clearable placeholder="请选择要查询的行为">
              <el-option
                v-for="item in actionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-button type="primary" round icon="el-icon-search" @click="getStaff">管理员查询</el-button>
          </div>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>
    <!-- 结果列表 -->
    <el-card>
      <el-table :data="tableData" border style="width: 90%">
        <el-table-column fixed prop="id" label="id" width="50"></el-table-column>
        <el-table-column prop="name" label="name" width="200"></el-table-column>
        <el-table-column prop="sex" label="sex" width="300"></el-table-column>
        <el-table-column prop="age" label="age" width="100"></el-table-column>
        <el-table-column prop="phone" label="phone" width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row.url)" type="text" size="small">查看</el-button>
            <el-button @click="openEditForm(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteMovie(scope.row.id)" type="text" size="small" style="color: red;">删除</el-button>
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

    <!-- <el-dialog v-dialogDrag :title="title" :visible.sync="dialogFormVisible" @close="resetForm">
      <div id="app">
        <div class="player-container">
          <video :src="videoSource" ref="video" controls></video>
        </div>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import api from '@/api/staff'
export default {
  data() {
    return {
      form: {
        UserName: '',
        Phone: '',
      },
      id: '',
      sex: '',
      age: '',
      token: '',
      tableData: [],
      pageSize: 5,
      currentPage: 1,
      total: 0,

      videoSource: ''
    }
  },

  methods: {

    getStaff() {
      api.getList(this.form).then(response => {
        const res = response; // axios 返回的数据在 response 中
        if (res.code === 20000) {
          this.$message({
            showClose: true,
            message: '获取成功！',
            type: 'success',
          });

          const records = res.data.rows;
          this.tableData = records.map(record => ({
            id: record.ID,
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
            phone: record.Phone,
          }));

          this.total = res.data.total; // 更新总记录数

        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });

    },

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

  },

  mounted() {
    this.token = localStorage.getItem('token') || '';
    console.log('Retrieved token:', this.token);

    if (!this.token) {
      console.error('TOKEN is not found in localStorage');
    } else {
      this.getStaff(null);

      // this.$nextTick(() => {
      //   this.getStaff();
      // });
    }
  },

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
