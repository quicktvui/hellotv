<template>
    <qt-view class="tvbox-settings-main">
        <img :src="bgError">
        <qt-view class="tvbox-settings-main-box">
            <qt-qr-code class="tvbox-settings-main-box-qrcode" :content="httpServerAddr"></qt-qr-code>
        </qt-view>
        <p class="tvbox-settings-main-qrcode-text">手机/电脑扫描上方二维码或者直接浏览器访问地址</p>
        <p class="tvbox-settings-main-qrcode-text" style="margin-top: 21px;">{{ httpServerAddr }}</p>
    </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EventBus, Native } from '@extscreen/es3-vue'
import { HttpServer, RouteParams } from './types/index'
import { useESToast } from '@extscreen/es3-core'
import { useESNativeRouter, useESRouter } from '@extscreen/es3-router'
import bgError from '../../assets/live/bg-error.png'

const toast = useESToast()
const router = useESRouter()
const nativeRouter = useESNativeRouter()

const routeParams = ref<RouteParams>()
const httpServer = ref<HttpServer>()
const httpServerAddr = ref()

function onESCreate(params: RouteParams) {
    // console.log('huan-onESCreate', params)
    routeParams.value = params
    createHttpServer()
        .then(result => {
            httpServer.value = result
            httpServerAddr.value = 'http://' + httpServer.value.ip + ':' + httpServer.value.port
        })
}

let isBack = false
function onBackPressed() {
    if (routeParams.value?.page) {
        router.back()
    } else {
        if (!isBack) {
            isBack = true
            toast.showToast('再按一次返回退出')
        } else {
            nativeRouter.back()
        }
    }
}

function onESDestroy() { closeHttpServer() }

function createHttpServer(): Promise<HttpServer> {
    return new Promise((resolve, reject) => {
        // 本地调试: adb push dist/android/assets/dist.zip /sdcard/Android/data/tv.eskit.debugger/cache/dist.zip
        // 传参改为: @assets/dist.zip
        Native.callNativeWithPromise('ESHttpServiceModule', 'startServerWithCode', 'assets/dist.zip')
            .then((response: HttpServer) => {
                // 注册资源
                Native.callNativeWithPromise('ESHttpServiceModule', 'addStaticGet', response.id, '/static/.*')
                // 注册接口
                Native.callNativeWithPromise('ESHttpServiceModule', 'addGet', response.id, '/settings')
                // 返回数据
                resolve(response)
            })
            .catch(error => console.log('huan-initHttpServer-error', error))
    })
}

function closeHttpServer() {
    // 关闭服务
    Native.callNativeWithPromise('ESHttpServiceModule', 'stopServer', httpServer.value?.id)
    // 关闭事件监听
    EventBus.$off('onHttpServerEvent')
}

// 监听底层事件
EventBus.$on('onHttpServerEvent', async (event: any) => {
    // console.log('huan-onHttpServerEvent', event)
    let content = JSON.parse(event.content)
    // console.log('huan-onHttpServerEvent-content', content)
    switch (event.type) {
        case 'url':
            if ((content.startsWith('http://') || content.startsWith('https://')) && content.replace('://', '#').split('/')[0].search(/[\u4e00-\u9fa5]/) < 0) {
                closeHttpServer()
                router.push({ name: 'live', params: { url: content }, replace: true })
            } else {
                toast.showToast('无效的URL地址')
            }
            break
        case 'text':
            try {
                let lives = JSON.parse(content.replace(/\+/g, '').match(/(?<=\"lives\":\s*)\[[\s\S]*?\]/)?.[0])
                // console.log('huan-onHttpServerEvent-lives', lives)
                if (typeof lives == 'object') {
                    closeHttpServer()
                    router.push({ name: 'live', params: { lives: JSON.stringify(lives) }, replace: true })
                } else {
                    toast.showToast('无效的JSON字符串')
                }
            } catch (error) {
                toast.showToast('无效的JSON字符串')
            }
            break
    }
})

defineExpose({ onESCreate, onBackPressed, onESDestroy })
</script>

<style scoped>
.tvbox-settings-main {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    align-items: center;
    justify-content: center;
}

.tvbox-settings-main img {
    width: 1920px;
    height: 1080px;
    position: absolute;
}

.tvbox-settings-main-box {
    width: 680px;
    height: 760px;
    background-color: white;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
}

.tvbox-settings-main-box-qrcode {
    width: 560px;
    height: 560px;
}

.tvbox-settings-main-qrcode-text {
    margin-top: 41px;
    color: white;
    font-size: 40px;
}
</style>
