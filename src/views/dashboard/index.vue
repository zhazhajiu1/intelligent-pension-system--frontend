<template>  
  <div class="dashboard-container">
    <div class="dashboard-text" style="font-size: 40px">
      <i class="el-icon-user-solid"></i>
      {{ name }}，欢迎您！
    </div>
    <el-divider content-position="left">历史人数数据</el-divider>
    <div class="block">
      <img :src="imgSource"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api/historyData'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      imgSource: ''
    }
  },
  methods: {
    getGraph() {
      api.getGraphURL().then( response => {
        this.imgSource = response.src
      })     
    }
  },
  created() {
    this.getGraph()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>
