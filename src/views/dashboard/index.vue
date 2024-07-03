<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>欢迎来到IYing养老系统</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <h2>年龄分布</h2>
              <canvas id="ageDistributionChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col>

          <!-- <el-col :span="12">
            <el-card class="chart-card">
              <h2>性别分布</h2>
              <canvas id="genderDistributionChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col> -->

          <el-col :span="12">
            <el-card class="chart-card">
              <h2>健康状况</h2>
              <canvas id="healthStatusChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/api/eld'
import { Bar, Pie } from 'chart.js';
import 'element-ui/lib/theme-chalk/index.css';
import { Container, Header, Main, Row, Col, Card } from 'element-ui';

export default {
  name: 'App',
  components: {
    [Container.name]: Container,
    [Header.name]: Header,
    [Main.name]: Main,
    [Row.name]: Row,
    [Col.name]: Col,
    [Card.name]: Card,
  },
  data() {
    return {
      userInfo: [],
      form: {
        UserName: '',
        Phone: '',
      },
      total: '',

      ageDistributionData: {
        labels: ['60-70', '70-80', '80-90', '90以上'],
        datasets: [
          {
            label: '人数',
            backgroundColor: '#42A5F5',
            data: [0, 0, 0, 0], // 初始化数据
          },
        ],
      },
      genderDistributionData: {
        labels: ['男', '女'],
        datasets: [
          {
            label: '人数',
            backgroundColor: ['#42A5F5', '#66BB6A'],
            data: [0, 0], // 初始化数据
          },
        ],
      },
      healthStatusData: {
        labels: ['健康', '良好', '一般', '疾病', '严重'],
        datasets: [
          {
            label: '人数',
            backgroundColor: ['#66BB6A', '#FFA726', '#FFEE58', '#FF7043', '#D32F2F'],
            data: [0, 0, 0, 0, 0], // 初始化数据
          },
        ],
      },
    };
  },
  mounted() {
    this.getStaff(); // 获取数据并更新图表
  },
  methods: {
    getStaff() {
      api.getList(this.form).then(response => {
        const res = response;
        if (res.code === 20000) {
          this.$message({
            showClose: true,
            message: '获取成功！',
            type: 'success',
          });

          const userData = res.data.rows.map(record => ({
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
            health: record.Healthy,
          }));
          
          this.userInfo = userData;
          this.total = res.data.total;

          this.updateChartsData(userData); // 更新图表数据

        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });
    },
    updateChartsData(userData) {
      // 年龄分布统计
      const ageGroups = [0, 0, 0, 0];
      userData.forEach(user => {
        if (user.age >= 60 && user.age < 70) ageGroups[0]++;
        else if (user.age >= 70 && user.age < 80) ageGroups[1]++;
        else if (user.age >= 80 && user.age < 90) ageGroups[2]++;
        else if (user.age >= 90) ageGroups[3]++;
      });
      this.ageDistributionData.datasets[0].data = ageGroups;

      // 性别分布统计
      // const genderCounts = [0, 0];
      // userData.forEach(user => {
      //   if (user.sex === 'm') genderCounts[0]++;
      //   else if (user.sex === 'f') genderCounts[1]++;
      // });
      // this.genderDistributionData.datasets[0].data = genderCounts;

      // 健康状况统计
      const healthStatusCounts = [0, 0, 0, 0, 0];
      userData.forEach(user => {
        if (user.health === '健康') healthStatusCounts[0]++;
        else if (user.health === '良好') healthStatusCounts[1]++;
        else if (user.health === '一般') healthStatusCounts[2]++;
        else if (user.health === '疾病') healthStatusCounts[3]++;
        else if (user.health === '严重') healthStatusCounts[4]++;
      });
      this.healthStatusData.datasets[0].data = healthStatusCounts;

      this.createAgeDistributionChart();
      // this.createGenderDistributionChart();
      this.createHealthStatusChart();
    },
    createAgeDistributionChart() {
      new Bar(document.getElementById('ageDistributionChart'), {
        data: this.ageDistributionData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: '老年人年龄分布',
          },
        },
      });
    },
    createGenderDistributionChart() {
      new Bar(document.getElementById('genderDistributionChart'), {
        data: this.genderDistributionData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: '老年人性别分布',
          },
        },
      });
    },
    createHealthStatusChart() {
      new Bar(document.getElementById('healthStatusChart'), {
        data: this.healthStatusData,
        options: {
          responsive: true,
          title: {
            display: true,
            text: '老年人健康状况',
          },
        },
      });
    },
  },
};
</script>

<style>
#app {
  padding: 20px;
}

.chart-card {
  height: 400px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  border: none; /* 确保没有边框 */
}
</style>
