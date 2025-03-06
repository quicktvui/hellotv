import { defineComponent, h, nextTick, onMounted, ref, renderSlot, toRaw, watch, reactive } from 'vue'
import { ESApp, Native, registerElement } from '@extscreen/es3-vue'
import _ from 'lodash';

function registerTabPaneViewComponent(app: ESApp) {
  const QTTabPaneViewImpl = defineComponent({
    emits: [

    ],
    props: {
      label: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      tagName: {
        type: String,
        default: 'tab-pane'
      },
    },
    setup(props, context) {
      const viewRef = ref()
      return () => {
        const children = context.slots.default && context.slots.default()
        return h(
          'div',
          {
            ref: viewRef,
          },
          children
        )
      }
    },
  })
  app.component('tab-pane', QTTabPaneViewImpl)
}

function registerTABSViewComponent(app: ESApp) {
  const QTTabsViewImpl = defineComponent({
    emits: [
      'tab-focus',
    ],
    props: {
      data: {
        type: Array,
        default: () => []
      },
      tabPosition: {
        type: String,
        default: 'top'
      },
      activeName: {
        type: String,
        default: ''
      },
      loadMore: {
        type: Function,
        default: function () {
          return null
        }
      },
      disableVirtualDOM: {
        type: Boolean,
        default: true
      },
      performance: {
        type: Boolean,
        default: true
      }
    },
    setup(props, context) {
      const viewRef = ref()
      const swiperRef = ref()
      const currentIndex = ref(0)
      const updateIndex = ref(0)
      let recordContentNode: Array<any> = []
      let currentArr: Array<any> = []
      watch(() => props.data, (hs) => {

      }, { deep: true })
      onMounted(() => {})
      context.expose({
        viewRef,
      })
      // 渲染导航节点
      const renderNav = (childNode) => {
        const children: any = [];
        let i: number =  -1
        childNode.map((item: any, index: number) => {
          if(item.type.props && item.type.props.tagName.default === 'tab-pane'){
            i++
            const itemNode = buildNavItemNode(item,i)
            children.push(itemNode)
          }else{
            if(String(item.type) == 'Symbol(v-fgt)' && item.children.length > 0){
              item.children.map((sItem: any) => {
                if(sItem.type.props && sItem.type.props.tagName.default === 'tab-pane'){
                  i++
                  const itemNode = buildNavItemNode(sItem,i)
                  children.push(itemNode)
                }
              })
            }
          }
        })
        return h(
          'ul',
          {
            horizontal: true,
            style: {height: '60px'},
            class: `tabs-header tabs-header-${props.tabPosition}`
          },
          children
        )
      }
      const buildNavItemNode = (item, index) => {
        return h(
          'li',
          {
            focusable: true,
            enableFocusBorder: true,
            onFocus: (evt: any) => {
              const obj = {
                index: index,
                label: item.props.label,
                isFocused: evt.isFocused
              }
              if(evt.isFocused) {
                currentIndex.value = index
                Native.callUIFunction(swiperRef.value, 'setPage', [index]);
              }
              context.emit('tab-focus', obj)
            },
            class: 'tabs-header-item',
          },
          h(
            'span',
            {
              focusable: false,
              class: 'tabs-header-item-text'
            },
            item.props.label
          )
        )
      }
      // 渲染swiper节点
      const renderContent = (childNode) => {
        const children: any = [];
        const newChildren: any = [];
        let i: number =  -1
        recordContentNode = []
        currentArr = []
        childNode.map((item: any, index: number) => {
          if(item.type.props && item.type.props.tagName.default === 'tab-pane'){
            i++
            const itemNode = buildContentNode(item,i)
            children.push(itemNode)
            recordContentNode.push(itemNode)
            currentArr.push(itemNode)
          }else{
            if(String(item.type) == 'Symbol(v-fgt)' && item.children.length > 0){
              item.children.map((sItem: any) => {
                if(sItem.type.props && sItem.type.props.tagName.default === 'tab-pane'){
                  i++
                  const itemNode = buildContentNode(sItem,i)
                  children.push(itemNode)
                  recordContentNode.push(itemNode)
                  currentArr.push(itemNode)
                }
              })
            }
          }
        })
        if(props.performance && children.length > 3){ //开启性能优化
          // let start = currentIndex.value - 1 < 0 ? 0 : currentIndex.value - 1
          // let end = currentIndex.value - 1 < 0 ? currentIndex.value + 3 : currentIndex.value + 2
          for (let i = 0; i < recordContentNode.length; i++) {
            // if(i < start || i >= end){
            //   currentArr[i].children = []
            // }else{
            //   if(!currentArr[i].children) currentArr[i].children = recordContentNode[i].children
            // }
            if(currentIndex.value > 0) currentArr[i].children = []
          }
          currentArr[currentIndex.value].children = recordContentNode[currentIndex.value].children
        }
        return h(
          'ViewPager',
          {
            ref: swiperRef,
            focusable: false,
            needAnimation: true,
            initialPage: 0,
            class: `tabs-content tabs-content-${props.tabPosition}`
          },
          currentArr
        )
      }
      const buildContentNode = (item, index?) => {
        return h(
          'ViewPagerItem',
          {
            focusable: false,
            class: 'tabs-content-item',
          },
          item
        )
      }
      return () => {
        nextTick(() => {
          console.log('tabs render end ')
        })
        const children = context.slots.default && context.slots.default()
        let navNode: any
        let contentNode: any
        if(children!.length > 0){
          navNode = renderNav(children)
          // contentNode = renderContent(children)
        }
        return h(
          'div',
          {
            ref: viewRef,
          },
          // [navNode, contentNode]
          [navNode]
        )
      }
    },
  })
  app.component('el-tabs', QTTabsViewImpl)
}

export const MYTABSComponent = (Vue) => {
  registerTabPaneViewComponent(Vue)
  registerTABSViewComponent(Vue)
}
