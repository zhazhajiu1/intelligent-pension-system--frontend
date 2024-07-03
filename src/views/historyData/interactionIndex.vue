<template>
    <div>
        <!-- 搜索 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <div class="block">
                        <el-input v-model="form.ElderlyName" placeholder="请输入老人姓名"></el-input>
                        <el-input v-model="form.VolunteerName" placeholder="请输入义工姓名"></el-input>
                        <el-date-picker v-model="form.Date" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" required>
                        </el-date-picker>
                        <el-button type="primary" round icon="el-icon-search" @click="getStaff()">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="4"> </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="pagedTableData" border style="width: 95%">
                <el-table-column fixed prop="id" label="序号" width="150"></el-table-column>
                <el-table-column prop="Created" label="抓拍时间" width="250"></el-table-column>
                <el-table-column prop="ImgUrl" label="图片" width="550"></el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="getDetail(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-button @click="deleteStaff(scope.row.id)" type="text" size="small"
                            style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 详情对话框 -->
        <el-dialog :visible.sync="viewDialogVisible" title="交互记录详情" width="800px" height="600px">
            <el-form :model="interactionInfo" label-width="120px" class="detailed-form">
                <el-form-item label="老人姓名">
                    <span>{{ interactionInfo.ElderlyName }}</span>
                </el-form-item>
                <el-form-item label="义工姓名">
                    <span>{{ interactionInfo.VolunteerName }}</span>
                </el-form-item>
                <el-form-item label="交互记录">
                    <img :src="interactionInfo.Url" alt="交互记录" class="detail-image">
                </el-form-item>
                <el-form-item label="抓拍时间">
                    <span>{{ interactionInfo.Created }}</span>
                </el-form-item>

                <!-- <el-form-item label="健康状态">
                    <span>{{ interactionInfo.Healthy }}</span>
                </el-form-item>
                <el-form-item label="老人电话">
                    <span>{{ interactionInfo.ElderlyPhone }}</span>
                </el-form-item> -->
                <el-form-item label="老人照片">
                    <img :src="interactionInfo.ElderlyUrl" alt="老人照片" class="detail-image">
                </el-form-item>
                <el-form-item label="义工照片">
                    <img :src="interactionInfo.VolunteerUrl" alt="义工照片" class="detail-image">
                </el-form-item>
                <el-form-item label="义工电话">
                    <span>{{ interactionInfo.VolunteerPhone }}</span>
                </el-form-item>
                <!-- <el-form-item label="监护人姓名">
                    <span>{{ interactionInfo.GuardianName }}</span>
                </el-form-item> -->
                <!-- <el-form-item label="监护人电话">
                    <span>{{ interactionInfo.GuardianPhone }}</span>
                </el-form-item> -->
            </el-form>
        </el-dialog>

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
            form: {
                Date: '',
                ElderlyName: '',
                VolunteerName: '',
            },

            id_form: {
                ID: '',
            },

            interactionInfo: {
                ElderlyName: '',
                VolunteerName: '',
                Created: '',
                Healthy: '',
                ElderlyPhone: '',
                ElderlyUrl: '',
                VolunteerPhone: '',
                VolunteerUrl: '',
                GuardianName: '',
                GuardianPhone: '',
            },
            tableData: [],
            pagedTableData: [],
            pageSize: 5,
            currentPage: 1,
            total: 0,
            viewDialogVisible: false,
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
            const params = {
                ...this.form,
            };

            api.getReactionList(params).then(response => {
                const res = response;
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '获取成功！',
                        type: 'success',
                    });

                    this.tableData = res.data.rows.map(record => ({
                        id: record.ID,
                        ElderlyName: record.ElderlyName,
                        Created: this.formatDate(record.Created),
                        ImgUrl: record.Url,
                    }));

                    this.total = res.data.total;
                    this.currentPage = 1;
                    this.paginateData();
                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('获取失败，请重试');
            });
        },

        getDetail(id) {

            this.id_form.ID = id;
            api.getReactionDetailByID(this.id_form).then(response => {
                const res = response;
                if (res.code === 20000) {
                    // this.$message({
                    //     showClose: true,
                    //     message: '获取成功！',
                    //     type: 'success',
                    // });

                    const record = res.data;
                    this.interactionInfo = {
                        ElderlyName: record.ElderlyName,
                        VolunteerName: record.VolunteerName,
                        Url: record.Url,
                        Created: this.formatDate(record.Created),
                        Healthy: record.Healthy,
                        ElderlyPhone: record.ElderlyPhone,
                        ElderlyUrl: record.ElderlyUrl,
                        VolunteerPhone: record.VolunteerPhone,
                        VolunteerUrl: record.VolunteerUrl,
                        GuardianName: record.GuardianName,
                        GuardianPhone: record.GuardianPhone,
                    };

                    this.viewDialogVisible = true; // 显示详情对话框
                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('获取失败，请重试');
            });
        },

        deleteStaff(id) {

            this.id_form.ID = id;

            this.$confirm(`您确定删除第${id}号记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.reactionDelete(this.id_form).then(response => {
                    const res = response;
                    if (res.code === 20000) {
                        this.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success',
                        });

                        this.getStaff();
                    } else {
                        this.$message.error('删除失败，请重试');
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error('删除失败，请重试');
                });
            });
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
        if (!this.token) {
            console.error('TOKEN is not found in localStorage');
        } else {
            this.getStaff();
        }
    },
}
</script>

<style>
/* 调整弹窗高度 */
.el-dialog {
    height: 800px;
}

/* 给弹窗内的表格框添加线条 */
.detailed-form .el-form-item {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
}

#search .el-input {
    width: 200px;
    margin-right: 10px;
}

.el-dialog .el-input {
    width: 60%;
}

.detail-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
}
</style>
