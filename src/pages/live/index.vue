<template>
    <qt-view class="tvbox-live-main">
        <!-- 设备时间 -->
        <p class="tvbox-live-time">{{ deviceTime }}</p>

        <!-- 资源播放 -->
        <ESPlayerManager ref="playerManager" :playerList="playerListRef" :initPlayerWindowType="2"
            @onPlayerBufferStart="onPlayerBufferStart" @onPlayerPrepared="onPlayerPrepared"
            @onPlayerPlaying="onPlayerPlaying" @onPlayerError="onPlayerError" />

        <qt-loading-view v-show="showLoading" class="tvbox-live-loading" />

        <!-- 功能区域 -->
        <qt-view class="tvbox-live-func">
            <LoadingError v-show="showLoadingError" />

            <!-- 节目信息 -->
            <qt-view v-show="showPlayinfo" class="tvbox-live-playinfo">
                <img class="tvbox-live-playinfo-img" :src="bgPlayInfo">

                <qt-view class="tvbox-live-playinfo-channel">
                    <p style="font-size: 52px; color: white;">{{ curMedia.channelId }}</p>
                    <qt-text class="tvbox-live-playinfo-channel-text" :text="curMedia.channelName || ''"
                        gravity="center" :lines="1" :ellipsizeMode="3" :select="true"></qt-text>
                </qt-view>

                <qt-view class="tvbox-live-playinfo-program">
                    <div style="flex-direction: row; align-items: center;">
                        <img style="width: 12px; height: 20px; margin-right: 7px;" :src="icPlaying">
                        <div v-if="curProgram.title" style="flex-direction: row;">
                            <p class="tvbox-live-playinfo-program-text">正在播放</p>
                            <p class="tvbox-live-playinfo-program-text" style="margin-left: 16px; margin-right: 16px;">
                                {{ curProgram.start }}</p>
                            <qt-text class="tvbox-live-playinfo-program-text" style="width: 300px;"
                                :text="curProgram.title" :lines="1" :ellipsizeMode="3" :select="true">
                            </qt-text>
                        </div>
                        <p v-else class="tvbox-live-playinfo-program-text">正在播放 - 暂无节目信息</p>
                    </div>

                    <div style="flex-direction: row; margin-left: 19px;">
                        <div v-if="nextProgram.title" style="flex-direction: row;">
                            <p class="tvbox-live-playinfo-program-text2">下一节目</p>
                            <p class="tvbox-live-playinfo-program-text2">
                                {{ nextProgram.start }}</p>
                            <qt-text class="tvbox-live-playinfo-program-text2" style="width: 300px;"
                                :text="nextProgram.title" :lines="1" :ellipsizeMode="3" :select="true"></qt-text>
                        </div>
                        <p v-else class="tvbox-live-playinfo-program-text2">下一节目 - 暂无节目信息</p>
                    </div>

                    <div style="flex-direction: row; align-items: center; margin-left: 19px;">
                        <img class="tvbox-live-playinfo-program-img" :src="icOk">
                        <p class="tvbox-live-playinfo-program-text2">节目列表</p>
                        <img class="tvbox-live-playinfo-program-img" :src="icMenu">
                        <p class="tvbox-live-playinfo-program-text2">换源</p>
                        <img class="tvbox-live-playinfo-program-img" :src="icChange">
                        <p class="tvbox-live-playinfo-program-text2">换台</p>
                    </div>

                    <p class="tvbox-live-playinfo-program-lines">[线路{{ curMediaLine + 1 }}/{{ curMediaLines }}]</p>
                </qt-view>
            </qt-view>

            <!-- 菜单 -->
            <qt-view v-show="showMenu" class="tvbox-live-menu" :clipChildren="false">
                <!-- 一级 -->
                <qt-view class="menu-first-tab-bg">
                    <qt-list-view class="menu-first-tab" ref="firstTabRef" :autoscroll="[firstTabScrollPos, 432]"
                        :skipRequestFocus="true" :singleSelectPosition="firstTabSelectPos" @item-focused="onFocused">
                        <qt-view class="menu-first-tab-item" :type="1" :focusable="true" eventFocus>
                            <qt-view class="menu-first-tab-item-focus" duplicateParentState></qt-view>
                            <qt-text class="menu-first-tab-item-text" text="${label}" gravity="center"
                                duplicateParentState></qt-text>
                        </qt-view>
                    </qt-list-view>
                </qt-view>

                <!-- 二级 -->
                <qt-view class="menu-second-tab-bg">
                    <qt-list-view class="menu-second-tab" ref="secondTabRef" :enableSelectOnFocus="false"
                        :autofocusPosition="secondTabFocusPos" :autoscroll="[secondTabScrollPos, 432]"
                        :skipRequestFocus="true" :singleSelectPosition="secondTabSelectPos" @item-focused="onFocused"
                        @item-click="onClick">
                        <qt-view class="menu-second-tab-item" :type="2" :focusable="true" eventFocus eventClick>
                            <qt-view class="menu-second-tab-item-focus" duplicateParentState></qt-view>
                            <play-mark showIf="${isActive==true}" class="menu-second-tab-item-img"
                                markColor="#FFFFFF" />
                            <qt-text showIf="${isActive==false}" class="menu-second-tab-item-left" text="${channelId}"
                                gravity="center" duplicateParentState></qt-text>
                            <qt-text class="menu-second-tab-item-right" text="${channelName}" gravity="left|center"
                                :lines="1" :ellipsizeMode="4" duplicateParentState></qt-text>
                        </qt-view>
                    </qt-list-view>
                </qt-view>

                <!-- 三级 -->
                <qt-view v-if="showThirdTab" class="menu-third-tab-bg">
                    <qt-list-view v-if="thirdTabList.length != 0" class="menu-third-tab" ref="thirdTabRef"
                        @item-focused="onFocused">
                        <qt-view class="menu-third-tab-item" :type="3" :focusable="true" eventFocus>
                            <qt-view class="menu-third-tab-item-focus" duplicateParentState></qt-view>
                            <qt-text class="menu-third-tab-item-top" text="${label}" :lines="1" :ellipsizeMode="4"
                                duplicateParentState></qt-text>
                            <qt-text class="menu-third-tab-item-bottom" text="${rawData.start}"
                                duplicateParentState></qt-text>
                        </qt-view>
                    </qt-list-view>
                    <qt-text v-else class="menu-third-tab-nodata" text="暂无节目单信息"></qt-text>
                </qt-view>

                <!-- 扩展 -->
                <qt-view v-if="showMenu && !showThirdTab" class="menu-third-tab-ext" :clipChildren="false">
                    <qt-view class="menu-third-tab-ext-bg"></qt-view>
                    <img class="menu-third-tab-ext-img" :src="icMenuExt">
                    <img class="menu-third-tab-ext-img2" :src="icMenuExtArrow">
                    <qt-text class="menu-third-tab-ext-text" text="节目信息"></qt-text>
                </qt-view>

                <qt-view class="tvbox-live-menu-back">
                    <p>按</p>
                    <img :src="icBack">
                    <p>返回键回到首页</p>
                </qt-view>
            </qt-view>
        </qt-view>
    </qt-view>
