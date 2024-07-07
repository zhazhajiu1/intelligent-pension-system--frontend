<template>
    <div class="video">
        <div class="chat-container">
            <div class="messages">
                <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                    <!-- 机器人回答 -->
                    <div v-if="message.role === 'assistant'" class="assistant-message">
                        <img src="https://www.logosc.cn//oss/icons/2023/03/28/cb468535203d42e509bc58de004f46cb.svg"
                            class="chat-icon" />
                        <div class="message-content">
                            <p>{{ message.content }}</p>
                            <el-button type="text" icon="el-icon-document-copy"
                                @click="copyText(message.content)">复制</el-button>
                        </div>
                    </div>
                    <!-- 用户提问 -->
                    <div v-else class="user-message">
                        <div class="message-content">
                            <p>{{ message.content }}</p>
                            <el-button type="text" icon="el-icon-document-copy"
                                @click="copyText(message.content)">复制</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="input-container">
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="option in options" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </el-option>
                </el-select>
                <el-input v-model="userInput" @keyup.enter="sendMessage" placeholder="发送消息..." />
                <el-button type="primary" icon="el-icon-position" @click="sendMessage()">发送</el-button>
                <el-button type="primary" icon="el-icon-microphone" @click="audioChangeWord()"><span
                        v-if="isListening">语音识别中...</span><span v-else></span>
                </el-button>
            </div>
        </div>

    </div>
</template>

<script>
import api from '@/api/user';

export default {
    name: "AudioToWord",

    data() {
        return {
            options: [
                { value: '普通话男声', label: '普通话男声' },
                { value: '普通话女声', label: '普通话女声' },
                { value: '粤语男声', label: '粤语男声' },
                { value: '粤语女声', label: '粤语女声' }
            ],
            value: '',
            word: "",
            isListening: false, // 判断是否在语音监听中

            Question: {
                Question: '',
            },
            userInput: '',
            messages: [
                { role: 'assistant', content: '你好，请问有什么可以帮您的吗？' }
            ],
            recognition: null,
            isRecognizing: false,
            voices: [],
        };
    },
    created() {
        this.speak(this.messages[0].content);

        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = 'zh-CN';
            // 设置语音识别为非连续模式，即只识别一次
            this.recognition.continuous = false;
            // 不返回临时结果，只返回最终结果
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.userInput = transcript;
                this.speak(`识别成功：${transcript}`);
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                this.speak('语音识别失败');
                console.error('语音识别失败', event);
            };

            this.recognition.onend = () => {
                this.isRecognizing = false;
            };
        } else {
            console.warn('当前浏览器不支持语音识别');
        }

        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
    },
    methods: {
        audioChangeWord() {
            var that = this;
            that.word = "";
            // 创建SpeechRecognition对象
            // eslint-disable-next-line no-undef
            var recognition = new webkitSpeechRecognition();
            if (!recognition) {
                // eslint-disable-next-line no-undef
                recognition = new SpeechRecognition();
            }
            // 设置语言
            recognition.lang = 'zh-CN';
            // 开始语音识别
            recognition.start();
            that.isListening = true;
            // 监听识别结果
            recognition.onresult = function (event) {
                var result = event.results[0][0].transcript;
                that.word = result;
                that.userInput = result;
                // that.sendMessage(); 
            };

            // 监听错误事件
            recognition.onerror = function (event) {
                that.isListening = false;
                that.$message("监听语音失败:" + event.error);
                console.error(event.error);
            };
            // 监听结束事件（包括识别成功、识别错误和用户停止）
            recognition.onend = function () {
                that.isListening = false;
                console.log("语音识别停止");
            };
        },


        sendMessage() {
            if (this.userInput.trim() === '') return;

            this.messages.push({ role: 'user', content: this.userInput });

            this.Question.Question = this.userInput;
            this.speak(this.userInput);

            this.userInput = ''; // 清空输入框

            api.aiChat(this.Question).then(response => {
                const res = response;
                if (res.code === 20000) {
                    // this.$message({
                    //     showClose: true,
                    //     message: '发送成功！',
                    //     type: 'success',
                    // });

                    const reply = res.data.Answer;
                    this.messages.push({ role: 'assistant', content: reply });
                    this.speak(reply);

                } else {
                    this.$message.error('获取失败，请重试');
                }
            }).catch(err => {
                console.error(err);
                this.$message.error('获取失败，请重试');
            });

            this.userInput = '';
        },

        copyText(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            }).catch(err => {
                this.$message({
                    message: '复制失败',
                    type: 'error'
                });
                console.error('Error:', err);
            });
        },

        speak(text) {
            if ('speechSynthesis' in window) {
                const voices = window.speechSynthesis.getVoices();
                const utterance = new SpeechSynthesisUtterance(text);

                let voiceIndex;
                switch (this.value) {
                    case '普通话男声':
                        voiceIndex = 7; 
                        break;
                    case '普通话女声':
                        voiceIndex = 2; 
                        break;
                    case '粤语男声':
                        voiceIndex = 3; 
                        break;
                    case '粤语女声':
                        voiceIndex = 4; 
                        break;
                    default:
                        voiceIndex = 0; // 默认
                }

                utterance.voice = voices[voiceIndex];
                utterance.lang = 'zh-CN';
                window.speechSynthesis.speak(utterance);

            } else {
                console.warn('当前浏览器不支持语音合成');
            }
            // this.speak(this.messages[0].content);

        },

        startVoiceRecognition() {
            this.speak("您说,我在听");
            if (this.recognition && !this.isRecognizing) {
                this.recognition.start();
                this.isRecognizing = true;
            }
        },

        stopVoiceRecognition() {
            if (this.recognition && this.isRecognizing) {
                this.recognition.stop();
                this.isRecognizing = false;
            }
        }
    }
};
</script>

<style>
.chat-container {
    height: 88vh;
    margin: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #ccc;
    overflow: hidden;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.message {
    margin: 10px 0;
    display: flex;
}

.assistant-message {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

.user-message {
    width: 100%;
    display: flex;
    align-items: flex-end;
    flex-direction: row-reverse;
}

.chat-icon {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.message-content {
    max-width: 80%;
    padding: 5px 15px;
    margin-top: 5px;
    border-radius: 10px;
    letter-spacing: 1px;
    display: inline-block;
    background-color: #f0f0f0;
}

.message.user .message-content {
    background-color: #d4edda;
    margin-left: auto;
    cursor: pointer;
}

.message.assistant .message-content {
    background-color: #f0f0f0;
    margin-right: auto;
    cursor: pointer;
}

.input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
}
</style>