<template>
  <div class="userInfo-container">    
    <el-divider></el-divider>
    <div style="font-size: 40px; position: relative; left: 150px;">个人信息概览</div>
    <el-divider></el-divider>
    <el-card>
      <el-form 
      :model="userForm" 
      ref="userFormRef" 
      :rules="rules"
      >
        <el-form-item label="UID" prop='id' :label-width="formLabelWidth">
          <el-input v-model="userForm.id" autocomplete="off" style="width: 25%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop='username' :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off" style="width: 25%" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='phone' :label-width="formLabelWidth">
          <el-input v-model="userForm.phone" autocomplete="off" style="width: 25%" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop='password' :label-width="formLabelWidth" show-password>
          <el-input v-model="userForm.password"  autocomplete="off" show-password style="width: 25%" :disabled="edit"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" :label-width="formLabelWidth">
          <el-radio v-model="userForm.role" label="0" :disabled="true">管理员</el-radio>
          <el-radio v-model="userForm.role" label="1" :disabled="true">普通用户</el-radio>
        </el-form-item>
        <!-- 提交和重置按钮 -->
        <el-form-item style="position: relative; left: 100px;">
          <el-button type="primary" @click="update" :disabled="!edit">修改个人信息</el-button>
          <el-button type="danger" @click="save" :disabled="edit">保存修改</el-button>
          <el-button type="success" @click="cancel" :disabled="edit">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/api/userManage'
import { mapGetters } from 'vuex'
export default {
  name: 'userInfo',
  computed: {
    ...mapGetters({
      id: 'id',
      name: 'name'
    })
  },
  data() {
    return {
      edit: true,
      formLabelWidth: '130px',
      userForm: {},
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
    getInfo() {
      api.getUserById(this.id).then(response => {
        this.userForm = response.data
      })
    },
    update() {
      this.edit = false
    },
    save() {
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
            this.edit = true
            // 刷新表格
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$message({
        message: '取消修改成功',
        type: 'success'
      })
      this.getInfo()
      this.edit = true
    }
  },
  created() {
    this.getInfo()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
