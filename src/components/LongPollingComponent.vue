<template>
  <div>
    <!-- 在此处显示接收到的数据 -->
    {{ receivedData }}
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      receivedData: 0,
      pollingRequestCancelToken: null
    };
  },
  mounted() {
    this.sendLongPollingRequest();
  },
  beforeDestroy() {
    this.cancelPollingRequest();
  },
  methods: {
    sendLongPollingRequest() {
      const apiUrl = process.env.VUE_APP_BASE_API + 'video/update';
      // const apiUrl = 'http://172.26.184.19:8080/video/update';  // 后端的长轮询接口URL

      // 创建一个取消令牌
      const cancelToken = new axios.CancelToken(cancel => {
        this.pollingRequestCancelToken = cancel;
      });

      axios.get(apiUrl, { cancelToken })
        .then(response => {
          // 处理服务器返回的数据
          const newData = response.data.number;
          
          // 更新接收到的数据
          this.receivedData = newData;

          // 发起下一次长轮询请求
          this.sendLongPollingRequest();
        })
        .catch(error => {
          // 处理错误
          console.error('长轮询异常终止');

          // 发起下一次长轮询请求
          // this.sendLongPollingRequest();
        });
    },
    cancelPollingRequest() {
      if (this.pollingRequestCancelToken) {
        this.pollingRequestCancelToken(); // 调用取消令牌函数取消请求
      }
    }
  },
};
</script>