</template>

<script setup lang="ts">
import { ref, markRaw, nextTick } from 'vue'
import { useESToast, ESKeyEvent, useESLocalStorage } from '@extscreen/es3-core'
import { useESRouter } from "@extscreen/es3-router"
import { ESVideoPlayer } from "@extscreen/es3-video-player"
import { ESIPlayerManager, ESMediaItem, ESPlayerManager } from "@extscreen/es3-player-manager"
import { ESPlayerDecode, ESPlayerError } from '@extscreen/es3-player'
import { QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import { RouteParams, Lives, Category, Channel, Program } from './types'
import LoadingError from '../../components/LoadingError.vue'
import BuildConfig from '../../build/BuildConfig'
import bgPlayInfo from '../../assets/live/bg-play-info.png'
import icOk from '../../assets/live/ic-ok.png'
import icMenu from '../../assets/live/ic-menu.png'
import icMenuExt from '../../assets/live/ic-menu-ext.png'
import icMenuExtArrow from '../../assets/live/ic-menu-ext-arrow.png'
import icBack from '../../assets/live/ic-back.png'
import icChange from '../../assets/live/ic-change.png'
import icPlaying from '../../assets/live/ic-playing.png'

// 直播源节目
let liveSourceEpg: string = ''
// 直播源数据
let liveSourceData = ref<Category[]>([])
// 直播源频道数
let liveSourceChannelCount = 0

async function initLiveSource(url: string) {
    await getLiveSourceChannel(url)
        .then(result => {
            liveSourceData.value = result
            liveSourceData.value.map(category => liveSourceChannelCount += category.data.length)
        })
        .catch(error => { console.log('huan-getLiveSourceChannel-error', error) })
}

function loadLiveSourceChannel(page: number, limit: number): Channel[] {
    let offset = (page - 1) * limit
    let channels: Channel[] = []

    if (offset < liveSourceChannelCount) {
        let isBreak = false
        let skip = 0
        for (let i = 0; i < liveSourceData.value.length; i++) {
            if (isBreak) {
                break
            }

            let category = liveSourceData.value[i]
            let channelCount = category.data.length

            // 跳页逻辑
            skip += channelCount
            if (offset > 0 && skip < offset) {
                continue
            }

            for (let j = offset == 0 ? 0 : channelCount - (skip - offset); j < channelCount; j++) {
                let channel = category.data[j]
                offset = 0
                channels.push({
                    id: channel.id,
                    name: channel.name,
                    addrs: channel.addrs,
                    category: category.name,
                    categoryIndex: i
                })

                if (channels.length == limit) {
                    isBreak = true
                    break
                }
            }
        }
    }

    return channels
}

let now = new Date()
let today = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)

