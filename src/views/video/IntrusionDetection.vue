<template>
    <div class="video">
      <el-container class="container">
        <el-main class="left">
          <div class="video-container">
            <div>摄像头：</div>
            <div style="position: relative;">
              <video ref="videoElement" autoplay playsinline style="width: 100%; height: 100%"></video>
              <canvas ref="drawCanvas" style="position: absolute; top: 0; left: 0;"></canvas>
            </div>
            <el-divider></el-divider>
            <el-card class="box-card">
              <button @click="getSRC">获取视频源</button>
              <button @click="startDraw">开始绘制</button>
              <button @click="clearAll">清除所有绘制</button>
              <button @click="sendPoints">发送坐标</button>
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
        canvasWidth: 0,
        canvasHeight: 0,
        isDrawing: false,
        points: [],
        drawCanvas: null,
        drawCtx: null
      };
    },
  
    mounted() {
      this.initCanvas();
    },
  
    methods: {
      getSRC() {
        api.getURL3().then(response => {
          const res = response;
          if (res.code === 20000) {
            this.$message({
              showClose: true,
              message: '获取成功！',
              type: 'success',
            });
            this.videoSource = res.src.video1;
            this.canvasWidth = res.data.width;
            this.canvasHeight = res.data.height;
            this.playVideo(this.videoSource);
          } else {
            this.$message.error('获取失败，请重试');
          }
        }).catch(err => {
          console.log(err);
          this.$message.error('获取失败，请重试');
        });
      },
  
      playVideo(src) {
        const videoElement = this.$refs.videoElement;
        videoElement.srcObject = null;
        videoElement.src = src;
        videoElement.play();
        // 设置视频元素和画布的大小
        videoElement.addEventListener('loadedmetadata', () => {
          this.$refs.drawCanvas.width = this.canvasWidth;
          this.$refs.drawCanvas.height = this.canvasHeight;
          videoElement.style.width = this.canvasWidth + 'px';
          videoElement.style.height = this.canvasHeight + 'px';
        });
      },
  
      initCanvas() {
        this.drawCanvas = this.$refs.drawCanvas;
        this.drawCtx = this.drawCanvas.getContext('2d');
      },
  
      startDraw() {
        if (this.isDrawing) return;
        this.isDrawing = true;
        this.points = [];
        this.drawCanvas.addEventListener('click', this.drawRect);
      },
  
      drawRect(e) {
        const rect = this.drawCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.points.length < 4) {
          this.points.push({ x, y });
          this.drawCtx.fillStyle = 'red';
          this.drawCtx.fillRect(x - 2, y - 2, 4, 4);
          if (this.points.length === 4) {
            this.drawRectangle();
            this.isDrawing = false;
            this.drawCanvas.removeEventListener('click', this.drawRect);
          }
        }
      },
  
      drawRectangle() {
        const [p1, p2, p3, p4] = this.points;
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.drawCtx.strokeStyle = 'blue';
        this.drawCtx.lineWidth = 2;
        this.drawCtx.beginPath();
        this.drawCtx.moveTo(p1.x, p1.y);
        this.drawCtx.lineTo(p2.x, p2.y);
        this.drawCtx.lineTo(p3.x, p3.y);
        this.drawCtx.lineTo(p4.x, p4.y);
        this.drawCtx.closePath();
        this.drawCtx.stroke();
      },
  
      clearAll() {
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.points = [];
      },
  
      sendPoints() {
        if (this.points.length === 4) {
          const coordinates = this.points.map(point => ({ x: Math.floor(point.x), y: Math.floor(point.y) }));
          api.sendCoordinates(coordinates).then(response => {
            if (response.code === 20000) {
              this.$message({
                showClose: true,
                message: '坐标发送成功！',
                type: 'success',
              });
            } else {
              this.$message.error('坐标发送失败，请重试');
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('坐标发送失败，请重试');
          });
        } else {
          this.$message.error('请先绘制一个矩形');
        }
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
  
  .video-container {
    position: relative;
  }
  
  video {
    width: 100%;
    height: 100%;
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  </style>
  