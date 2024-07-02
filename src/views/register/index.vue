<template>
  <div class="register-container">
    <article class="header">
      <header>
        <el-avatar icon="el-icon-user-solid" shape="circle" />
        <span class="login">
          <em class="bold">已有账号？</em>
          <router-link to="/login">
            <el-button type="primary" size="mini">登录</el-button>
          </router-link>
        </span>
      </header>
    </article>
    <section>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" autocomplete="off" size="medium"
        style="position: relative; top:50px; left: 500px;">
        <div style="padding-top: 10px">
          <el-form-item label="角色" prop="userrole">
            <el-col :span="5">
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
            <el-col :span="5">
              <el-input v-model="ruleForm.phone" placeholder="请输入您的手机号码" />
            </el-col>
            <el-col :span="5">
              <div class="error">{{ error }}</div>
            </el-col>
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-col :span="5">
              <el-input v-model="ruleForm.username" placeholder="请输入您的用户名" />
            </el-col>
          </el-form-item>

          <el-form-item label="年龄" prop="userage">
            <el-col :span="5">
              <el-input v-model="ruleForm.userage" placeholder="请输入您的年龄" />
            </el-col>
          </el-form-item>

          <el-form-item label="性别" prop="usersex">
            <el-col :span="5">
              <el-radio v-model="ruleForm.usersex" label="f">女</el-radio>
              <el-radio v-model="ruleForm.usersex" label="m">男</el-radio>
            </el-col>
          </el-form-item>

          <el-form-item label="密码" prop="pwd">
            <el-col :span="5">
              <el-input v-model="ruleForm.pwd" type="password" />
            </el-col>
          </el-form-item>

          <el-form-item label="确认密码" prop="cpwd">
            <el-col :span="5">
              <el-input v-model="ruleForm.cpwd" type="password" />
            </el-col>
          </el-form-item>

          <el-form-item label="验证码" prop="code">
            <el-col :span="5">
              <el-input v-model="ruleForm.code" maxlength="4" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="5">
              <div width="100%" @click="refreshCode">
                <s-identify :identifyCode="identifyCode" style="margin-top: 4px"></s-identify>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 20%" @click="register">注册</el-button>
          </el-form-item>
        </div>
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
            UserName: this.ruleForm.username,
            Password: this.ruleForm.pwd,
            Sex: this.ruleForm.usersex,
            Phone: this.ruleForm.phone,
            ImgUrl: this.ruleForm.yun_url,
            Age: this.ruleForm.userage,
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

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 95%;

    input {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    label {
      font-style: normal;
      font-size: 12px;
      color: $light_gray;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  background-image: url('../../assets/elds3.jpg');
  background-size: 100%;

  .header {
    border-bottom: 2px solid rgb(235, 232, 232);
    min-width: 980px;
    color: #666;

    header {
      margin: 0 auto;
      padding: 10px 0;
      width: 980px;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
        color: $light_gray;
      }
    }
  }

  .section {
    margin: 0 auto 30px;
    padding-top: 30px;
    width: 980px;
    min-height: 300px;
    padding-right: 100px;
    box-sizing: border-box;

    .status {
      font-size: 12px;
      margin-left: 20px;
      color: #e6a23c;
    }

    .error {
      color: red;
    }
  }

  .tips {
    float: right;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>
