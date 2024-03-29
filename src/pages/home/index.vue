<template>
    <div class="home-root-css" ref="root">
        <waterfall-tabs ref="waterfallTabs">
            <template #buttonsHeader>
                <top-btns-view :logo-right="true">
                </top-btns-view>
            </template>
        </waterfall-tabs>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import TopBtnsView from "../../components/top-btns-view.vue";
import WaterfallTabs from "./components/waterfall-tabs.vue";
import ImgTextBtnView from "../../components/img-text-btn-view.vue";
import { useESLocalStorage } from "@extscreen/es3-core";
import { historyKey, localHistory, loadHistory } from "src/api/history/store";

export default defineComponent({
    name: "home",
    components: {
        'waterfall-tabs': WaterfallTabs,
        'img-text-btn-view': ImgTextBtnView,
        'top-btns-view': TopBtnsView
    },
    props: {
        height: {
            type: String,
            default: "80px"
        }
    },
    setup(props, context) {
        const waterfallTabs = ref()
        const localStore = useESLocalStorage()
        async function onESCreate(params) {
            loadHistory(JSON.parse(await localStore.getString(historyKey, JSON.stringify(localHistory))))
            waterfallTabs.value?.onESCreate(params)
        }

        function onESStart() {

        }
        function onESPause() {
            waterfallTabs.value?.onESPause()
        }

        function onESResume() {
            waterfallTabs.value?.onESResume()
        }

        function onESStop() {
            waterfallTabs.value?.onESStop()
        }

        function onESDestroy() {
            waterfallTabs.value?.onESDestroy()
        }

        return {
            waterfallTabs,
            onESCreate,
            onESStart,
            onESResume,
            onESStop,
            onESPause,
            onESDestroy,
        }
    }
})
</script>

<style src="./css/home.css"></style>
