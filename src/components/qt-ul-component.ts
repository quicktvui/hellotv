import { defineComponent, h, nextTick, onMounted, ref, renderSlot, toRaw, watch, reactive } from 'vue'
import { ESApp, Native, registerElement } from '@extscreen/es3-vue'
interface ESListViewItemDecoration {
  left?: number
  top?: number
  right?: number
  bottom?: number
}
interface ESListViewItem {
  _id?: string
  type: number
  decoration?: ESListViewItemDecoration

  [prop: string]: any
}
interface ESListViewItemFunctionParams {
  itemPosition: number
  targetName: string
  functionTargetName: string
  data: Array<any>
}
enum ESDirections {
  ES_DIRECTION_UP = 'up',
  ES_DIRECTION_DOWN = 'down',
  ES_DIRECTION_RIGHT = 'right',
  ES_DIRECTION_LEFT = 'left'
}
function registerQTULViewComponent(app: ESApp) {
  registerElement('FastListView', {
    component: {
      name: 'FastListView',
      processEventData(
        evtData: any,
        nativeEventParams: {
          isFocused: boolean
          position: number
          index: number
          y: number
          item: any
          hasFocus: boolean
          name: string
          parentPosition: number
          pageIndex: number
          child: any
          isLastLine: any
          itemCount: number
          direction: string
          contentOffset: any
          state: any
          hIndex: number
        }
      ) {
        const { handler: event, __evt: nativeEventName } = evtData
        switch (nativeEventName) {
          case 'onItemClick':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.index = nativeEventParams.index
              event.item = nativeEventParams.item
              event.name = nativeEventParams.name
              event.parentPosition = nativeEventParams.parentPosition
            }
            break
          case 'onItemFocused':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.index = nativeEventParams.index
              event.hasFocus = nativeEventParams.hasFocus
              event.isFocused = nativeEventParams.hasFocus
              event.item = nativeEventParams.item
              event.name = nativeEventParams.name
              event.parentPosition = nativeEventParams.parentPosition
            }
            break
          case 'onBindItem':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.pageIndex = nativeEventParams.pageIndex
              event.name = nativeEventParams.name
              event.item = nativeEventParams.item
            }
            break
          case 'onAttachedToWindow':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.pageIndex = nativeEventParams.pageIndex
              event.name = nativeEventParams.name
              event.item = nativeEventParams.item
            }
            break
          case 'onDetachedFromWindow':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.pageIndex = nativeEventParams.pageIndex
              event.name = nativeEventParams.name
              event.item = nativeEventParams.item
            }
            break
          case 'onUnbindItem':
            if (nativeEventParams) {
              event.position = nativeEventParams.position
              event.name = nativeEventParams.name
            }
            break
          case 'onScroll':
            if (nativeEventParams) {
              event.offsetX = nativeEventParams.contentOffset.x
              event.offsetY = nativeEventParams.contentOffset.y
            }
            break
          case 'onScrollOffset':
            if (nativeEventParams) {
              event.offsetY = nativeEventParams.y
            }
            break
          case 'onScrollStateChanged':
            if (nativeEventParams) {
              event.offsetX = nativeEventParams.contentOffset.x
              event.offsetY = nativeEventParams.contentOffset.y
              event.oldState = nativeEventParams.state.oldState
              event.newState = nativeEventParams.state.newState
            }
            break
          case 'onChildFocus':
            if (nativeEventParams) {
              event.child = {
                index: nativeEventParams.child.index,
                id: nativeEventParams.child.id,
                name: nativeEventParams.child.name,
                position: nativeEventParams.child.position
              }
              event.focused = {
                id: nativeEventParams.child.id,
                name: nativeEventParams.child.name
              }
            }
            break
          case 'onChildSelect':
            if (nativeEventParams) {
              event.child = {
                index: nativeEventParams.child.index,
                id: nativeEventParams.child.id,
                name: nativeEventParams.child.name,
                position: nativeEventParams.child.position
              }
            }
            break
          case 'onFocusSearchFailed':
            if (nativeEventParams) {
              event.child = {
                index: nativeEventParams.child.index,
                id: nativeEventParams.child.id,
                name: nativeEventParams.child.name,
                position: nativeEventParams.child.position
              }
              event.focused = {
                id: nativeEventParams.child.id,
                name: nativeEventParams.child.name
              }
              event.direction = nativeEventParams.direction
            }
            break
          case 'onLoadMore':
            if (nativeEventParams) {
              event.name = nativeEventParams.name
              event.isLastLine = nativeEventParams.isLastLine
              event.itemCount = nativeEventParams.itemCount
              event.position = nativeEventParams.position
            }
            break
          default:
            break
        }
        return event
      }
    }
  })
  registerElement('RecyclePool', {
    component: {
      name: 'RecyclePool',
      processEventData(evtData: any, nativeEventParams: any) {
        const { handler: event, __evt: nativeEventName } = evtData
        switch (nativeEventName) {
          case 'onCreateHolder':
            //console.log(`process onCreateHolder nativeEventParams ${JSON.stringify(nativeEventParams)}`)
            if (nativeEventParams) {
              event.batch = nativeEventParams.batch
              event.hashTag = nativeEventParams.hashTag
              // event.position = nativeEventParams.position;
            }
            break
          case 'onBindHolder':
            if (nativeEventParams) {
              event.batch = nativeEventParams.batch
              event.hashTag = nativeEventParams.hashTag
            }
            //console.log('onBindHolder index', event.hIndex, 'position', event.position)
            break
          case 'onRecycleHolder':
            if (nativeEventParams) {
              event.batch = nativeEventParams.batch
              event.hashTag = nativeEventParams.hashTag
            }
            //console.log('onBindHolder index', event.hIndex, 'position', event.position)
            break
          case 'onBatch':
            if (nativeEventParams) {
              event.createItem = nativeEventParams.createItem
              event.bindItem = nativeEventParams.bindItem
              event.recycleItem = nativeEventParams.recycleItem
              event.hashTag = nativeEventParams.hashTag
            }
            //console.log('onBindHolder index', event.hIndex, 'position', event.position)
            break
        }
        return event
      }
    }
  })
  const QTULViewImpl = defineComponent({
    emits: [
      'item-click',
      'scroll',
      'item-focused',
      'item-attached',
      'item-detached',
      'item-bind',
      'item-unbind',
      'load-more',
      'focus',
      'scroll-state-changed',
      'focus-search-failed',
      'scrollYGreaterReference',
      'scrollYLesserReference'
    ],
    setup(props, context) {
      const viewRef = ref()
      function scrollToIndex(x: number, y: number, animated?: boolean, duration?: number, offset?: number) {
        Native.callUIFunction(viewRef.value, 'scrollToIndex', [x, y, animated, duration, offset])
      }
      function startScroll(data) {
        Native.callUIFunction(viewRef.value, 'startScroll', [data])
      }
      function setSelectChildPosition(position: number, requestFocus: boolean) {
        Native.callUIFunction(viewRef.value, 'setSelectChildPosition', [position, requestFocus])
      }
      function scrollToPositionWithOffset(x: number, y: number, anim: boolean, offset: number, duration: number) {
        Native.callUIFunction(viewRef.value, 'scrollToPositionWithOffset', [y, offset, anim])
      }
      function scrollToPositionWithOffsetInfiniteMode(position: number, offset: number, animated: boolean): void {
        Native.callUIFunction(viewRef.value, 'scrollToPositionWithOffsetInfiniteMode', [position, offset, animated])
      }
      function scrollToPosition(index: number) {
        Native.callUIFunction(viewRef.value, 'scrollToPosition', [index])
      }
      function destroy() {
        Native.callUIFunction(viewRef.value, 'destroy', [])
      }
      function recycle(): void {
        Native.callUIFunction(viewRef.value, 'recycle', [])
      }
      function scrollToTop() {
        Native.callUIFunction(viewRef.value, 'scrollToTop', [])
      }
      function scrollToFocus(position: number, scrollOffset: number, delay: number, target: string): void {
        Native.callUIFunction(viewRef.value, 'scrollToFocus', [position, scrollOffset, delay, target])
      }
      function prepareForRecycle() {
        Native.callUIFunction(viewRef.value, 'prepareForRecycle', [])
      }
      function setDisplay(value: boolean) {
        Native.callUIFunction(viewRef.value, 'setDisplay', [value])
      }
      function changeDisplayState(display: string, autoDataState: any) {
        Native.callUIFunction(viewRef.value, 'changeDisplayState', [display, autoDataState])
      }
      function notifySaveInstance() {
        Native.callUIFunction(viewRef.value, 'notifySaveInstance', [])
      }
      function dispatchItemFunction(position: number, name: string, funcName: string, params: ESListViewItemFunctionParams) {
        Native.callUIFunction(viewRef.value, 'dispatchItemFunction', [position, name, funcName, params])
      }
      function clearPostTask() {
        Native.callUIFunction(viewRef.value, 'clearAllPostTask', [])
      }
      function clearPostTaskByCate(data: Array<number>): void {
        Native.callUIFunction(viewRef.value, 'clearPostTaskByCate', [data])
      }
      function clearData(): void {
        Native.callUIFunction(viewRef.value, 'clearData', [])
      }
      function pausePostTask() {
        Native.callUIFunction(viewRef.value, 'pausePostTask', [])
      }
      function resumePostTask() {
        Native.callUIFunction(viewRef.value, 'resumePostTask', [])
      }
      function requestLayoutManual(): void {
        Native.callUIFunction(viewRef.value, 'requestLayoutManual', [])
      }
      function setSpanCount(count: number) {
        Native.callUIFunction(viewRef.value, 'setSpanCount', [count])
      }
      function searchReplaceItem(id: string, item: ESListViewItem): void {
        Native.callUIFunction(viewRef.value, 'searchReplaceItem', [])
      }
      function setCustomStateEnableOnFocus(id: string, params: Array<Array<string>>): void {
        Native.callUIFunction(viewRef.value, 'setCustomStateEnableOnFocus', [id, params])
      }
      function setItemCustomState(position: number, stateName: string, stateValue: boolean) {
        Native.callUIFunction(viewRef.value, 'setItemCustomState', [position, stateName, stateValue])
      }
      function dispatchItemFunctionWithPromise(
        position: number,
        targetName: string,
        functionTargetName: string,
        params: Array<Record<string, any>>
      ): Promise<Record<string, any>> {
        return Native.callNativeWithPromise(viewRef.value, 'dispatchItemFunctionWithPromise', [
          position,
          targetName,
          functionTargetName,
          params
        ])
      }
      function getScrollOffset(callback: () => void) {
        Native.callUIFunction(viewRef.value, 'getScrollOffset', [], callback)
      }
      //----------------------------------------------------------------------------------------
      //########################################################################################
      //########################################################################################
      //########################################################################################
      //----------------------------------------------------------------------------------------
      function setInitPosition(position: number) {
        Native.callUIFunction(viewRef.value, 'setInitPosition', [position])
      }
      function dispatchTVItemFunction(id: number | string, name: string, funcName: string, params: ESListViewItemFunctionParams) {
        Native.callUIFunction(viewRef.value, 'dispatchTVItemFunction', [id, name, funcName, params])
      }
      function scrollToPositionOffset(x: number, y: number, anim: boolean, offset: number, duration: number) {
        Native.callUIFunction(viewRef.value, 'scrollToPositionWithOffset', [y, offset, anim])
      }
      function notifyRestoreInstance() {
        Native.callUIFunction(viewRef.value, 'notifyRestoreInstance', [])
      }
      function setSelectPosition(position: number, requestFocus: boolean) {
        Native.callUIFunction(viewRef.value, 'setSelectChildPosition', [position, requestFocus])
      }
      function requestFocus(position: number) {
        Native.callUIFunction(viewRef.value, 'requestChildFocus', [position])
      }
      function clearFocus() {
        Native.callUIFunction(viewRef.value, 'clearFocus', [])
      }
      function blockRootFocus() {
        Native.callUIFunction(viewRef.value, 'blockRootFocus', [])
      }
      function unBlockRootFocus() {
        Native.callUIFunction(viewRef.value, 'unBlockRootFocus', [])
      }
      function hasFocus(callback: (res) => void) {
        Native.callUIFunction(viewRef.value, 'hasFocus', (res) => {
          callback(res)
        })
      }
      function setBlockFocusDirectionsOnFail(data: Array<ESDirections>) {
        Native.callUIFunction(viewRef.value, 'setBlockFocusDirectionsOnFail', [data])
      }
      function setBackgroundColor(color: string) {
        Native.callUIFunction(viewRef.value, 'setBackgroundColor', [color])
      }
      function setAutoFocus(tag: string, delay: number) {
        Native.callUIFunction(viewRef.value, 'setAutoFocus', [tag, delay])
      }
      const holders  = reactive<any[]>([])
      let isReduce = ref(false)
      watch(() => props.data, (hs) => {
        isReduce.value = false
        const currentArrOLd = JSON.parse(JSON.stringify(hs))
        const currentArrNew = toRaw(currentArrOLd)
        console.log(currentArrNew.length, holders.length,'333333333333')
        if(currentArrNew.length < 1){ // 数据清空 清空holedes保持数据同步
          holders.splice(0)
        }
        if(currentArrNew.length < holders.length){ // 新增数据少于原始数据做减法处理
          isReduce.value = true
          console.log(holders,'333333333333')
          holders.splice(currentArrNew.length)
          holders.map((item, index) => {
            item.position = index
            return item
          })
          console.log(holders,'333333333333')
        }
        Native.callUIFunction(viewRef.value, 'setListDataWithParams', [currentArrNew, false,false,{
          RealDOMTypes:[1,2]
        }]);
      }, { deep: true })
      function extractNum(input: string): number {
        // 找到最后一个 '-' 的位置
        const lastDashIndex = input.lastIndexOf('-')
        // 如果未找到 '-'，返回 -1
        if (lastDashIndex === -1) {
          return -1
        }
        // 提取 '-' 之后的子字符串
        const value = input.slice(lastDashIndex + 1)
        // 尝试将提取的字符串转换为数字
        const numberValue = Number(value)
        // 检查是否为有效数字，返回 -1 如果无效
        return isNaN(numberValue) ? -1 : numberValue
      }
      function crateH(batch: [], hashTag: string) {
        console.log('++createHolder', batch.length, 'hashTag', hashTag)
        // let {batch ,hashTag} = evt
        const list = [...(Array.isArray(batch) ? batch : [batch])]
        console.log(holders.length, list, '1333333333333')
        for (let i = 0; i < list.length; i++) {
          console.log('++createHolder list[i]:', list[i])
          const { itemType, position } = list[i]
          if (isReduce.value) {
            holders[position].itemType = itemType
            holders[position].sid = `hd-${hashTag}-${position}}`
          } else {
            holders.push({
              itemType: itemType,
              sid: -1,
              position: position
            })
            holders[holders.length - 1].sid = `hd-${hashTag}-${holders.length - 1}`
          }
        }
        //children.push(h(type, params))
      }
      function bindH(batch: []) {
        console.log('++bindHolder', batch)
        // let {batch } = params
        const list = [...(Array.isArray(batch) ? batch : [batch])]
        console.log(holders.length, list, '2333333333333')
        for (let i = 0; i < list.length; i++) {
          const { position, sid } = list[i]
          const hIndex = extractNum(sid)
          if (hIndex != -1 && holders[hIndex]) {
            console.log('--bindHolder', `position:${position}, childIndex:${hIndex} holder:${holders[hIndex]}-sid:${sid}`)
            holders[hIndex].position = position
          }
        }
      }
      function handleBatch(params: any) {
        console.log('batchbatch1','++handleBatch',params)
        const { createItem, bindItem, recycleItem, hashTag } = params
        // Native.callUIFunction(viewRef.value, 'notifyBatchStart', [hashTag]);
        // if(recycleItem){
        //   recycleH(recycleItem)
        // }
        if (createItem) {
          console.log('batchbatch2','++createHolder',createItem)
          crateH(createItem, hashTag)
        }
        if (bindItem) {
          console.log('batchbatch2', '++bindHolder', bindItem)
          bindH(bindItem)
        }
        // nextTick(() => {
        //   Native.callUIFunction(viewRef.value, 'notifyBatchEnd', []);
        // })
      }
      function recycleH(batch: []) {
        console.log('++recycleH', batch)
        // let {batch} = params
        const list = [...(Array.isArray(batch) ? batch : [batch])]
        for (let i = 0; i < list.length; i++) {
          const { sid } = list[i]
          const hIndex = extractNum(sid)
          if (hIndex != -1 && holders[hIndex]) {
            console.log('--recycleHolder', `childIndex:${hIndex} holder:${holders[hIndex]}-sid:${sid}`)
            holders[hIndex].position = -1
          }
        }
      }
      onMounted(() => {})
      const renderItems = (hd) => {
        return [
          renderSlot(context.slots, 'default', {
            index: hd.position,
            item: props.data ? props.data[hd.position] : {}
          })
        ]
      }
      const renderHolders = (holders) => {
        console.log('holders called ', `holderCount:${holders.length}`)
        const children = holders.map((hd: any, index: number) => {
          // console.log('holders called ', `index:${index} position:${hd.position},holderCount:${holders.length},sid:${hd.sid}`)
          // console.log('holders called ', `index:${index} item:${JSON.stringify(listData[hd.position])}`)
          return h(
            'FastItemView',
            {
              key: hd.sid,
              sid: hd.sid,
              type: hd.itemType
            },
            renderItems(hd)
          )
        })
        nextTick(() => {
          nextTick(() => {
            Native.callUIFunction(viewRef.value, 'notifyBatchEnd', [])
          })
        })
        return children
      }
      context.expose({
        viewRef,
        scrollToIndex,
        startScroll,
        setSelectChildPosition,
        scrollToPositionWithOffset,
        scrollToPositionWithOffsetInfiniteMode,
        scrollToPosition,
        destroy,
        recycle,
        scrollToTop,
        scrollToFocus,
        prepareForRecycle,
        setDisplay,
        changeDisplayState,
        notifySaveInstance,
        dispatchItemFunction,
        clearPostTask,
        clearPostTaskByCate,
        clearData,
        pausePostTask,
        resumePostTask,
        requestLayoutManual,
        setSpanCount,
        searchReplaceItem,
        setCustomStateEnableOnFocus,
        setItemCustomState,
        dispatchItemFunctionWithPromise,
        getScrollOffset,
        setInitPosition,
        dispatchTVItemFunction,
        scrollToPositionOffset,
        notifyRestoreInstance,
        setSelectPosition,
        requestFocus,
        clearFocus,
        blockRootFocus,
        unBlockRootFocus,
        hasFocus,
        setBlockFocusDirectionsOnFail,
        setBackgroundColor,
        setAutoFocus
      })
      return () => {
        nextTick(() => {
          console.log('tv-list render end ')
        })
        const defaultSlot = context.slots.default
          ? h(
              'RecyclePool',
              {
                onCreateHolder: (evt: any) => {
                  //crateH(evt)
                },
                onBindHolder: (evt: any) => {
                  //bindH(evt)
                },
                onRecycleHolder: (evt: any) => {
                  //recycleH(evt)
                },
                onBatch: (evt: any) => {
                  handleBatch(evt)
                }
              },
              renderHolders(holders)
            )
          : []
        return h(
          'FastListView',
          {
            ref: viewRef,
            disableVirtualDOM: props.disableVirtualDOM,
            onItemClick: (evt) => {
              context.emit('item-click', evt)
            },
            onScroll: (evt) => {
              context.emit('scroll', evt)
            },
            onItemFocused: (evt) => {
              context.emit('item-focused', evt)
            },
            onAttachedToWindow: (evt) => {
              context.emit('item-attached', evt)
            },
            onDetachedFromWindow: (evt) => {
              context.emit('item-detached', evt)
            },
            onBindItem: (evt) => {
              context.emit('item-bind', evt)
            },
            onUnbindItem: (evt) => {
              context.emit('item-unbind', evt)
            },
            onLoadMore: (evt) => {
              context.emit('load-more', evt)
            },
            onScrollStateChanged: (evt) => {
              context.emit('scroll-state-changed', evt)
            },
            onFocusSearchFailed: (evt) => {
              context.emit('focus-search-failed', evt)
            },
            onScrollYGreaterReference: (evt) => {
              context.emit('scrollYGreaterReference', evt)
            },
            onScrollYLesserReference: (evt) => {
              context.emit('scrollYLesserReference', evt)
            }
            // onCreateHolder:(evt:any)=>{
            //   //crateH(evt)
            // },
            // onBindHolder:(evt:any)=>{
            //   //bindH(evt)
            // },
          },
          [defaultSlot]
        )
      }
    },
    props: {
      data: {
        type: Array,
        default: () => []
      },
      disableVirtualDOM: {
        type: Boolean,
        default: true
      }
    }
  })
  app.component('qt-ul', QTULViewImpl)
}

export const MYComponent = (Vue) => {
  registerQTULViewComponent(Vue)
}
