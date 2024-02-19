<template>
  <!-- 背景图 -->
  <waterfall-background ref="wTabBg" />
  <!-- hasSider 和 hasHeader 只负责自动计算高度 插槽和属性需要同时使用 -->
  <ProListPage :hasSider="true" :hasHeader="true">
    <template #header>
      <Header />
    </template>

    <template #sider>
      <Sider ref="siderRef" @onTabChange="onTabChange" />
    </template>

    <template #content>
      <Content ref="contentRef" @onListItemClick="onListItemClick" @onListItemBind="onListItemBind"
        @onFilterChange="onFilterChange" @onPagination="onPagination" />
    </template>
  </ProListPage>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";
import ProListPage from "../../components/ProListPage.vue";
import Sider from "../../components/Sider.vue";
import Content from "../../components/Content.vue";
import Header from "../../components/Header.vue";
import { ref, toRaw } from "vue";
import { QTGridViewItem, QTIListView, QTListViewItem, QTPoster,QTWaterfallItem } from "@quicktvui/quicktvui3";
import WaterfallBackground from "../home/components/waterfall-background.vue";
import { useESToast } from "@extscreen/es3-core";
import { IChannel, ITagGroup, ISortType, ISearchOption, ISearchResponse, ISearchAlbumItem, ICorner } from './api/interface'
import { useRequestManager } from "../../api/UseApi";
// import { channelUrl, cornerUrl, getSearchUrl, sortTypeUrl, tagListUrl } from "../../api/RequestUrl";
// import GlobalStore from "../../api/store/GlobalStore";

