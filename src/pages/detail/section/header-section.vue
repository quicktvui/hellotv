<template>
  <qt-vue-section>
    <qt-row class="header-root-css">
      <qt-row class="header-left-button-css">
        <navigation-button
          class="header-home-button-css"
          :focus-icon="searchFocused"
          :icon="searchNormal"
          :blockFocusDirections="['left','right','top']"
          @focus="onSearchButtonFocused"
          @click="onSearchButtonClicked"
          text="搜索"/>
      </qt-row>
      <img class="header-logo-css"
           :duplicateParentState="true"
           :focusable="false"
           :src="logo"/>
    </qt-row>
  </qt-vue-section>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import navigation_button from "../component/navigation-button.vue";
import homeFocused from "../../../assets/ic_header_home_focus.png";
import homeNormal from "../../../assets/ic_header_home.png";

import searchFocused from "../../../assets/ic_top_search_focus.png";
import searchNormal from "../../../assets/ic_top_search.png";

import loginFocused from "../../../assets/ic_header_login_focused.png";
import loginNormal from "../../../assets/ic_header_login_normal.png";

import logo from "../../../assets/ic_right_logo.png";
import {useESRouter} from "@extscreen/es3-router";

export default defineComponent({
  name: "header-section",
  components: {
    'navigation-button': navigation_button
  },
  setup(props, context) {

    const router = useESRouter()

    function onSearchButtonClicked() {
      router.push("search")
    }

    function onSearchButtonFocused(isFocused: boolean) {
      context.emit("onSearchButtonFocused", isFocused)
    }

    return {
      homeFocused,
      homeNormal,
      logo,
      searchFocused,
      searchNormal,
      loginFocused,
      loginNormal,
      onSearchButtonClicked,
      onSearchButtonFocused
    }
  },
});

</script>

<style scoped>
.header-root-css {
  width: 1920px;
  height: 135px;
  background-color: transparent;
}

.header-left-button-css {
  position: absolute;
  left: 90px;
  top: 35px
}

.header-home-button-css {
  margin-right: 20px;
}

.header-logo-css {
  width: 274px;
  height: 60px;
  position: absolute;
  right: 90px;
  top: 35px
}

</style>
