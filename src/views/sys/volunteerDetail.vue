<template>
    <div>
        <!-- 搜索 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <div class="block">
                        <h1>{{ userInfo.UserName }}的详情信息</h1>
                    </div>
                </el-col>
                <el-col :span="4"> </el-col>
            </el-row>
        </el-card>

        <el-divider></el-divider>
        <!-- 结果列表 -->
        <!-- <el-card>
            <el-table :data="tableData" border style="width: 90%">
                <el-table-column fixed prop="id" label="id" width="50"></el-table-column>
                <el-table-column prop="name" label="name" width="100"></el-table-column>
                <el-table-column prop="sex" label="sex" width="100"></el-table-column>
                <el-table-column prop="age" label="age" width="100"></el-table-column>
                <el-table-column prop="phone" label="phone" width="300"></el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="viewDetail(scope.row.name)" type="text" size="small">查看</el-button>
                        <el-button @click="deleteStaff(scope.row.id)" type="text" size="small"
                            style="color: red;">删除</el-button>
                    </template>
</el-table-column>
</el-table>
</el-card> -->

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

            <el-button type="primary" round icon="el-icon-search" @click="updateStaff()">修改信息</el-button>
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
            },
            tableData: [],
            token: '',
            pageSize: 5,
            currentPage: 1,
            total: 0,
        }
    },
    methods: {
        getStaff() {
            api.getOne(this.form).then(response => {
                const res = response; // axios 返回的数据在 response 中
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '获取成功1！',
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
                    };

                    // 如果还需要更新表格数据
                    this.tableData = [{
                        id: record.ID,
                        name: record.UserName,
                        sex: record.Sex,
                        age: record.Age,
                        phone: record.Phone,
                    }];

                    this.total = 1; // 设置总记录数为1
                } else {
                    this.$message.error('获取失败，请重试2');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('获取失败，请重试3');
            });
        },

        updateStaff() {
            this.editForm.UserName = this.userInfo.UserName;
            this.editForm.Phone = this.userInfo.Phone;
            this.editForm.Sex = this.userInfo.Sex;
            this.editForm.Age = this.userInfo.Age;
            this.editForm.Password = this.userInfo.Password;
            this.editForm.IsActive = this.userInfo.IsActive;

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