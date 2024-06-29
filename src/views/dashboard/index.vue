<template>
  <div id="app">
    <el-container>
      <el-header>
        <h1>欢迎来到IYing养老系统</h1>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <h2>年龄分布</h2>
              <canvas id="ageDistributionChart"></canvas>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <h2>健康状况</h2>
              <canvas id="healthStatusChart"></canvas>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
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
      ageDistributionData: {
        labels: ['60-70', '70-80', '80-90', '90以上'],
        datasets: [
          {
            label: '人数',
            backgroundColor: '#42A5F5',
            data: [55, 31, 20, 16], // 模拟数据
          },
        ],
      },
      healthStatusData: {
        labels: ['优秀', '良好', '一般', '需要额外关注'],
        datasets: [
          {
            backgroundColor: ['#66BB6A', '#FFA726', '#EF5350', '#AB47BC'],
            data: [40, 35, 15, 10], // 模拟数据
          },
        ],
      },
    };
  },
  mounted() {
    this.createAgeDistributionChart();
    this.createHealthStatusChart();
  },
  methods: {
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
    createHealthStatusChart() {
      try {
        new Pie(document.getElementById('healthStatusChart'), {
          data: this.healthStatusData,
          options: {
            responsive: true,
            title: {
              display: true,
              text: '老年人健康状况',
            },
          },
        });
        console.log("Pie chart created successfully");
      } catch (error) {
        console.error("Error creating Pie chart:", error);
      }
    },
  },
};
</script>

<style>
#app {
  padding: 20px;
}
</style>
