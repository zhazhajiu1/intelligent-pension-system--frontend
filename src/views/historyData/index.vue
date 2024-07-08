<template>
  <div>
    <!-- 搜索 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <div class="block">
            <el-input v-model="form.UserName" placeholder="请输入老人姓名"></el-input>

            <el-date-picker v-model="form.Date" type="date" placeholder="选择日期" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" required>
            </el-date-picker>

            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

            <el-button type="primary" round icon="el-icon-search" @click="getEmotions()">查询</el-button>
          </div>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="pagedTableData" border style="width: 95%">
        <el-table-column fixed prop="id" label="序号" width="100"></el-table-column>
        <el-table-column prop="ElderlyName" label="老人姓名" width="150"></el-table-column>
        <el-table-column prop="Created" label="抓拍时间" width="250"></el-table-column>
        <el-table-column prop="ImgUrl" label="图片" width="550"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button @click="deleteStaff(scope.row.id)" type="text" size="small" style="color: red;"
              :disabled="role !== '0'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import api from '@/api/historyData'

export default {
  data() {
    return {
      options: [{
        value: 'happy',
        label: '开心'
      }, {
        value: 'surprised',
        label: '惊吓'
      }],
      value: '',

      id_delete: {
        ID: '',
      },
      form: {
        UserName: '',
        Date: '',
      },
      tableData: [],
      pagedTableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      token: '',
      role: '',
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    getEmotions() {
      const params = {
        ...this.form,
      };

      api.getList(params).then(response => {
        const res = response;
        if (res.code === 20000) {
          // this.$message({
          //   showClose: true,
          //   message: '获取成功！',
          //   type: 'success',
          // });

          this.tableData = res.data.rows.map(record => ({
            id: record.ID,
            ElderlyName: record.ElderlyName,
            Created: this.formatDate(record.Created),
            ImgUrl: record.Url,
          }));

          this.total = res.data.total; // 更新总记录数
          this.currentPage = 1; // 回到第一页
          this.paginateData(); // 分页显示数据

        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('获取失败，请重试');
      });
    },

    deleteStaff(id) {

      this.id_delete.ID = id;

      this.$confirm(`您确定删除第${id}号记录吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        api.emotionDelete(this.id_delete).then(response => {
          const res = response; // axios 返回的数据在 response 中
          if (res.code === 20000) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success',
            });

            this.getEmotions(null);

          } else {
            this.$message.error('删除失败，请重试');
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('删除失败，请重试');
        });

      })
    },

    viewDetail(id) {
      this.$router.push({ path: `/historyData/emotionDetail/${id}` });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.paginateData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.paginateData();
    },

    paginateData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.pagedTableData = this.tableData.slice(startIndex, startIndex + this.pageSize);
    },
  },

  mounted() {
    this.token = localStorage.getItem('token') || '';
    this.role = localStorage.getItem('roles') || '';
    console.log('role:', this.role);

    if (!this.token) {
      console.error('TOKEN is not found in localStorage');
    } else {
      this.getEmotions();
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