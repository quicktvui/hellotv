<template>
  <div layout="${layout}" flexStyle="${style}" style="background-color: rgba(0,0,0,0.1);border-radius: 20px;" :focusable="false" :clipChildren="false">
    <replace-child :focusable="false" ref="item_replace_child" :clipChildren="false"
                   :replaceOnVisibilityChanged='false' markChildSID="bg-player"
      sid="${sid}"  eventReceiverSID='homeTabs' flexStyle="${style}" style="background-color: transparent;">
    </replace-child>
  </div>
</template>

<script lang="ts">

import {defineComponent,} from '@vue/runtime-core';

export default defineComponent({
    name: 'item-cell-player',
    setup(props, context) {
      function onSectionBind() {

      }

      return {
        onSectionBind
      };
    },
  });
  </script>

<style scoped>
.qt-ui-waterfall-vue-section {
    background-color: transparent;
}
</style>