const toast = useESToast()
const router = useESRouter()
const localStore = useESLocalStorage()

const deviceTime = ref()
const showLoading = ref(false)
const showPlayinfo = ref(false)
const showLoadingError = ref(false)

const playerManager = ref<ESIPlayerManager>()
const playerListRef = ref([markRaw(ESVideoPlayer)])

const showMenu = ref(false)
const firstTabScrollPos = ref(0)
const firstTabSelectPos = ref(0)
const secondTabFocusPos = ref(0)
const secondTabScrollPos = ref(0)
const secondTabSelectPos = ref(0)
const firstTabRef = ref<QTIListView>()
const secondTabRef = ref<QTIListView>()
let secondTabList: QTListViewItem[] = []
const thirdTabRef = ref<QTIListView>()
const thirdTabList: QTListViewItem[] = []
const showThirdTab = ref(false)

async function onESCreate(params: RouteParams) {
    console.log('huan-onESCreate-params', params)
    // 设置优先级
    let useSet = (params.url || params.lives) ? true : false
    // 直播源地址
    let liveSourceUrl = params.lives ? '' : params.url || BuildConfig.defaultSourceUrl
    console.log('huan-onESCreate-liveSourceUrl', liveSourceUrl)
    // 直播源配置
    let liveSourceList: Lives = params.lives ? JSON.parse(params.lives) : JSON.parse(await localStore.getString('liveSourceList', '[]'))
    console.log('huan-onESCreate-liveSourceList', liveSourceList)
    // 判断源是否改变
    let isLiveSourceChange = false

    if (liveSourceUrl == '' && !liveSourceList) {
        toast.showToast('未检测到源，无法正常播放')
        router.push({ name: 'settings', replace: true })
    } else {
        showLoading.value = true

        if ((useSet && liveSourceUrl != '') || (!liveSourceList || liveSourceList.length == 0)) {
            await getLiveSourceConfig(liveSourceUrl)
                .then(result => {
                    liveSourceList = result
                    isLiveSourceChange = true
                })
                .catch(error => {
                    console.log('huan-getLiveSourceConfig-error', error)
                    toast.showToast('源有问题，无法观看，请重新添加')
                    router.push({ name: 'settings', replace: true })
                    return
                })
        }

        let live = liveSourceList[0]
        if (live.url.startsWith('./')) {
            let suffix = liveSourceUrl.split('/').pop() || ''
            live.url = liveSourceUrl.replace(suffix, live.url)
        }
        liveSourceEpg = live.epg

        // 初始化直播源
        await initLiveSource(live.url)
        if (liveSourceData.value.length == 0) {
            toast.showToast('源有问题，无法观看，请重新添加')
            router.push({ name: 'settings', replace: true })
            return
        }

        // 本地存储
        localStore.putString('liveSourceList', JSON.stringify(liveSourceList))

        // 更新设备时间
        setInterval(() => {
            let date = new Date()
            deviceTime.value = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
        }, 1000)

        // 初始化播放列表
        let playerMediaList: ESMediaItem[] = []
        liveSourceData.value.map((category, categoryIndex) => category.data.map((channel, channelIndex) => {
            playerMediaList.push({
                id: channel.id, // 资源播放唯一ID
                mediaSourceList: { index: 0, list: channel.addrs.map(addr => ({ uri: addr })) },
                categoryIndex: categoryIndex,
                channelIndex: channelIndex,
                channelId: channel.id,
                channelName: channel.name
            })
        }))

        playerManager.value?.initialize()
        // playerManager.value?.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE) // 目前不生效
        playerManager.value?.playMediaList({ index: 0, list: playerMediaList })

        // 续播逻辑
        if (!isLiveSourceChange) {
            playIndex = await localStore.getInt('playIndex', 0)
            playerManager.value?.playMediaByIndex(playIndex)
        }
        playNextMedia(false)

        // 一级菜单数据
        let firstTabData: QTListViewItem[] = []
        // 二级菜单数据
        let secondTabData: QTListViewItem[] = []

        liveSourceData.value.map((category, categoryIndex) => {
            firstTabData.push({
                type: 1,
                label: category.name,
                firstChannelId: category.data[0].id
            })
            category.data.map((channel, channelIndex) => {
                secondTabData.push({
                    type: 2,
                    channelIndex: channelIndex,
                    channelId: channel.id,
                    channelName: channel.name,
                    categoryIndex: categoryIndex,
                    category: category.name,
                    isActive: curMedia.value.channelId == channel.id ? true : false // 当前频道是否激活
                })
            })
        })

        nextTick(() => {
            // 初始化一级Tab
            firstTabRef.value?.init(firstTabData)
            // 初始化二级Tab
            secondTabList = secondTabRef.value!.init(secondTabData)
        })
    }
}

