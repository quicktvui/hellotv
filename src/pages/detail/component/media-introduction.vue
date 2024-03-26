<template>
    <qt-column class='media-introduction-root-css'>
        <qt-column class='media-introduction-css'>
            <!-- 标题 -->
            <text-view
                class='media-introduction-title-text-css'
                :duplicateParentState='true'
                :focusable='false'
                :textSize='60'
                :ellipsizeMode='2'
                enablePostTask
                postDelay='200'
                :lines='1'
                gravity='left'
                :text='title' />

            <!-- 底部介绍 -->
            <qt-column
                class='media-introduction-detail-root-css'
                :enableFocusBorder='true'
                :clipChildren='false'
                :focusable='true'
                @click='onClick'
                @focus='onFocus'
                :style="{'focus-border-color': isMediaTypeFree ? '#FFFFFF' : '#FFD97C'}"
                :focusScale='1.05'>

                <!-- 第一行 -->
                <qt-row :duplicateParentState='true'>
                    <div class='media-introduction-detail-vip-css'
                         :gradientBackground="{colors:['#A06419','#CDA048'], orientation: 6, cornerRadii4: [4, 4, 4, 4]}">
                        <text-view
                            class='media-introduction-detail-vip-text-css'
                            :duplicateParentState='true'
                            :focusable='false'
                            :textSize='24'
                            :ellipsizeMode='2'
                            enablePostTask
                            postDelay='200'
                            :lines='1'
                            gravity='center'
                            text='影视VIP' />
                    </div>

                    <div class='media-introduction-detail-score-css'
                         v-if='showActors'>
                        <text-view
                            class='media-introduction-detail-score-text-css'
                            :duplicateParentState='true'
                            :focusable='false'
                            :textSize='24'
                            :ellipsizeMode='2'
                            enablePostTask
                            postDelay='200'
                            :lines='1'
                            gravity='center'
                            :text='score' />
                    </div>

                    <text-view
                        class='media-introduction-detail-brief-text-css'
                        :duplicateParentState='true'
                        :focusable='false'
                        :textSize='24'
                        :ellipsizeMode='2'
                        enablePostTask
                        postDelay='200'
                        :lines='1'
                        gravity='left|center'
                        :text='subtitle' />
                </qt-row>

                <!-- 第二行 -->
                <text-view v-if='actors'
                           class='media-introduction-detail-actor-text-css'
                           :duplicateParentState='true'
                           :focusable='false'
                           :textSize='24'
                           :ellipsizeMode='2'
                           enablePostTask
                           postDelay='200'
                           :lines='1'
                           gravity='left|center'
                           :text='actors' />

                <!-- 第三行 -->
                <text-view
                    :style='{height:introductionHeight}'
                    class='media-introduction-detail-text-css'
                    :duplicateParentState='true'
                    :focusable='false'
                    :textSize='24'
                    :lineSpacing='6'
                    :lineHeight='30'
                    :ellipsizeMode='2'
                    enablePostTask
                    postDelay='200'
                    :lines='introductionLine'
                    gravity='left|center'
                    :text='introduction' />
            </qt-column>
        </qt-column>
    </qt-column>
</template>

<script lang='ts'>

import { defineComponent } from '@vue/runtime-core'
import { IMedia } from '../../../api/media/IMedia'
import { inject, Ref, ref, watch } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { IMediaAuthorization } from '../../../api/media/IMediaAuthorization'
import { mediaAuthorizationKey } from '../injectionSymbols'
import { IMediaAuthType } from '../../../api/media/IMediaAuthType'

export default defineComponent({
    name: 'media-introduction',
    emits: ['onIntroductionFocus'],
    setup(props, context) {
        const router = useESRouter()
        const title = ref<string>('')
        const score = ref<string>('')
        const subtitle = ref<string>('')
        const actors = ref<string>('')
        const showActors = ref<boolean>(false)
        const introduction = ref<string>('')
        const isMediaTypeFree = ref<boolean>(true)
        const introductionHeight = ref<number>(28)
        const introductionLine = ref<number>(1)

        const mediaAuthorization: Ref<IMediaAuthorization> =
            inject(mediaAuthorizationKey, {} as any)

        watch(
            () => [mediaAuthorization?.value] as const,
            ([auth], [oldAuth]) => {
                if (mediaAuthorization?.value.type == IMediaAuthType.MEDIA_AUTH_TYPE_FREE) {
                    isMediaTypeFree.value = true
                } else {
                    isMediaTypeFree.value = false
                }
            },
            { flush: 'post' }
        )

        let m: IMedia

        function initMedia(media: IMedia) {
            m = media
            if (media.title != null) {
                title.value = media.title
            }
            score.value = media.score
            if (media.subtitle != null) {
                subtitle.value = media.subtitle
            }
            actors.value = media.actors
            introduction.value = media.introduction
            if (actors.value != '') {
                showActors.value = true
                introductionHeight.value = 28
                introductionLine.value = 1
            } else {
                showActors.value = false
                introductionHeight.value = 95
                introductionLine.value = 3
            }
        }

        function onClick() {
            router.push({
                name: 'introduction',
                params: m
            })
        }

        function onFocus(e) {
            context.emit('onIntroductionFocus', e.isFocused)
        }

        return {
            showActors,
            introductionLine,
            initMedia,
            title,
            score,
            subtitle,
            actors,
            introduction,
            onClick,
            onFocus,
            isMediaTypeFree,
            mediaAuthorization,
            introductionHeight
        }
    }
})

</script>

<style scoped>
.media-introduction-root-css {
    width: 904px;
    height: 280px;
    left: 1016px;
    position: absolute;
}

.media-introduction-css {
    width: 814px;
    height: 280px;
}

.media-introduction-title-text-css {
    width: 814px;
    height: 64px;
    font-size: 54px;
    font-weight: 400;
    color: #FFFFFF;
}


.media-introduction-detail-root-css {
    width: 846px;
    height: 196px;
    margin-top: 20px;
    padding: 20px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.1);
}

.media-introduction-detail-vip-css {
    margin-right: 20px;
    border-color: #F7B500;
    align-items: center;
    display: flex;
    height: 36px;
    width: 100px;
    flex-direction: row;
    justify-content: center
}

.media-introduction-detail-vip-text-css {
    font-size: 24px;
    color: #FFFFFF;
    margin-left: 12px;
    margin-right: 12px;
    height: 36px;
    width: 100px;
}

.media-introduction-detail-score-css {
    border-radius: 4px;
    margin-right: 20px;
    border-color: #F7B500;
    border-width: 1.5px;
    align-items: center;
    display: flex;
    width: 60px;
    height: 32px;
    flex-direction: row;
    justify-content: center
}

.media-introduction-detail-score-text-css {
    top: -1px;
    font-size: 24px;
    color: #F7B500;
    width: 60px;
    height: 32px;
}

.media-introduction-detail-brief-text-css {
    color: rgba(255, 255, 255, 0.6);
    focus-color: white;
    height: 28px;
    width: 814px;
    margin-bottom: 26px;
}

.media-introduction-detail-actor-text-css {
    height: 28px;
    width: 814px;
    color: rgba(255, 255, 255, 0.6);
    focus-color: white;
    margin-bottom: 20px;
}

.media-introduction-detail-text-css {
    color: rgba(255, 255, 255, 0.6);
    focus-color: white;
    height: 28px;
    width: 814px;
    background-color: transparent;
    margin-top: 6px;
    margin-bottom: 6px;
}
</style>
