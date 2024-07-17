<template>
  <qt-list-view ref="mediaControlRef"
                :horizontal="true"
                name="mediaControlRef"
                class="media_control_root_css"
                padding="90,0,0,0"
                :listData="list"
  >
    <media-control-item-view :type="1"/>
    <media-control-item-icon-view :type="2"/>
  </qt-list-view>
</template>

<script lang="ts">
import { qtRef } from "@quicktvui/quicktvui3"
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { onMounted, ref } from "vue"
import MediaControlItemIconView from "./media-control-item-icon-view.vue"
import MediaControlItemView from "./media-control-item-view.vue"
import xuanJiIcon from '../../assets/def_media/ic_def_media_menu_xuanji.png'
import xuanJiFocusIcon from '../../assets/def_media/ic_def_media_menu_xuanji_focus.png'
import settingIcon from '../../assets/def_media/ic_def_media_menu_setting.png'
import settingFocusIcon from '../../assets/def_media/ic_def_media_menu_setting_focus.png'
export default defineComponent({
  name: "media-control-view",
  components: { MediaControlItemIconView, MediaControlItemView },
  setup(props, context) {
    const log = useESLog()
    const list = qtRef()

    const mediaControlRef = ref()
    onMounted(()=>{
      list.value =  [
        {type:2,iconNormal:xuanJiIcon,iconFocus:xuanJiFocusIcon,name:'选集',decoration:{right:30}},
        {type:1,name:'倍速 1.0x',decoration:{right:30}},
        {type:1,name:'自动(1080P)',decoration:{right:30}},
        {type:2,iconNormal:settingIcon,iconFocus:settingFocusIcon,name:'设置'},
      ]
    })

    return {
      mediaControlRef,
      list
    }
  }
})
</script>

<style>
.media_control_root_css {
  width: 1920px;
  height: 72px;
  background-color: transparent;
}
</style>
