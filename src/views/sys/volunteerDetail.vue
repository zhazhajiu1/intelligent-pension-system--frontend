<template>
    <div>
        <!-- 搜索 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <div class="block">
                        <h1>{{ userInfo.UserName }}的详情信息</h1>
                        <!-- 显示图片 -->
                        <el-card v-if="userInfo.ImgUrl">
                            <img :src="userInfo.ImgUrl" alt="图片加载失败" style="max-width: 100%;">
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="4"> </el-col>
            </el-row>
        </el-card>

        <el-divider></el-divider>

        <el-card>
            <el-descriptions title="用户信息" :column="3">
                <!-- 第一行 -->
                <el-row>
                    <el-descriptions-item label="用户名" :span="1">用户名: {{ userInfo.UserName }} </el-descriptions-item>
                    <el-descriptions-item label="编号" :span="1">编号: {{ userInfo.ID }} </el-descriptions-item>
                    <el-descriptions-item label="状态" :span="1">
                        <el-tag type="success">{{ userInfo.IsActive }}</el-tag>
                    </el-descriptions-item>
                </el-row>

                <el-row>
                    <!-- 第二行 -->
                    <el-descriptions-item label="年龄" :span="1">年龄: {{ userInfo.Age }} </el-descriptions-item>
                    <el-descriptions-item label="性别" :span="2">性别: {{ userInfo.Sex }}</el-descriptions-item>
                </el-row>

                <el-row>
                    <!-- 第三行 -->
                    <el-descriptions-item label="手机号" :span="1">手机号: {{ userInfo.Phone }} </el-descriptions-item>
                    <el-descriptions-item label="密码" :span="2">密码: {{ userInfo.Password }}</el-descriptions-item>
                </el-row>

                <el-row>
                    <!-- 第四行 -->
                    <el-descriptions-item label="创建时间" :span="3">创建时间: {{ userInfo.Created }}</el-descriptions-item>
                </el-row>
                <el-row>
                    <!-- 第五行 -->
                    <el-descriptions-item label="更新时间" :span="3">更新时间: {{ userInfo.Updated }}</el-descriptions-item>
                </el-row>
            </el-descriptions>

            <br>
            <hr><br>

            <el-button type="primary" round icon="el-icon-edit" @click="updateStaff()">修改信息</el-button>
        </el-card>

        <el-dialog :visible.sync="editDialogVisible" title="编辑信息">
            <el-form ref="editForm" :model="editForm" label-width="150px">
                <el-form-item label="姓名">
                    <el-input v-model="editForm.UserName" required></el-input>
                </el-form-item>

                <el-form-item label="电话号码">
                    <el-input v-model="editForm.Phone" required></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="editForm.Sex" required></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="editForm.Age" required></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="editForm.Password" required></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-input v-model="editForm.IsActive" required></el-input>
                </el-form-item>


                <el-form-item label="上传图片">
                    <el-upload class="upload-demo" ref="upload" action="https://example.com/upload" :auto-upload="false"
                        :file-list="fileList" :on-change="handleFileChange" :on-remove="handleFileRemove"
                        :http-request="handleUploadRequest" accept="image/*">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success"
                            @click="submitUpload">上传到服务器</el-button>
                    </el-upload>
                </el-form-item>



                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交修改</el-button>
                    <el-button @click="onEditCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/volunteer'
export default {
    data() {
        return {
            form: {
                ID: '',
            },
            editForm: {
                ID: '',
                UserName: '',
                Phone: '',
                Sex: '',
                Age: '',
                Password: '',
                IsActive: '',
                Created: '',
                Updated: '',
                ImgUrl: '',
            },
            userInfo: {
                ID: '',
                UserName: '',
                Phone: '',
                Sex: '',
                Age: '',
                Password: '',
                IsActive: '',
                Created: '',
                Updated: '',
                ImgUrl: '',
            },
            fileList: [],
            editDialogVisible: false,
            tableData: [],
            token: '',
            pageSize: 5,
            currentPage: 1,
            total: 0,
        }
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
                    this.editForm.ImgUrl = res.data; // 存储图片 URL
                    console.log(this.editForm.ImgUrl);

                } else {
                    this.$message.error('上传失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('上传失败，请重试');
            });
        },

        getStaff() {
            api.getOne(this.form).then(response => {
                const res = response; // axios 返回的数据在 response 中
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '获取成功！',
                        type: 'success',
                    });

                    const record = res.data; // 更新为直接获取 res.data
                    this.userInfo = {
                        ID: record.ID,
                        UserName: record.UserName,
                        Phone: record.Phone,
                        Sex: record.Sex,
                        Age: record.Age,
                        Password: record.Password,
                        IsActive: record.IsActive,
                        Created: record.Created,
                        Updated: record.Updated,
                        ImgUrl: record.ImgUrl,
                    };
                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('获取失败，请重试');
            });
        },
        updateStaff() {
            this.editForm = { ...this.userInfo };
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
                IsActive: '',
            };
        },
        handleSubmit() {
            this.editForm.ID = this.userInfo.ID;

            api.employeeUpdate(this.editForm).then(response => {
                const res = response; // axios 返回的数据在 response 中
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '更新成功！',
                        type: 'success',
                    });

                    this.editDialogVisible = false;
                    this.getStaff();
                } else {
                    this.$message.error('更新失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('更新失败，请重试');
            });
        }
    },
    mounted() {
        this.token = localStorage.getItem('token') || '';
        console.log('Retrieved token:', this.token);

        this.form.ID = this.$route.params.id;
        console.log("ID", this.$route.params.id);

        console.log("ID", this.form.ID);

        if (!this.token) {
            console.error('TOKEN is not found in localStorage');
        } else {
            this.getStaff();
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

.el-descriptions__label {
    font-weight: bold;
}

.el-descriptions-item__content {
    padding: 0 10px;
}
</style>