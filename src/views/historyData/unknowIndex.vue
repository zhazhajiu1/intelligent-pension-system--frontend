<template>
    <div>
      <!-- 搜索 -->
      <el-card id="search">
        <el-row>
          <el-col :span="20">
            <div class="block">
  
              <el-input v-model="form.Date" placeholder="请输入日期"></el-input>
  
              <el-button type="primary" round icon="el-icon-search" @click="getStaff()">查询</el-button>
            </div>
          </el-col>
          <el-col :span="4"> </el-col>
        </el-row>
      </el-card>
  
      <el-divider></el-divider>
      <!-- 结果列表 -->
      <el-card>
        <el-table :data="tableData" border style="width: 95%">
          <el-table-column fixed prop="id" label="序号" width="150"></el-table-column>
          <el-table-column prop="ImgUrl" label="图片" width="500"></el-table-column>
          <el-table-column prop="Created" label="抓拍时间" width="350"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="viewDetail(scope.row.id)" type="text" size="small">查看</el-button>
              <el-button @click="deleteStaff(scope.row.id)" type="text" size="small" style="color: red;">删除</el-button>
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
  
    </div>
  </template>
  
  <script>
  import api from '@/api/historyData'
  export default {
    data() {
      return {
        form: {
          Date: '',
        },
        editForm: {
          UserName: '',
          Phone: '',
          Sex: '',
          Age: '',
          Password: '',
        },
  
        id: '',
        sex: '',
        age: '',
        token: '',
        tableData: [],
        pageSize: 5,
        currentPage: 1,
        total: 0,
  
        videoSource: '',
        id_delete: {
          ID: '',
        },
      }
    },
  
    methods: {
  
      getStaff() {
        api.getFall(this.form).then(response => {
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
              ElderlyID: record.ElderlyID,
              ElderlyName: record.ElderlyName,
              ImgUrl: record.ImgUrl,
              Created: record.Created,
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
  
      deleteStaff(id) {
  
        this.id_delete.ID = id;
  
        this.$confirm(`您确定删除第${id}号记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
  
          api.deleteVideoById(this.id_delete).then(response => {
            const res = response; // axios 返回的数据在 response 中
            if (res.code === 20000) {
              this.$message({
                showClose: true,
                message: '删除成功！',
                type: 'success',
              });
  
              this.getStaff(null);
  
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
      }
    },
  
    mounted() {
      this.token = localStorage.getItem('token') || '';
      console.log('Retrieved token:', this.token);
  
      if (!this.token) {
        console.error('TOKEN is not found in localStorage');
      } else {
        this.getStaff(null);
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
  