let isPause = false
const onESPause = () => {
    isPause = true
    playerManager.value?.pause()
}

const onESResume = () => {
    if (isPause) {
        isPause = false
        playerManager.value?.resume()
        playNextMedia(false)
    }
}

function onKeyDown(event: ESKeyEvent) {
    console.log('huan-onKeyDown-event', event)
    switch (event.keyCode) {
        case 82: // 菜单键
            clearTimeout(playTimer)
            router.push({ name: 'settings', params: { page: 'live' } })
            break
        case 23: case 66: // OK
            if (!showMenu.value) {
                // 展示菜单
                showMenu.value = true
                secondTabList[secondTabSelectPos.value].isActive = false
                firstTabScrollPos.value = curMedia.value.categoryIndex
                firstTabSelectPos.value = curMedia.value.categoryIndex
                secondTabFocusPos.value = curMedia.value.channelId - 1
                secondTabScrollPos.value = curMedia.value.channelId - 1
                secondTabSelectPos.value = curMedia.value.channelId - 1
                secondTabList[secondTabSelectPos.value].isActive = true
            }
            break
        case 19: // 上
            if (!showMenu.value) {
                playPreviousMedia()
            }
            break
        case 20: // 下
            if (!showMenu.value) {
                playNextMedia(true)
            }
            break
        case 22: // 右
            if (showMenu.value && secondTabActive && !showThirdTab.value) {
                nextTick(() => {
                    showThirdTab.value = true
                    setTimeout(() => { thirdTabRef.value!.init(thirdTabList) }, 300)
                })
            }
            break
    }
}

let isBack = false
function onBackPressed() {
    if (showMenu.value) {
        showMenu.value = false
        showThirdTab.value = false
        isBack = false
    } else {
        if (!isBack) {
            isBack = true
            toast.showToast('再按一次返回退出')
        } else {
            router.back()
        }
    }
}

