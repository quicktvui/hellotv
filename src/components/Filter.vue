<template>
  <tv-item class="qt-ui-waterfall-vue-section" :type="1008611" keyName="_id" :blockFocusDirections="blockFocusDirections"
    :clipChildren="false" :clipPadding="false" flexStyle="${style}" singleton @item-bind="onSectionBind">
    <slot />
  </tv-item>
</template>

<script lang="ts" setup>
interface Props {
  blockFocusDirections?: ['top', 'right', 'bottom', 'left']
}

const { blockFocusDirections = [] } = defineProps<Props>();

const emit = defineEmits(['onSectionBind']);

const onSectionBind = (...rest: any[]) => {
  emit("onSectionBind", ...rest)
}
</script>
