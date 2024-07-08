<template>
    <div>
        <!-- 搜索 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <div class="block">
                        <h1>{{ userInfo.UserName }}的开心时刻</h1>

                        <el-divider></el-divider>
                        <!-- 显示图片 -->
                        <div v-if="userInfo.Url">
                            <img :src="userInfo.Url" alt="图片加载失败" style="max-width: 30%;">
                            <img :src="userInfo.ElderlyUrl" alt="图片加载失败" style="max-width: 30%;">
                        </div>
                    </div>
                </el-col>
                <el-col :span="4"> </el-col>
            </el-row>
        </el-card>

        <el-divider></el-divider>

        <el-card>
            <el-descriptions class="margin-top" title="详情信息" :column="3" border>
                <template slot="extra">
                </template>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        老人
                    </template>
                    {{ userInfo.UserName || '待填写' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-date"></i>
                        图片编号
                    </template>
                    {{ userInfo.ElderlyID || '待填写' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-date"></i>
                        抓拍时间
                    </template>
                    {{ formatDate(userInfo.Created) || '待填写' }}
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
                        生日
                    </template>
                    {{ userInfo.Birthday || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        监护人
                    </template>
                    {{ userInfo.GuardianName || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        监护人电话
                    </template>
                    {{ userInfo.GuardianPhone || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        健康状态
                    </template>
                    {{ userInfo.Healthy || '待填写' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-date"></i>
                        创建时间
                    </template>
                    {{ formatDate(userInfo.ElderlyCreated) || '待填写' }}
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

        <el-card class="happiness-record-card chart-container" shadow="never">
            <el-row>
                <el-col :span="24">
                    <h2>高兴记录</h2>
                    <div id="happinessChart" class="chart"></div>
                </el-col>
            </el-row>
        </el-card>

    </div>
</template>



<script>
import * as echarts from 'echarts';
import api from '@/api/historyData'
import { Line } from 'chart.js'

export default {
    data() {
        return {
            happinessData: {
                labels: [],
                datasets: [
                    {
                        label: '高兴次数',
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        data: []
                    }
                ]
            },

            form1: {
                UserName: '',
                Date: '',
            },

            form: {
                ID: '',
            },

            editForm: {
                UserName: '',
                Phone: '',
                Sex: '',
                Age: '',
                Birthday: '',
                Healthy: '',
                GuardianName: '',
                GuardianPhone: '',
                ImgUrl: '',
            },

            userInfo: {
                // ElderlyID: '',
                ElderlyUrl: '',
                ElderlyCreated: '',
                Url: '',
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
                Birthday: '',
                Healthy: '',
                GuardianName: '',
                GuardianPhone: '',
            },

            emotionInfo: [],
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

        getEmotions() {
            api.getList(this.form1).then(response => {
                const res = response;
                if (res.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '获取成功！',
                        type: 'success',
                    });

                    const userData = res.data.rows.map(record => ({
                        name: record.UserName,
                        health: record.Healthy,
                        Created: record.Created,
                    }));

                    this.emotionInfo = userData;
                    this.total = res.data.total; // 更新总记录数

                    this.updateHappinessChart();
                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.error(err);
                this.$message.error('获取失败，请重试');
            });
        },

        updateHappinessChart() {
            const dateCountMap = {};
            this.emotionInfo.forEach(record => {
                const date = record.Created.split('T')[0]; // 只取日期部分
                if (!dateCountMap[date]) {
                    dateCountMap[date] = 0;
                }
                dateCountMap[date]++;
            });
            const labels = Object.keys(dateCountMap).sort(); // 日期排序
            const data = labels.map(date => dateCountMap[date]);

            this.createHappinessChart(labels, data);
        },
        createHappinessChart(labels, data) {
            const chartDom = document.getElementById('happinessChart');
            const myChart = echarts.init(chartDom);
            const option = {
                xAxis: {
                    type: 'category',
                    data: labels,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: data,
                        type: 'line',
                    },
                ],
            };
            myChart.setOption(option);
        },

        getElderly() {
            api.getOne(this.form).then(response => {
                const res = response; // axios 返回的数据在 response 中
                if (res.code === 20000) {
                    // this.$message({
                    //     showClose: true,
                    //     message: '获取成功！',
                    //     type: 'success',
                    // });

                    const record = res.data; // 更新为直接获取 res.data
                    this.userInfo = {
                        ID: record.ID,
                        UserName: record.ElderlyName,
                        Phone: record.Phone,
                        Sex: record.Sex,
                        Age: record.Age,
                        Password: record.Password,
                        IsActive: record.IsActive,
                        Created: record.Created,
                        Updated: record.Updated,
                        Url: record.Url,
                        Birthday: record.Birthday,
                        Healthy: record.Healthy,
                        GuardianName: record.GuardianName,
                        GuardianPhone: record.GuardianPhone,
                        ElderlyUrl: record.ElderlyUrl,
                        ElderlyCreated: record.ElderlyCreated,
                    };

                    this.form1.UserName = record.ElderlyName;
                    this.getEmotions();

                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('获取失败，请重试');
            });
        },


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
            this.getElderly();
        }
    },
}
</script>

<style scoped>
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

#search {
    margin-bottom: 20px;
}

.el-card {
    margin-bottom: 20px;
    padding: 20px;
}

.happiness-record-card {
    height: 300px;
    /* 确保卡片有足够的高度 */
}

.hidden {
    display: none;
}

.chart-container {
    height: 500px;
    /* 修改这个值来设置容器的高度 */
    width: 100%;
}

/* 移除canvas的高度设置 */
canvas#happinessChart {
    width: 100% !important;
    height: auto !important;
    /* 确保canvas高度自动调整 */
}
</style>
