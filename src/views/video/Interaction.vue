<template>
    <div class="video">
        <el-container class="container">
            <el-main class="left">
                <div class="video-container">
                    <div>交互检测摄像头：</div>
                    <div>
                        <img :src="videoSource" style="width: 100%; height: 100%">
                    </div>

                    <el-divider></el-divider>
                    <el-card class="box-card">
                        <el-button @click="getSRC">开始监测</el-button>
                        <el-button @click="stopSRC">停止监测</el-button>
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
            videoSource_local: '',
            title: '监控视频',
            isVideoFetching: false // 初始状态为 false
        };
    },

    methods: {
        async getSRC() {
            if (this.isVideoFetching) return; // 如果已经在获取视频源，则不执行获取

            this.isVideoFetching = true; // 开始获取视频源

            try {
                const response = await api.getURL5();
                console.log('getSRC response:', response); // 调试信息：输出后端响应
                if (response.code === 20000) {
                    this.$message({
                        showClose: true,
                        message: '获取成功！',
                        type: 'success',
                    });
                    this.videoSource = response.src.video1;
                } else {
                    this.$message.error('获取失败，请重试');
                }
            } catch (err) {
                console.error('getSRC error:', err); // 调试信息：输出错误
                this.$message.error('获取失败，请重试');
            } finally {
                this.isVideoFetching = false; // 无论成功与否，都停止获取
            }
        },

        stopSRC() {
            this.isVideoFetching = false; // 停止获取视频源
            this.videoSource = ''; // 清空视频源
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
