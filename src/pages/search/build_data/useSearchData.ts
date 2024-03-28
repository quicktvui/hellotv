import {
    QTPoster, QTITab, QTTab, QTTabEventParams, QTTabItem, QTTabPageData, QTTabPageState, QTWaterfallItem,
    QTListViewItem,
    QTWaterfallSection, QTWaterfallSectionType
} from "@quicktvui/quicktvui3";
import { SearchCenter } from "./impl/SearchCenter"

export function buildLongItemList(sectionId: string, grid: number): Array<QTWaterfallItem> {
    let data: Array<QTWaterfallItem> = []
    let imgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'
    for (let i = 0; i < 12; i++) {
        const poster = {
            _id: sectionId + '_' + i,
            focus: {
                enable: true,
                scale: 1.1,
                border: false
            },
            style: {
                width: 556,
                height: 335
            },
            width: 556,
            height: 335,
            size: [556, 335],
            layout: [0, 0, 556, 335],
            description1: '长视频的描述长视频的描述长视频的描述长视频的描述',
            description2: '长视频的描述长视频的描述长视频的描述长视频的描述',
            poster: imgURL,
            isShowCornerContent: true,
            cornerContent: 'vip',
            score: '9.9',
            title: '长视频集合',
            isScore: true,
            type: 666,
            decoration: {
                left: i % grid == 0 ? 90 : 40,
                bottom: 40
            },
        }
        data.push(poster)
    }
    return data;
}

export function buildEndSection(sectionId: string): QTWaterfallSection {
    let section: QTWaterfallSection = {
        _id: sectionId,
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
        title: '已经到底啦，按【返回键】回到顶部',
        style: {
            width: 1920,
            height: 200,
        },
        titleStyle: {
            fontSize: 30
        },
        itemList: []
    }
    return section
}

export function buildTabPageEndData(): QTTabPageData {
    const endSection = buildEndSection('5');
    const tabPage: QTTabPageData = {
        useDiff: false,
        disableScrollOnFirstScreen: true,
        data: [endSection]
    }
    return tabPage
}

// 构建 hotsearch 数据
export function buildSearchCenterListData(data: Array<any>, isHistoryList: boolean): SearchCenter {
    let centerData: SearchCenter
    let list: Array<QTListViewItem> = []
    data.map(item => list.push({ text: item.vod_name, type: 1, decoration: { bottom: 12 } }))
    centerData = {
        isHistoryList,
        list
    }
    return centerData
}

// 构建搜索结果 tablist 数据
export function buildSearchResultTabListData(data: Array<any>): Array<QTTabItem> {
    let tabList: Array<QTTabItem> = []
    data.map(item => tabList.push(item))
    return tabList
}

// 构建搜索结果 tablist 数据
export function buildSearchResultPageData(pageNo: number, searchResultPageData: Array<any>, title?: string): QTTabPageData {
    let section: QTWaterfallSection = {
        _id: pageNo + '', // 为处理寻焦字段
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
        title: title,
        titleStyle: title != '' ? { width: 1920, height: 65, marginTop: 45, marginBottom: 20, marginLeft: 90 } : { width: 1920, height: 0 },
        style: {
            width: 1920,
            height: -1,
        },
        decoration: {
            top: pageNo == 0 && title != '' ? 200 : pageNo == 0 && title == '' ? 250 : 35,
            left: 0,
        },
        itemList: buildSearchResultPosterItem(6, searchResultPageData)
    }
    let tabPage: QTTabPageData = {
        useDiff: false,
        data: [section]
    }
    return tabPage
}

export function buildSearchResultPosterItem(grid: number, itemList: any): Array<QTWaterfallItem> {
    let data: Array<QTWaterfallItem> = []
    for (let i = 0; i < itemList.length; i++) {
        let el = itemList[i]
        const poster: QTPoster = {
            _id: i + '',
            focus: {
                enable: true,
                scale: 1.03,
                border: false
            },
            type: 10001,
            decoration: {
                left: i % grid == 0 ? 60 : 40,
                bottom: 40
            },
            title: {
                text: el.vod_name,
                enable: true,
                style: {
                    width: 270,
                }
            },
            focusTitle: {
                text: el.vod_name,
                enable: true,
                style: {
                    width: 270,
                }
            },
            subTitle: {
                text: '',
                enable: false,
            },
            floatTitle: {
                text: '浮动标题',
                enable: false,
                style: {
                    width: 270,
                },
                background: { colors: ['#e5000000', '#00000000'], orientation: 4 }
            },
            shimmer: {
                enable: false,
            },
            ripple: {
                enable: false,
                style: {
                    right: 0,
                    bottom: 0,
                    marginRight: -12,
                }
            },
            image: {
                src: el.vod_pic,
                enable: true,
                style: {
                    width: 270,
                    height: 377
                }
            },
            corner: {
                text: '角标' + i,
                enable: false,
                style: {
                    width: 260,
                    height: 30
                },
                background: {
                    colors: ['#A06419', '#CDA048'],
                    cornerRadii4: [0, 8, 0, 8],
                    orientation: 2
                }
            },
            style: {
                width: 270,
                height: 437,
            },
            titleStyle: {
                width: 270,
                height: 120,
                marginTop: 437 - 120
            },
            titleFocusStyle: { width: 270, marginTop: 437 - 135 },
            item: el
        }
        data.push(poster)
    }
    return data;
}
