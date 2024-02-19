import {
    QTTabPageData,
    QTWaterfallSection,
    QTWaterfallSectionType
} from "@quicktvui/quicktvui3";


/**
 * 底部
 */
export function buildEndSection(sectionId: string): QTWaterfallSection {
    let section: QTWaterfallSection = {
        _id: sectionId,
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
        title: '已经到底啦，按【返回键】回到顶部',
        style: {
            width: 1920,
            height: 200,
        },
        titleStyle:{
          fontSize:30
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
