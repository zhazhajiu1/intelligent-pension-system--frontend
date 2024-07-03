<template>
  <div>
    <!-- 搜索 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <div class="block">

            <el-input v-model="form.UserName" placeholder="请输入姓名"></el-input>
            <el-input v-model="form.Phone" placeholder="请输入电话号码"></el-input>

            <el-button type="primary" round icon="el-icon-search" @click="getStaff()">查询</el-button>
            <el-button type="primary" round icon="el-icon-search" @click="addStaff()">新增</el-button>

          </div>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>
    <!-- 结果列表 -->
    <el-card>
      <el-table :data="pagedTableData" border style="width: 95%">
        <el-table-column fixed prop="id" label="序号" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="150" :formatter="formatSex"></el-table-column>
        <el-table-column prop="age" label="年龄" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="350"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="viewDetail(scope.row.id)" type="text" size="small">查看</el-button>
            <!-- <el-button @click="openEditForm(scope.row)" type="text" size="small">编辑</el-button> -->
            <el-button @click="deleteStaff(scope.row.id)" type="text" size="small" style="color: red;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :visible.sync="editDialogVisible" title="编辑信息">
      <el-form ref="editForm" :model="editForm" label-width="150px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.UserName" required></el-input>
        </el-form-item>

        <el-form-item label="电话号码">
          <el-input v-model="editForm.Phone" required></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.Sex" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editForm.Age" required></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.Password" required></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否启用">
          <el-switch v-model="editForm.IsActive" active-value="0" inactive-value="1" active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="handleSubmit()">提交</el-button>
          <el-button @click="onEditCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/staff'
export default {
  data() {
    return {
      sexOptions: [{
        value: 'f',
        label: '女'
      }, {
        value: 'm',
        label: '男'
      }],
      form: {
        UserName: '',
        Phone: '',
      },
      editForm: {
        UserName: '',
        Phone: '',
        Sex: '',
        Age: '',
        Password: '',
      },

      editDialogVisible: false,
      id: '',
      sex: '',
      age: '',
      token: '',
      tableData: [],
      pagedTableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,

      videoSource: '',
      id_delete: {
        ID: '',
      },
    }
  },

  methods: {

    validateForm() {
      // 检查 editForm 中的每个值是否为空
      return Object.values(this.editForm).every(value => value !== '');
    },

    handleSubmit() {
      if (this.validateForm()) {
        api.employeeAdd(this.editForm).then(response => {
          const res = response; // axios 返回的数据在 response 中
          if (res.code === 20000) {
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success',
            });

            this.editDialogVisible = false;
            this.getStaff();
          } else {
            this.$message.error('添加失败，请重试');
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('添加失败，请重试');
        });
      } else {
        this.$message.error('请填写完整的信息');
      }
    },

    formatSex(row, column, cellValue) {
      return cellValue === 'f' ? '女' : cellValue === 'm' ? '男' : cellValue;
    },

    addStaff() {
      this.editDialogVisible = true;
    },

    onEditCancel() {
      this.editDialogVisible = false;
      this.editForm = {
        UserName: '',
        Phone: '',
        Sex: '',
        Age: '',
        Password: '',
      };
    },

    getStaff() {
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
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
            phone: record.Phone,
          }));

          this.total = res.data.total; // 更新总记录数
          this.currentPage = 1; // 回到第一页
          this.paginateData(); // 分页显示数据


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
    // resetForm() {

    // },

    viewDetail(id) {
      this.$router.push({ path: `/sys/staffDetail/${id}` });
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
