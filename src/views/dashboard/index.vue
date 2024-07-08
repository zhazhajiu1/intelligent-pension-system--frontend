<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>欢迎来到I❤Ying养老系统！</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <h2>老人统计</h2>
              <canvas id="elderAgeDistributionChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="chart-card">
              <h2>健康状况</h2>
              <div id="healthStatusChart" class="chart-canvas"></div>
            </el-card>
          </el-col>
        </el-row>

        <br>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <h2>员工统计</h2>
              <canvas id="staffAgeDistributionChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="chart-card">
              <h2>义工统计</h2>
              <canvas id="volunteerAgeDistributionChart" class="chart-canvas"></canvas>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/api/eld'
import api1 from '@/api/staff'
import api2 from '@/api/volunteer'
import { Bar } from 'chart.js';
import * as echarts from 'echarts';
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
      elderAgeDistributionData: {
        labels: ['60-70', '70-80', '80-90', '90以上'],
        datasets: [
          {
            label: '人数',
            backgroundColor: '#42A5F5',
            data: [0, 0, 0, 0], // 初始化数据
          },
        ],
      },
      staffAgeDistributionData: {
        labels: ['18岁以下', '18-25', '25-35', '35-45', '45-55', '55以上'],
        datasets: [
          {
            label: '人数',
            backgroundColor: '#42A5F5',
            data: [0, 0, 0, 0, 0, 0], // 初始化数据
          },
        ],
      },
      volunteerAgeDistributionData: {
        labels: ['18岁以下', '18-25', '25-35', '35-45', '45-55', '55以上'],
        datasets: [
          {
            label: '人数',
            backgroundColor: '#42A5F5',
            data: [0, 0, 0, 0, 0, 0], // 初始化数据
          },
        ],
      },
      healthStatusData: [],
    };
  },
  mounted() {
    this.getStaff(); // 获取数据并更新图表
    this.getElderly(); // 获取数据并更新图表
    this.getVolunteer(); // 获取数据并更新图表
  },
  methods: {
    getElderly() {
      api.getList(this.form).then(response => {
        const res = response;
        if (res.code === 20000) {
          const userData = res.data.rows.map(record => ({
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
            health: record.Healthy,
          }));

          this.userInfo = userData;
          this.total = res.data.total;

          this.updateElderlyChartsData(userData); // 更新图表数据
        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });
    },

    getStaff() {
      api1.getList(this.form).then(response => {
        const res = response;
        if (res.code === 20000) {
          const userData = res.data.rows.map(record => ({
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
          }));

          this.userInfo = userData;
          this.total = res.data.total;

          this.updateStaffChartsData(userData); // 更新图表数据
        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });
    },

    getVolunteer() {
      api2.getList(this.form).then(response => {
        const res = response;
        if (res.code === 20000) {
          const userData = res.data.rows.map(record => ({
            name: record.UserName,
            sex: record.Sex,
            age: record.Age,
          }));

          this.userInfo = userData;
          this.total = res.data.total;

          this.updateVolunteerChartsData(userData); // 更新图表数据
        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });
    },

    updateElderlyChartsData(userData) {
      // 老年人年龄分布统计
      const ageGroups = [0, 0, 0, 0];
      userData.forEach(user => {
        if (user.age >= 60 && user.age < 70) ageGroups[0]++;
        else if (user.age >= 70 && user.age < 80) ageGroups[1]++;
        else if (user.age >= 80 && user.age < 90) ageGroups[2]++;
        else if (user.age >= 90) ageGroups[3]++;
      });
      this.elderAgeDistributionData.datasets[0].data = ageGroups;

      // 健康状况统计
      const healthStatusCounts = [
        { name: '健康', value: 0 },
        { name: '良好', value: 0 },
        { name: '及格', value: 0 },
        { name: '疾病', value: 0 },
        { name: '严重', value: 0 },
      ];
      userData.forEach(user => {
        if (user.health === '健康') healthStatusCounts[0].value++;
        else if (user.health === '良好') healthStatusCounts[1].value++;
        else if (user.health === '及格') healthStatusCounts[2].value++;
        else if (user.health === '疾病') healthStatusCounts[3].value++;
        else if (user.health === '严重') healthStatusCounts[4].value++;
      });
      this.healthStatusData = healthStatusCounts;

      this.createElderAgeDistributionChart();
      this.createHealthStatusChart();
    },

    updateStaffChartsData(userData) {
      // 员工年龄分布统计
      const ageGroups = [0, 0, 0, 0, 0, 0];
      userData.forEach(user => {
        if (user.age < 18) ageGroups[0]++;
        else if (user.age >= 18 && user.age < 25) ageGroups[1]++;
        else if (user.age >= 25 && user.age < 35) ageGroups[2]++;
        else if (user.age >= 35 && user.age < 45) ageGroups[3]++;
        else if (user.age >= 45 && user.age < 55) ageGroups[4]++;
        else if (user.age >= 55) ageGroups[5]++;
      });
      this.staffAgeDistributionData.datasets[0].data = ageGroups;

      this.createStaffAgeDistributionChart();
    },

    updateVolunteerChartsData(userData) {
      // 义工年龄分布统计
      const ageGroups = [0, 0, 0, 0, 0, 0];
      userData.forEach(user => {
        if (user.age < 18) ageGroups[0]++;
        else if (user.age >= 18 && user.age < 25) ageGroups[1]++;
        else if (user.age >= 25 && user.age < 35) ageGroups[2]++;
        else if (user.age >= 35 && user.age < 45) ageGroups[3]++;
        else if (user.age >= 45 && user.age < 55) ageGroups[4]++;
        else if (user.age >= 55) ageGroups[5]++;
      });
      this.volunteerAgeDistributionData.datasets[0].data = ageGroups;

      this.createVolunteerAgeDistributionChart();
    },

    createElderAgeDistributionChart() {
      const ctx = document.getElementById('elderAgeDistributionChart').getContext('2d');
      new Bar(ctx, {
        data: this.elderAgeDistributionData,
        options: {
          responsive: true,
          scales: {
            x: { display: true },
            y: { display: true, beginAtZero: true }
          },
        },
      });
    },

    createStaffAgeDistributionChart() {
      const ctx = document.getElementById('staffAgeDistributionChart').getContext('2d');
      new Bar(ctx, {
        data: this.staffAgeDistributionData,
        options: {
          responsive: true,
          scales: {
            x: { display: true },
            y: { display: true, beginAtZero: true }
          },
        },
      });
    },

    createVolunteerAgeDistributionChart() {
      const ctx = document.getElementById('volunteerAgeDistributionChart').getContext('2d');
      new Bar(ctx, {
        data: this.volunteerAgeDistributionData,
        options: {
          responsive: true,
          scales: {
            x: { display: true },
            y: { display: true, beginAtZero: true }
          },
        },
      });
    },

    createHealthStatusChart() {
      const chartDom = document.getElementById('healthStatusChart');
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '健康状况分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '健康状况',
            type: 'pie',
            radius: '50%',
            data: this.healthStatusData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
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
  height: 300px;
  border: none;
}

</style>