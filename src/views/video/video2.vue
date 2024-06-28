<template>  
  <div class="video">
    <el-container class="container">
      <!-- <el-main class="left">
        <div class="video-container">
          <div>摄像头1：</div>
          <div>
            <img :src="videoSource" style="width: 100%;height: 100%">
          </div>
          <el-divider></el-divider>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>教室人数统计</span>
            </div>
            <div>
              教室人数：    
              <LongPollingComponent></LongPollingComponent>
            </div>
          </el-card>
        </div>
      </el-main> -->
      <el-main class="right">
        <div class="video-container">
          <div>摄像头2：</div>
          <div>
            <img :src="videoSource2" style="width: 100%;height: 100%">
          </div>
          <el-divider></el-divider>
        </div>
      </el-main>
      <!-- <el-aside width="300px">
        <el-divider></el-divider>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>人数统计</span>
            <LongPollingComponent></LongPollingComponent>
          </div>
        </el-card>
        <el-divider></el-divider>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行为分析</span>
          </div>
        </el-card>
      </el-aside> -->
    </el-container>
  </div>
</template>

<script>
import api from '@/api/video'
import LongPollingComponent from '@/components/LongPollingComponent.vue';
export default {
  data() {
    return {
      videoSource: "",
      videoSource2: "",
      // videoSource: 'https://prod-streaming-video-msn-com.akamaized.net/a8c412fa-f696-4ff2-9c76-e8ed9cdffe0f/604a87fc-e7bc-463e-8d56-cde7e661d690.mp4',
      // videoSource: 'http://vjs.zencdn.net/v/oceans.mp4',
      // videoSource: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      title: "监控视频"
    };
  },
  methods: {
    getSRC() {
      api.getURL().then(response => {
        // this.videoSource = response.src.video1;
        this.videoSource2 = response.src.video2;
        console.log(this.videoSource);
      });
    }
  },
  beforeDestroy() {
    this.videoSource = "";
    this.videoSource2 = "";
  },
  created() {
    this.getSRC();
  },
  components: { LongPollingComponent },
}
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 平分两列 */
  gap: 10px; /* 列之间的间隔，根据需要调整 */
}

.left,
.right {
  padding: 10px; /* 内边距，根据需要调整 */
}
</style>