<template>
  <div
    :type="104"
    layout="${layout}"
    :focusable="true"
    eventClick
    eventFocus
    :clipChildren="true"
    :enableFocusBorder="true"
    class="poster-user-content-box"
    flexStyle="${image.style}"
    sid="${_id}"
  >
    <div class="poster-user-icon-container">
      <img class="poster-user-icon-bg" :focusable="false" src="../../../assets/my/ic_user.png" />
      <img class="poster-user-icon" :focusable="false" src="${image.src}" showIf="${image.enable}" />
    </div>

    <div class="poster-user-content-box-info" :focusable="false" duplicateParentState>
      <text-view
        class="poster-user-title"
        style="margin-top: 40px; color: #ffffff"
        :focusable="false"
        :ellipsizeMode="4"
        :fontSize="36"
        :lines="1"
        gravity="centerVertical|start"
        text="${title.text}"
        showIf="${title.enable}"
      />
      <div class="poster-user-title-tip" duplicateParentState>
        <text-view
          class="poster-user-title-tip-txt"
          :focusable="false"
          :ellipsizeMode="2"
          duplicateParentState
          :lines="1"
          gravity="center"
          text="${subTitle.text}"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.poster-user-content-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  focus-border-radius: 16px;
}

.poster-user-icon-container {
  width: 160px;
  height: 160px;
  margin-left: 40px;
  background-color: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 80px;
}
.poster-user-icon-bg {
  position: absolute;
  top: 41px;
  left: 47px;
  width: 66px;
  height: 78px;
}
.poster-user-icon {
  width: 160px;
  height: 160px;
  border-radius: 80px;
}

.poster-user-content-box-info {
  margin-top: 20px;
  margin-left: 30px;
  width: 288px;
  height: 237px;
  border-top-right-radius: 42px;
  border-bottom-right-radius: 42px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.poster-user-title {
  width: 288px;
  background-color: transparent;
  height: 44px;
}

.poster-user-title-tip {
  width: 210px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.06);
  focus-background-color: white;
  margin-top: 30px;
  border-radius: 30px;
}
.poster-user-title-tip-txt {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.55);
  focus-color: #000000;
  width: 210px;
  height: 60px;
}
</style>