let playIndex: number = 0
let playTimer: any = -1
let playInfoTimer: any = -1
function playPreviousMedia() {
    if (!showMenu.value) {
        clearTimeout(playTimer)
        showLoading.value = true
        showLoadingError.value = false

        playIndex = --playIndex < 0 ? liveSourceChannelCount - 1 : playIndex

        let PreviousMedia = playerManager.value?.getMedia(playIndex)
        if (PreviousMedia) {
            curMedia.value = PreviousMedia
            curMediaLine.value = 0
            curMediaLines.value = 0
            curProgram.value = {}
            nextProgram.value = {}
            showPlayinfo.value = true
        }

        playerManager.value?.playMediaByIndex(playIndex)
        playTimer = setTimeout(() => playNextMediaSource(true), 5000)
    }
}

function playNextMedia(immediately: boolean) {
    if (!showMenu.value) {
        clearTimeout(playTimer)
        showLoading.value = true
        showLoadingError.value = false

        playIndex = immediately ? ++playIndex >= liveSourceChannelCount ? 0 : playIndex : playIndex

        let nextMeida = playerManager.value?.getMedia(playIndex)
        if (nextMeida) {
            curMedia.value = nextMeida
            curMediaLine.value = 0
            curMediaLines.value = 0
            curProgram.value = {}
            nextProgram.value = {}
            showPlayinfo.value = true
        }

        if (immediately) {
            playerManager.value?.playMediaByIndex(playIndex)
        }

        playTimer = setTimeout(() => playNextMediaSource(true), 5000)
    }
}

function playNextMediaSource(immediately: boolean) {
    clearTimeout(playTimer)
    showLoading.value = true
    playTimer = setTimeout(() => {
        if (immediately) {
            if (++curMediaLine.value >= curMediaLines.value) {
                playerManager.value?.stop()
                showLoadingError.value = true
                return
            } else {
                toast.showToast('播放失败，自动切换下一线路')
                playerManager.value?.playNextMediaSource()
            }
        }
        playNextMediaSource(true)
    }, 5000)
}

function onPlayerBufferStart() {
    console.log('huan-onPlayerBufferStart')
    playNextMediaSource(false)
}

const curMedia = ref<ESMediaItem>({})
const curMediaLine = ref(0)
const curMediaLines = ref(0)
const curProgram = ref<Program>({})
const nextProgram = ref<Program>({})
async function onPlayerPrepared() {
    console.log('huan-onPlayerPrepared')
    clearTimeout(playTimer)
    clearTimeout(playInfoTimer)
    showPlayinfo.value = true

    playIndex = playerManager.value!.getPlayingMediaIndex()
    await localStore.putInt('playIndex', playIndex)

    curMedia.value = playerManager.value?.getPlayingMedia() as ESMediaItem
    curMediaLine.value = playerManager.value?.getPlayingMediaSourceIndex() || 0
    curMediaLines.value = playerManager.value?.getPlayingMediaSourceList()?.list.length || 0

    // 获取当前频道节目单
    let channel = liveSourceData.value[curMedia.value.categoryIndex].data[curMedia.value.channelIndex]
    if (!channel.programs) {
        channel.programs = await getLiveSourceChannelProgram(liveSourceEpg.replace('{name}', channel.name).replace('{date}', today))
    }

    // 获取当前节目和下一个节目
    let cDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()

    for (let i = 0; i < channel.programs.length; i++) {
        let item = channel.programs[i]
        let sTime = new Date(cDate + ' ' + item.start)
        let eTime = new Date(cDate + ' ' + item.end)
        if (sTime.getTime() <= now.getTime() && eTime.getTime() > now.getTime()) {
            curProgram.value = item
            nextProgram.value = channel.programs[i + 1]
        }
    }
}

function onPlayerPlaying() {
    console.log('huan-onPlayerPlaying')
    clearTimeout(playTimer)
    clearTimeout(playInfoTimer)
    showLoading.value = false
    playInfoTimer = setTimeout(() => { showPlayinfo.value = false }, 10000)
}

