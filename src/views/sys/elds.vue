<template>
  <div>
    <!-- 搜索 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" placeholder="用户名" clearable></el-input>
          <el-input v-model="searchModel.phone" placeholder="手机号" clearable></el-input>
          <el-button @click="getUserList" type="primary" round icon="el-icon-search">老人查询</el-button>
        </el-col>        
        <el-button @click="openEditUI(null)" type="primary" icon="el-icon-plus" round>添加用户</el-button>
        <el-col :span="5"> </el-col>
      </el-row>
    </el-card>
    <el-divider></el-divider>
    <!-- 结果列表 -->
    <el-card>
      <el-table 
      :data="userList" 
      style="width: 100%" 
      border
      :cell-style="{'text-align':'center'}"
      :header-cell-style="{'text-align':'center'}">
        <el-table-column label="序号" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo-1)* searchModel.pageSize + scope.$index +1}}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="UID" width="180"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template slot-scope="scope">
            <el-tag 
            :type="scope.row.role === '管理员' ? 'success' : 'info'"
            disable-transitions>{{scope.row.role}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini">修改用户</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除用户</el-button>
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

    <!-- 用户信息编辑 -->
    <el-dialog @close="resetForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="userForm" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名称" prop='username' :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='phone' :label-width="formLabelWidth">
          <el-input v-model="userForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password' :label-width="formLabelWidth" show-password>
          <el-input v-model="userForm.password"  autocomplete="off" show-password ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" :label-width="formLabelWidth">
          <el-radio v-model="userForm.role" label="0">管理员</el-radio>
          <el-radio v-model="userForm.role" label="1">普通用户</el-radio>
        </el-form-item>
        <!-- 提交和重置按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveUser">提 交</el-button>
          <el-button @click="resetForm('form')">重 置</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import api from '@/api/userManage'
export default {
  data() {
    return {
      formLabelWidth: '130px',
      userForm: {},
      dialogFormVisible: false,
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '请输入6到12位密码',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  methods: {
    deleteUser(user) {
      this.$confirm(`您确认删除用户 ${user.username} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteUserById(user.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getUserList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }) 
    },
    saveUser() {
      // 触发表单验证
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          // 提交请求给后台
          api.saveUser(this.userForm).then(response => {
            // 成功提示
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            // 刷新表格
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.userForm = {}
      this.$refs.userFormRef.clearValidate()
      this.$refs.userFormRef.resetFields()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增用户'
      } else {
        this.title = '修改用户'
        
        // 根据id查询用户数据
        api.getUserById(id).then(response => {
          this.userForm = response.data
        })
      }
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
    getUserList() {
      api.getUserList(this.searchModel).then(response => {
        // this.userList = response.data.rows
        let templist = response.data.rows
        templist.forEach((item) => {
          if(item.role==="0"){
            item.role = '管理员'
          }else{
            item.role = '普通用户'
          }
        });
        this.userList = templist
        this.total = response.data.total
      })
    }
  },
  created() {
    this.getUserList()
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
