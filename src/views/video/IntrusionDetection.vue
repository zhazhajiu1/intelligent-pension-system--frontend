<template>
    <div class="video">
      <el-container class="container">
        <el-main class="left">
          <div class="video-container">
            <div>摄像头：</div>
            <div>
              <img :src="videoSource" ref="videoImage" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
            </div>
  
            <div>处理后：</div>
            <div>
              <!-- <img :src="videoSource4" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"> -->
              <img :src="videoSource4" style="width: 100%; height: 100%">
            </div>
  
            <el-divider></el-divider>
            <el-card class="box-card">
              <button @click="getSRC">获取视频源</button>
              <button @click="startDraw">开始绘制</button>
              <button @click="clearAll">清除所有绘制</button>
              <button @click="sendPoints">发送坐标</button>
              <button @click="getSRC4">获取新视频</button>
            </el-card>
          </div>
        </el-main>
      </el-container>
  
      <canvas ref="drawCanvas" class="draw-canvas"></canvas>
    </div>
  </template>
  
  <script>
  import api from '@/api/video';
  
  export default {
    data() {
      return {
        videoSource: '',
        videoSource4: '',
        canvasWidth: 0,
        canvasHeight: 0,
        isDrawing: false,
        points: [],
        drawCanvas: null,
        drawCtx: null
      };
    },
  
    mounted() {
      // this.initCanvas(); // 移至 getSRC 方法内部调用
    },
  
    methods: {
      async getSRC() {
        try {
          const response = await api.getURL3();
          console.log('getSRC response:', response); // 调试信息：输出后端响应
          if (response.code === 20000) {
            this.$message({
              showClose: true,
              message: '获取成功！',
              type: 'success',
            });
            this.videoSource = response.src.video1;
            this.canvasWidth = response.data.width;
            this.canvasHeight = response.data.height;
            this.initCanvas(); // 初始化画布
          } else {
            this.$message.error('获取失败，请重试');
          }
        } catch (err) {
          console.error('getSRC error:', err); // 调试信息：输出错误
          this.$message.error('获取失败，请重试');
        }
      },
  
      async getSRC4() {
        try {
          const response = await api.getURL4();
          console.log('getSRC4 response:', response); // 调试信息：输出后端响应
          if (response.code === 20000) {
            this.$message({
              showClose: true,
              message: '获取成功！',
              type: 'success',
            });
            this.videoSource4 = response.src.video1;
          } else {
            this.$message.error('获取失败，请重试');
          }
        } catch (err) {
          console.error('getSRC4 error:', err); // 调试信息：输出错误
          this.$message.error('获取失败，请重试');
        }
      },
  
      initCanvas() {
        console.log('Initializing canvas'); // 调试信息：输出初始化信息
        this.drawCanvas = this.$refs.drawCanvas;
        if (this.drawCanvas) {
          this.drawCtx = this.drawCanvas.getContext('2d');
          this.drawCanvas.width = this.canvasWidth;
          this.drawCanvas.height = this.canvasHeight;
          this.drawCanvas.style.width = this.canvasWidth + 'px';
          this.drawCanvas.style.height = this.canvasHeight + 'px';
          this.drawCanvas.style.position = 'absolute';
          this.drawCanvas.style.top = this.$refs.videoImage.offsetTop + 'px';
          this.drawCanvas.style.left = this.$refs.videoImage.offsetLeft + 'px';
          this.drawCanvas.style.zIndex = 1;
          console.log('Canvas initialized:', this.drawCanvas); // 调试信息：输出 canvas 元素
        } else {
          console.error('Canvas 元素未正确获取到！'); // 错误信息：canvas 元素未正确获取到
        }
      },
  
      startDraw() {
        console.log('Starting drawing'); // 调试信息：输出开始绘制信息
        if (this.isDrawing) return;
        this.isDrawing = true;
        this.points = [];
        if (this.drawCanvas) {
          this.drawCanvas.classList.remove('hidden');
          this.drawCanvas.addEventListener('click', this.drawRect);
          console.log('Canvas event listener added'); // 调试信息：输出事件监听添加信息
        } else {
          console.error('Canvas 元素未正确初始化！'); // 错误信息：canvas 元素未正确初始化
        }
      },
  
      drawRect(e) {
        console.log('Drawing rectangle'); // 调试信息：输出绘制矩形信息
        if (!this.isDrawing) return;
  
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
            console.log('Drawing finished'); // 调试信息：输出绘制完成信息
          }
        }
      },
  
      drawRectangle() {
        console.log('Drawing rectangle on canvas'); // 调试信息：输出在画布上绘制矩形信息
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
        console.log('Clearing canvas'); // 调试信息：输出清除画布信息
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.points = [];
      },
  
      async sendPoints() {
        console.log('Sending coordinates'); // 调试信息：输出发送坐标信息
        if (this.points.length === 4) {
          const [p1, p2, p3, p4] = this.points;
          const coordinates = {
            p1x: Math.floor(p1.x),
            p1y: Math.floor(p1.y),
            p2x: Math.floor(p2.x),
            p2y: Math.floor(p2.y),
            p3x: Math.floor(p3.x),
            p3y: Math.floor(p3.y),
            p4x: Math.floor(p4.x),
            p4y: Math.floor(p4.y)
          };
          try {
            const response = await api.sendCoordinates(coordinates);
            console.log('sendPoints response:', response); // 调试信息：输出后端响应
            if (response.code === 20000) {
              this.$message({
                showClose: true,
                message: '坐标发送成功！',
                type: 'success',
              });
            } else {
              this.$message.error('坐标发送失败，请重试');
            }
          } catch (err) {
            console.error('sendPoints error:', err); // 调试信息：输出错误
            this.$message.error('坐标发送失败，请重试');
          }
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
  
  img {
    width: 100%;
    height: 100%;
  }
  
  canvas {
    position: absolute;
    z-index: 1;
    border: 1px solid red; /* 为了更好地调试，添加边框 */
  }
  
  .hidden {
    display: none;
  }
  </style>
  