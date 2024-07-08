<template>
  <div class="register-container">
    <article class="header">
      <header>
        <el-avatar icon="el-icon-user-solid" shape="circle" style="margin-left: 10px; margin-top: 10px;" />
        <span class="login">
          <em class="bold" style="margin-left: 980px">已有账号？</em>
          <router-link to="/login">
            <el-button type="primary" size="mini">登录</el-button>
          </router-link>
        </span>
      </header>
    </article>
    <section>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" autocomplete="off" size="medium" class="login-form">
        <el-form-item label="角色" prop="userrole">
          <el-col :span="24">
            <el-radio v-model="ruleForm.userrole" label="2">义工</el-radio>
            <el-radio v-model="ruleForm.userrole" label="1">员工</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item v-if="ruleForm.userrole === '2'" label="上传图片">
          <el-upload class="upload-demo" ref="upload" action="https://example.com/upload" :auto-upload="false"
            :file-list="fileList" :on-change="handleFileChange" :on-remove="handleFileRemove"
            :http-request="handleUploadRequest" accept="image/*">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-col :span="24">
            <el-input v-model="ruleForm.phone" placeholder="请输入您的手机号码" />
            <div class="error">{{ error }}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-col :span="24">
            <el-input v-model="ruleForm.username" placeholder="请输入您的用户名" />
          </el-col>
        </el-form-item>
        <el-form-item label="年龄" prop="userage">
          <el-col :span="24">
            <el-input v-model="ruleForm.userage" placeholder="请输入16-60的数字" />
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="usersex">
          <el-col :span="24">
            <el-radio v-model="ruleForm.usersex" label="f">女</el-radio>
            <el-radio v-model="ruleForm.usersex" label="m">男</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-col :span="24">
            <el-input v-model="ruleForm.pwd" type="password" placeholder="请输入密码" />
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-col :span="24">
            <el-input v-model="ruleForm.cpwd" type="password" placeholder="请再次输入密码" />
          </el-col>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <br>
          <el-col :span="20">
            <el-input v-model="ruleForm.code" maxlength="4" placeholder="请输入验证码" />
          </el-col>
          <el-col :span="4">
            <div width="100%" @click="refreshCode">
              <s-identify :identifyCode="identifyCode" style="margin-left: 5px"></s-identify>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </section>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
import api from '@/api/register'
import SIdentify from './verify.vue'

export default {
  name: 'register',
  components: { SIdentify },
  data() {
    return {
      videoFile: null,
      fileList: [],
      statusMsg: '',
      error: '',
      ruleForm: {
        userage: '',
        userrole: '',
        usersex: '',
        username: '',
        phone: '',
        code: '',
        pwd: '',
        cpwd: '',
        yun_url: '',
      },
      identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
      identifyCode: '',
      rules: {
        userrole: [{
          required: true,
          type: 'string',
          message: '请选择身份',
          trigger: 'blur'
        }],
        usersex: [{
          required: true,
          type: 'string',
          message: '请选择性别',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          type: 'string',
          message: '请输入用户名',
          trigger: 'blur'
        }],
        phone: [
          {
            required: true,
            type: 'string',
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ],
        userage: [
          {
            required: true,
            // type: 'string',
            message: '请输入年龄',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入年龄'));
              } else if (!/^(?:1[6-9]|[2-5][0-9]|60)$/.test(value)) {
                callback(new Error('年龄必须在16到60岁之间'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        code: [{
          required: true,
          type: 'string',
          message: '请输入验证码',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码必须同时包含数字与字母,且长度为 8-20位' }],
        cpwd: [{
          required: true,
          message: '请再次输入相同密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      this.videoFile = file.raw;
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList;
      if (fileList.length === 0) {
        this.videoFile = null;
      }
    },
    handleUploadRequest({ file }) {
      this.videoFile = file;
    },
    submitUpload() {
      if (!this.videoFile) {
        alert('请选择图片文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.videoFile);

      console.log('Form Data:', formData);

      api.uploadCloud(formData).then(response => {
        const res = response; // axios 返回的数据在 response 中
        if (res.code === 20000) {
          this.$message({
            showClose: true,
            message: '上传成功！',
            type: 'success',
          });
          this.ruleForm.yun_url = res.data; // 存储图片 URL
          console.log(this.ruleForm.yun_url);

        } else {
          this.$message.error('上传失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('上传失败，请重试');
      });
    },

    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    register() {
      // Convert userage to a number
      this.ruleForm.userage = parseInt(this.ruleForm.userage);

      if (this.ruleForm.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
        this.$message.error('请填写正确验证码')
        this.refreshCode()
        return
      }

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.ruleForm.userrole === '2' && !this.ruleForm.yun_url) {
            this.$message.error('请上传照片');
            return;
          }

          const user = {
            UserRole: this.ruleForm.userrole,
            UserSex: this.ruleForm.usersex,
            UserName: this.ruleForm.username,
            UserAge: this.ruleForm.userage,
            UserPhone: this.ruleForm.phone,
            UserPwd: this.ruleForm.pwd,
            YunURL: this.ruleForm.yun_url,
          }

          api.register(user).then(res => {
            this.$message({
              showClose: true,
              message: '注册成功，正在跳转到登录界面...',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push('/login')
            }, 2000)
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url('../../assets/elds3.jpg');
  background-size: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.login {
  display: flex;
  align-items: center;
}

.login-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #889aa4;
  border-radius: 16px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-col {
  display: flex;
  align-items: center;
}

.upload-demo .el-upload__input {
  display: none;
}

.code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