function onPlayerError(error: ESPlayerError) {
    console.log('huan-onPlayerError', error)
}

let menuCloseTimer: any = -1
let onFocuseTimer: any = -1
let secondTabActive = false
function onFocused(e: any) {
    console.log('huan-onFocused-e', e)
    if (e.isFocused) {
        clearTimeout(menuCloseTimer)
        clearTimeout(onFocuseTimer)
        switch (e.item.type) {
            case 1:
                secondTabActive = false
                showThirdTab.value = false
                if (e.position != firstTabScrollPos.value) {
                    secondTabScrollPos.value = e.item.firstChannelId - 1
                }
                break
            case 2:
                secondTabActive = true
                firstTabScrollPos.value = e.item.categoryIndex
                firstTabSelectPos.value = e.item.categoryIndex
                onFocuseTimer = setTimeout(async () => {
                    // 请求频道节目单数据
                    let channel = liveSourceData.value[e.item.categoryIndex].data[e.item.channelIndex]
                    if (!channel.programs) {
                        channel.programs = await getLiveSourceChannelProgram(liveSourceEpg.replace('{name}', channel.name).replace('{date}', today))
                    }

                    // 更新三级菜单数据
                    thirdTabList.splice(0)
                    channel.programs.map(item => {
                        thirdTabList.push({ type: 3, label: item.title, rawData: item })
                    })
                    if (showThirdTab.value) {
                        thirdTabRef.value?.init(thirdTabList)
                    }
                }, 300)
                break
        }

        menuCloseTimer = setTimeout(() => { showMenu.value = false }, 10000)
    }
}

function onClick(e: any) {
    console.log('huan-onClick-e', e)
    showMenu.value = false
    showThirdTab.value = false
    playIndex = e.item.channelId - 1
    playerManager.value?.playMediaByIndex(playIndex)
    playNextMedia(false)
}

async function fetchWithRedirect(resource: string, options: any = {}) {
    try {
        let response = await fetch(resource, options)
        if (response.status == 301 || response.status == 302) {
            response = await fetch(response.headers['Location'], options)
        }
        return response
    } catch (error) {
        throw new Error('请求失败！')
    }
}

