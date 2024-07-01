<template>
  <div class="video">
    <el-container class="container">
      <el-main class="left">
        <div class="video-container">
          <div>摄像头1：</div>
          <div>
            <img :src="videoSource" style="width: 100%; height: 100%">
          </div>
          <el-divider></el-divider>
          <el-card class="box-card">
            <button @click="getSRC">获取视频源</button>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/api/video';

export default {
  data() {
    return {
      videoSource: '',
      videoSource2: '',
      title: '监控视频'
    };
  },

  mounted() {
    // this.getSRC();
  },

  methods: {
    getSRC() {
      api.getURL().then(response => {
        const res = response; // axios 返回的数据在 response 中
        if (res.code === 20000) {
          this.$message({
            showClose: true,
            message: '获取成功！',
            type: 'success',
          });
          this.videoSource = res.src.video1; // Assigning video URL to videoSource
          console.log(this.videoSource);

        } else {
          this.$message.error('获取失败，请重试');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error('获取失败，请重试');
      });
    }
  }
};
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.left,
.right {
  padding: 10px;
}
</style>