export default defineComponent({
  name: 'index',
  components: {
    ProListPage,
    Header,
    Sider,
    Content,
// <<<<<<< HEAD
//   },
//   setup() {
//     const contentRef = ref<InstanceType<typeof Content>>();
//
//     const siderRef = ref<InstanceType<typeof Sider>>();
//
//     const currentTabItem = ref();
//
//     const currentFilter = ref<string[]>(["全部", "全部", "全部", "全部", "全部"]);
//
//     const onESCreate = () => {
//       siderRef.value?.initialize(initSideBarData());
//     }
//
//     const initSideBarData = () => {
//       const titleArray = ["免费电影", "热血战争", "动作先锋", "犯罪现场", "浪漫爱情", "动画电影", "恐怖惊悚", "学习强国", "院线大片", "即将上映", "超前点播"];
//       return titleArray.map(value => ({ value, label: value }));
//     }
//
//     const buildPosterDecorationItemList = () => {
//       let imgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
//       let itemList: Array<QTWaterfallItem> = []
//       for (let i = 1; i <= 4 * 10; i++) {
//         const poster: QTPoster = {
//           _id: i === 1 ? "nextFocusRightSID-tag-1" : i.toString(),
//           type: 10001,
//           decoration: {
//             left: 30,
//             right: 30,
//             top: 30,
//             bottom: 30,
//           },
//           title: {
//             text: [currentTabItem.value?.item.value, ...currentFilter.value].filter(e => ![void 0, "全部"].includes(e)).toString() + ':主标题',
//             enable: true,
//             style: {
//               width: 335,
//             }
//           },
//           focusTitle:{
//             text: [currentTabItem.value?.item.value, ...currentFilter.value].filter(e => ![void 0, "全部"].includes(e)).toString() + ':主标题',
//             enable: true,
//             style: {
//               width: 335,
//             }
//           },
//           subTitle: {
//             text: '副标题',
//             enable: true,
//             style: {
//               width: 335,
// =======
    WaterfallBackground
  },
  setup() {
    const wTabBg = ref()
    const contentRef = ref<InstanceType<typeof Content>>();
    const siderRef = ref<InstanceType<typeof Sider>>();
    const currentTabItem = ref();
    let listProxy: Array<QTListViewItem> | undefined = [];

    // 是是否需要重新init组件
    const currentFilter = ref<string[]>(["全部", "全部", "全部", "全部", "全部"]);
    const tagSearchType = ref<number>();
    const corners: { [key: number]: ICorner } = {}

    const toast = useESToast()
    const request = useRequestManager()

    const getChannels = () => {
      return new Promise((resolve, reject) => {
        // const url = channelUrl.replace('{partnerCode}', GlobalStore.partnerCode)
        // request.fetchWithRetry(url)
        //   .then(resJson => {
        //     resolve(resJson.map((item: IChannel) => ({ value: item.chnId, label: item.chnName })))
        //   })
        //   .catch(err => {
        //     console.log('wang-err', err)
        //     toast.showToast('加载数据失败，稍后重试！')
        //   })
        toast.showToast('稍后重试！')
      })
    }

    const getTags = () => {
      return new Promise((resolve, reject) => {
        // const url = tagListUrl.replace('{partnerCode}', GlobalStore.partnerCode)
        // request.fetchWithRetry(url)
        //   .then((resJson: ITagGroup[]) => {
        //     resolve(resJson.map((item, index) => item.tags.map((tag, itemIndex) => ({ _id: itemIndex, index: itemIndex + 1, source: "filter-tag" + index, value: tag.tagName, label: tag.cpTagId, type: 10087 }))))
        //   })
        //   .catch(err => {
        //     console.log('wang-err', err)
        //     toast.showToast('加载数据失败，稍后重试！')
        //   })
        toast.showToast('稍后重试！')
      })
    }

    const getSortType = () => {
      return new Promise((resolve, reject) => {
        // const url = sortTypeUrl.replace('{partnerCode}', GlobalStore.partnerCode)
        // request.fetchWithRetry(url)
        //   .then((resJson: ISortType[]) => {
        //     resolve(resJson.map((item, index) => ({ _id: index, source: "filter-tag4", index: index + 1, value: item.tagName, label: item.tagSearchType, type: 10087 })))
        //   })
        //   .catch(err => {
        //     console.log('wang-err', err)
        //     toast.showToast('加载数据失败，稍后重试！')
        //   })
        toast.showToast('稍后重试！')
      })
    }

    const getSearch = (option: ISearchOption) => {
      return new Promise((resolve, reject) => {
        // const url = getSearchUrl("", (option.chnId || ''), (option.keyword || ''), (option.initialChar || ''), (option.tags || ''), (option.tagSearchType || ''), (option.pageNo || 1), (option.pageSize || 15), GlobalStore.partnerCode)
        // request.fetchWithRetry(url)
        //   .then((resJson: ISearchResponse) => {
        //     resJson.album.list.map(item => { item.corner = corners[item.superScripts[0]]?.picUrl || '' })
        //     const { pageNo = 1, pageSize = 15 } = option
        //     if (pageNo * pageSize >= resJson.album.total) {
        //       contentRef.value!.gridViewRef!.stopPage();
        //     }
        //     resolve(resJson.album.list)
        //   })
        //   .catch(err => {
        //     contentRef.value!.empty = data.length === 0
        //
        //     console.log('#真的没有了', data.length, err)
        //     console.log('wang-err', err)
        //     // setTimeout(() => {
        //     contentRef.value!.gridViewRef!.stopPage();
        //
        //     const loadComplete: QTGridViewItem =
        //     {
        //       type: 1003,
        //       span: 5,
        //       style: {
        //         height: 80,
        //       },
        //     }
        //     data!.push(loadComplete)
        //     console.log("!@#!@#!@#!@# loadComplete")
        //     contentRef.value!.loading = false;
        //     // }, 401);
        //     // toast.showToast('加载数据失败，稍后重试！')
        //   })

        toast.showToast('稍后重试！')
      })
    }

    const getCorners = () => {
      return new Promise((resolve, reject) => {
        // request.fetchWithRetry(cornerUrl)
        //   .then((resJson: ICorner[]) => {
        //     resolve(resJson.map(item => { corners[item.superscriptId] = item }))
        //   })
        //   .catch(err => {
        //     console.log('wang-err', err)
        //     toast.showToast('加载数据失败，稍后重试！')
        //   })
        toast.showToast('稍后重试！')
      })
    }

    const initFilterData = async () => {
      let tags = await getTags() as any[]
      tags.push(await getSortType())
      tags.forEach((item, index) => item.unshift({ _id: "filter-tag" + index, index: 0, source: "filter-tag" + index, value: '全部', label: '全部', type: 10087 }))
      console.log(tags, "!@#让我看看")
      return tags
    }

    const onESCreate = async () => {
      // await getCorners()
      // wTabBg.value?.setImg(require('../../assets/default_theme/600eeea6a73515e5e0d775a622de8b59.jpg').default, '', true, false)
      siderRef.value?.initialize(await getChannels() as any[]);
    }

    const buildPosterDecorationItemList = (albums: ISearchAlbumItem[]) => {
      const itemList: Array<QTGridViewItem> = []
      for (let i = 1; i <= albums.length; i++) {
        const album = albums[i - 1]
        const poster: QTPoster = {
          _id: i.toString(),
          type: 10001,
          decoration: {
            left: 0,
            right: 0,
            // right: i % 5 === 0 ? 0 : 36,
            top: 40,
            bottom: 0,
          },
          title: {
            text: album.albumName,
            enable: true,
            style: {
              width: 260,
            }
          },
          focusTitle: {
            text: album.albumName,
            enable: true,
            style: {
              ellipsizeMode: 2,
              width: 260,
            }
          },
          subTitle: {
            text: album.focus,
            enable: true,
            style: {
              width: 260,
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
            }
          },
          floatTitle: {
            text: '浮动标题',
// <<<<<<< HEAD
//             enable: true,
//             style: {
//               width: 335,
// =======
            enable: false,
            style: {
              width: 260,
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
            },
            background: { colors: ['#e5000000', '#00000000'], orientation: 4 }
          },
          image: {
// <<<<<<< HEAD
//             src: imgURL,
//             enable: true,
//             style: {
//               width: 335,
//               height: 320
//             }
//           },
//           style: {
//             width: 335,
//             height: 400,
//           },
//           corner: {
//             text: '角标',
//             enable: true,
//             style: {
//               width: 335,
// =======
            src: album.pic,
            enable: true,
            style: {
              width: 260,
              height: 368
            }
          },
          style: {
            width: 260,
            height: 368 + 46,
          },
          corner: {
            text: '角标',
            enable: !true,
            style: {
              width: 260,
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
              height: 30
            },
            background: {
              colors: ['#FE3824', '#F0051E'],
              cornerRadii4: [0, 8, 0, 8],
              orientation: 2
            }
          },
          titleStyle: {
// <<<<<<< HEAD
//             width: 335,
//             height: 120,
//             marginTop: 320 - 60,
//           },
//           titleFocusStyle: { width: 335, marginTop: 320 - 100 },
//           focus: {
//             enable: true,
//             scale: 1.03,
//           },
//         }
//
//         itemList.push(poster);
//       }
//
// =======
            width: 260,
            height: 120,
            marginTop: 368 - 60,
          },
          titleFocusStyle: { width: 260, marginTop: 368 - 100 },
          focus: {
            enable: true,
            scale: 1.03,
          }
        }
        itemList.push(poster);
      }
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
      return itemList;
    }

    let timer: any = null

    let filterTimer: any = null
    let data: QTGridViewItem[] = [];
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
    const onTabChange = async (e) => {
      if (e.item.value === currentTabItem.value?.item.value) {
        return false;
      }

// <<<<<<< HEAD
//       !!timer && clearTimeout(timer);
//       timer = setTimeout(() => {
//         currentTabItem.value = e;
//         contentRef.value?.gridViewRef?.setListData(buildPosterDecorationItemList())
//         contentRef.value?.gridViewRef?.scrollToTop()
// =======
      !!filterTimer && clearTimeout(filterTimer);
      !!timer && clearTimeout(timer);
      timer = setTimeout(async () => {
        currentTabItem.value = e;
        tagSearchType.value = undefined
        currentFilter.value = ["全部", "全部", "全部", "全部", "全部"]

        contentRef.value!.renderFilter = false;
        contentRef.value!.render = false;
        contentRef.value!.loading = true;
        contentRef.value!.empty = false;

        let rerenderTimer: any = null;
        rerenderTimer && clearTimeout(rerenderTimer)
        rerenderTimer = setTimeout(async () => {
          contentRef.value!.render = true;
          if (currentTabItem.value?.item.value === "筛选") {
            contentRef.value!.renderFilter = true;

            const filterData = await initFilterData();
            const filters = filterData.map((list, index, arr) => {
              const filter: QTGridViewItem =
              {
                selection: 0,
                type: 1008611,
                span: 5,
                style: {
                },
                decoration: {
                  left: 0,
                  top: 0
                },
                list,
                // _id: "filter-" + index,
                // nextFocusSID: {
                //   up: index === 0 ? "" : "filter-" + (index - 1),
                //   down: arr.length - 1 !== index ? "" : "filter-" + index + 1,
                // }
              }

              return filter
            });
            listProxy = contentRef.value?.listViewRef?.init(filters)
          }
        }, 300)
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5
      }, 500);
    }

    const onListItemClick = (...rest) => {
      console.log(rest)
    }

    const onListItemBind = (...rest) => {
      console.log(rest)
    }

    const onFilterChange = (e) => {
      const index = Number(e.item.source.replace("filter-tag", ""));
      console.log("###1-1 e.item", e)
      console.log("###1-2", toRaw(currentFilter.value))
      console.log("###1-3", currentFilter.value[index])

      if (e.item.value === currentFilter.value[index]) {
        return false;
      }

      if (e.item.source === "filter-tag4") {
        tagSearchType.value = e.item.label
      }
      if (listProxy) {
        //FIXME
        listProxy[index].selection = e.item.index
      }

      // 这个地方还是要设置的 只是请求延迟了
      currentFilter.value[index] = e.item.value;
      !!filterTimer && clearTimeout(filterTimer);
      filterTimer = setTimeout(() => {
        contentRef.value!.render = false;
        contentRef.value!.loading = true;
        contentRef.value!.empty = false;
        let rerenderTimer: any = null;
        rerenderTimer && clearTimeout(rerenderTimer)
        rerenderTimer = setTimeout(() => {
          contentRef.value!.render = true;
        }, 300)
      }, 500);
    }

    const onPagination = async (pageNo: number) => {
      // 左边分类菜单切换
      const chnId = currentTabItem.value?.item.value === "筛选" ? undefined : currentTabItem.value?.item.value;
      const tags = currentFilter.value.filter((v, index, arr) => v !== "全部" && index !== arr.length - 1).join(",")

      // 接口原始数据
      const albums = await getSearch({ pageNo, chnId, tags, tagSearchType: tagSearchType.value }) as ISearchAlbumItem[];

      console.log('!@#!@#pageNo', pageNo)
      if (pageNo === 1) {
        const gridViewData = buildPosterDecorationItemList(albums);
        data = contentRef.value!.gridViewRef!.init(gridViewData)
      }
      else {
        data!.push(...buildPosterDecorationItemList(albums))
      }

      contentRef.value!.loading = false;
    }
// >>>>>>> 3dca11d7994d00d5912e48c811b4802207e9a3c5

    return {
      onESCreate,
      onTabChange,
      onListItemClick,
      onListItemBind,
      onFilterChange,
      onPagination,
      contentRef,
      siderRef,
      wTabBg
    }
  },
});

</script>
<style lang="css" scoped></style>