// 获取直播源源配置
function getLiveSourceConfig(url: string): Promise<Lives> {
    console.log('huan-getLiveSourceConfig-url', url)
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (response.status != 200) {
                    console.log('huan-response', response)
                    reject('请求失败！')
                }
                return response
            })
            .then(response => response.text())
            .then(text => resolve(JSON.parse(text.match(/(?<=\"lives\":\s*)\[[\s\S]*?\]/)?.[0] || '[]')))
            .catch(error => reject(error))
    })
}

// 获取直播源频道数据
function getLiveSourceChannel(url: string): Promise<Category[]> {
    console.log('huan-getLiveSourceChannel-url', url)
    return new Promise((resolve, reject) => {
        fetchWithRedirect(url)
            .then(response => response.text())
            .then(text => {
                let categorys = <Category[]>[]

                // 格式化分类数据
                if (text.search('#EXTM3U') >= 0) {
                    let lastCategory = ''
                    text.replace(/<br>/g, '\r\n').split('\r\n').forEach((row, index) => {
                        if (index == 0) {
                            return
                        }

                        let items = row.split(',')
                        if (items.length == 1) {
                            let lastItems = categorys[categorys.length - 1].data
                            categorys[categorys.length - 1].data[lastItems.length - 1].addrs = items
                        } else {
                            let category = (items[0].match(/\"(.*)\"/)?.[0] || '').replace(/\"/g, '')
                            if (lastCategory == category) {
                                categorys[categorys.length - 1].data.push({ id: 0, name: items[1], addrs: [] })
                            } else {
                                categorys.push({ name: category, data: [{ id: 0, name: items[1], addrs: [] }] })
                            }
                            lastCategory = category
                        }
                    })
                } else {
                    text.replace(/<br>/g, '\r\n').split('\r\n').forEach(row => {
                        let items = row.split(',')

                        // 过滤不符合规则的数据
                        if (items.length < 2) {
                            return
                        }

                        if (items[1] === '#genre#') {
                            categorys.push({ name: items[0], data: [] })
                        } else {
                            categorys[categorys.length - 1].data.push({ id: 0, name: items[0], addrs: [items[1]] })
                        }
                    })
                }

                // 合并各分类频道同源数据
                let counter = 1
                categorys.forEach((item, index) => {
                    let tmp = <Channel[]>{}
                    item.data.sort((a, b) => {
                        const val1 = parseInt(a.name.substring(a.name.search(/\d+/)))
                        const val2 = parseInt(b.name.substring(a.name.search(/\d+/)))
                        return (val1 && val2) ? val1 - val2 : a.name > b.name ? 1 : -1 // 优先按频道名称中的数字升序、其次按频道名称升序
                    }).map(channel => {
                        if (tmp[channel.name]) {
                            tmp[channel.name].addrs.push(...channel.addrs)
                        } else {
                            tmp[channel.name] = { id: counter, name: channel.name, addrs: channel.addrs }
                            counter++
                        }
                    })

                    let category = <Category>{ name: item.name, data: [] }
                    for (const [key, val] of Object.entries(tmp)) {
                        category.data.push(val)
                    }

                    categorys.splice(index, 1, category)
                })

                resolve(categorys)
            },)
            .catch(error => reject(error))
    })
}

// 获取直播源频道节目数据
function getLiveSourceChannelProgram(url: string): Promise<Program[]> {
    console.log('huan-getLiveSourceChannelProgram-url', url)
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(result => resolve(result.epg_data))
            .catch(error => toast.showToast('数据加载失败，请稍后再试！'))
    })
}

defineExpose({ onESCreate, onESPause, onESResume, onKeyDown, onBackPressed })
</script>

<style scoped>
.tvbox-live-main {
    width: 1920px;
    height: 1080px;
    background-color: black;
}

.tvbox-live-time {
    position: absolute;
    top: 80px;
    right: 100px;
    color: white;
    font-size: 36px;
    line-height: 44px;
    z-index: 1;
}

.tvbox-live-func {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    position: absolute
}

.tvbox-live-loading {
    width: 100px;
    height: 100px;
    background-color: transparent;
    position: absolute;
    top: 490px;
    left: 910px;
}

.tvbox-live-playinfo {
    width: 1200px;
    height: 140px;
    background-color: #3098FF80;
    border-radius: 15px;
    position: absolute;
    left: 360px;
    bottom: 80px;
    flex-direction: row;
}

.tvbox-live-playinfo-img {
    width: 317px;
    height: 140px;
    position: absolute;
}

.tvbox-live-playinfo-channel {
    width: 317px;
    height: 140px;
    background-color: transparent;
    align-items: center;
    justify-content: center;
}

.tvbox-live-playinfo-channel-text {
    width: 197px;
    height: 52px;
    background-color: transparent;
    font-size: 36px;
    color: white;
}

.tvbox-live-playinfo-program {
    width: 883px;
    height: 140px;
    background-color: transparent;
    justify-content: center;
    padding-left: 40px;
}

.tvbox-live-playinfo-program-text {
    font-size: 24px;
    line-height: 35px;
    color: white;
}

.tvbox-live-playinfo-program-text2 {
    font-size: 24px;
    line-height: 35px;
    color: #DBEDFFFF;
    margin-right: 16px;
}

.tvbox-live-playinfo-program-img {
    width: 22px;
    height: 22px;
    margin-top: 4px;
    margin-left: 2px;
    margin-right: 2px;
}

.tvbox-live-playinfo-program-lines {
    color: white;
    font-size: 24px;
    position: absolute;
    top: 15px;
    right: 40px;
}

.tvbox-live-menu {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    position: absolute;
    flex-direction: row;
}

.menu-first-tab-bg {
    width: 309px;
    height: 1080px;
    background-color: rgba(27, 27, 27, 0.60);
    padding-top: 72px;
    padding-left: 52px;
    padding-right: 17px;
}

.menu-first-tab {
    width: 240px;
    height: 1008px;
    background-color: transparent;
}

.menu-first-tab-item {
    width: 240px;
    height: 108px;
    background-color: transparent;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.menu-first-tab-item-focus {
    width: 240px;
    height: 108px;
    background-color: transparent;
    focus-background-color: #3098FFFF;
    position: absolute;
    border-radius: 16px;
}

.menu-first-tab-item-text {
    width: 240px;
    height: 108px;
    background-color: transparent;
    font-size: 36px;
    color: white;
    select-color: #3098FFFF;
}

.menu-second-tab-bg {
    width: 383px;
    height: 1080px;
    background-color: rgba(27, 27, 27, 0.60);
    padding-top: 72px;
    padding-right: 43px;
}

.menu-second-tab {
    width: 340px;
    height: 1008px;
    background-color: transparent;
}

.menu-second-tab-item {
    width: 340px;
    height: 108px;
    background-color: transparent;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.menu-second-tab-item-focus {
    width: 340px;
    height: 108px;
    background-color: transparent;
    focus-background-color: #3098FFFF;
    position: absolute;
    border-radius: 16px;
}

.menu-second-tab-item-img {
    width: 42px;
    height: 42px;
    background-color: transparent;
    position: absolute;
    left: 36px;
    select-color: #3098FFFF;
}

.menu-second-tab-item-left {
    width: 84px;
    height: 52px;
    background-color: transparent;
    position: absolute;
    left: 15px;
    color: white;
    select-color: #3098FFFF;
}

.menu-second-tab-item-right {
    width: 214px;
    height: 52px;
    background-color: transparent;
    position: absolute;
    left: 111px;
    font-size: 36px;
    color: white;
    select-color: #3098FFFF;
}

.menu-third-tab-bg {
    width: 522px;
    height: 1080px;
    background-color: rgba(27, 27, 27, 0.60);
    padding-top: 72px;
    padding-right: 82px;
    align-items: center;
    justify-content: center;
}

.menu-third-tab {
    width: 440px;
    height: 1008px;
    background-color: transparent;
}

.menu-third-tab-nodata {
    width: 252px;
    height: 52px;
    background-color: transparent;
    margin-bottom: 72px;
    font-size: 36px;
    color: white;
}

.menu-third-tab-item {
    width: 440px;
    height: 108px;
    background-color: transparent;
    align-items: center;
    justify-content: center;
}

.menu-third-tab-item-focus {
    width: 440px;
    height: 108px;
    background-color: transparent;
    focus-background-color: #3098FFFF;
    position: absolute;
    border-radius: 16px;
}

.menu-third-tab-item-top {
    width: 400px;
    height: 52px;
    background-color: transparent;
    position: absolute;
    top: 8px;
    font-size: 36px;
    color: white;
    select-color: #3098FFFF;
}

.menu-third-tab-item-bottom {
    width: 400px;
    height: 35px;
    background-color: transparent;
    position: absolute;
    top: 64px;
    font-size: 24px;
    color: white;
    select-color: #3098FFFF;
}

.menu-third-tab-ext {
    width: 132px;
    height: 1080px;
    background-color: transparent;
    position: absolute;
    top: 0px;
    margin-left: 714px;
    align-items: center;
    justify-content: center;
}

.menu-third-tab-ext-bg {
    width: 22px;
    height: 1080px;
    background-color: rgba(27, 27, 27, 0.60);
    position: absolute;
    left: -22px;
}

.menu-third-tab-ext-img {
    width: 132px;
    height: 1080px;
    background-color: transparent;
    position: absolute;
}

.menu-third-tab-ext-img2 {
    width: 24px;
    height: 24px;
    background-color: transparent;
    position: absolute;
    top: 528px;
    right: 8px;
}

.menu-third-tab-ext-text {
    width: 36px;
    height: 184px;
    background-color: transparent;
    font-size: 36px;
    color: white;
    margin-right: 36px;
}

.tvbox-live-back {
    position: absolute;
    bottom: 80px;
    right: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.tvbox-live-back p {
    color: white;
    font-size: 36px;
    margin-bottom: 2px;
}

.tvbox-live-back img {
    width: 35px;
    height: 35px;
}
</style>
