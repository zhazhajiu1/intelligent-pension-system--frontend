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

        <el-card>
            <el-descriptions class="margin-top" title="用户信息" :column="3" :size="size" border>
                <template slot="extra">
                    <el-button type="primary" size="small" @click="updateStaff()">操作</el-button>
                </template>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                    </template>
                    {{ userInfo.UserName || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        编号
                    </template>
                    {{ userInfo.ID || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-success"></i>
                        状态
                    </template>
                    <el-tag type="success">{{ userInfo.IsActive === '0' ? '已启用' : '未启用' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-date"></i>
                        年龄
                    </template>
                    {{ userInfo.Age || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        性别
                    </template>
                    {{ userInfo.Sex === 'f' ? '女' : userInfo.Sex === 'm' ? '男' : '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        手机号
                    </template>
                    {{ userInfo.Phone || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-lock"></i>
                        密码
                    </template>
                    {{ userInfo.Password || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-date"></i>
                        创建时间
                    </template>
                    {{ formatDate(userInfo.Created) || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-refresh"></i>
                        更新时间
                    </template>
                    {{ formatDate(userInfo.Updated) || '待填写' }}
                </el-descriptions-item>
            </el-descriptions>

            <br><br>   
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
import api from '@/api/staff'
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

        getStaff() {
            api.getOne(this.form).then(response => {
                const res = response; // axios 返回的数据在 response 中
                if (res.code === 20000) {
                    // this.$message({
                    //     showClose: true,
                    //     message: '获取成功1！',
                    //     type: 'success',
                    // });

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