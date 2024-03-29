import {
    QTINavBar,
    QTNavBarItemType,
    QTIListView, QTListViewItem, QTPoster, QTGridViewItem
} from '@quicktvui/quicktvui3';
import { IHistoryContentEntity, IHistoryFilterEntity, IHistoryMenuEntity } from 'src/api/history/modelEntity';

export const getMenuList = (menuList: IHistoryMenuEntity[] = []) => {
    return menuList.map((item, index) => {
        return {
            type: item.type, //(index % 3) + 1,
            showName: item.name,
            normalImg: item.img, //'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
            selectedImg: item.selectedImg, //'http://qcloudimg.a311.ottcn.com/data_center/files/2023/11/02/2ba8e63e-c29f-48f8-9955-02229c78ec85.jpg',
            focusedImg: item.focusedImg //'http://qcloudimg.a311.ottcn.com/data_center/files/2024/01/15/bccb38a7-5f1a-4228-9901-91f77a96bbe7.jpg?imageMogr2/interlace/0|imageMogr2/gravity/center/crop/336x198'
        }
    })
}

export const getFilterList = (data: IHistoryFilterEntity[] = []) => {
    return data.map(item => {
        return {
            type: QTNavBarItemType.QT_NAV_BAR_ITEM_TYPE_TEXT,
            text: item.name,
            titleSize: 20,
            decoration: {
                left: 40,
                right: 20,
            }
        }
    })
}

export const getContentCategoryConfig = (aConfig, data: IHistoryContentEntity): QTPoster => {
    const { width, height, left } = aConfig
    return {
        _key: data.id,
        type: data.type||1001,
        assetTitle: data.h_modeName,//'今天',//i < 10 ? '今天' : (i < 20 ? '一周内' : '更早'),
        decoration: {
            left,
            bottom: 20
        },
        shimmer: {
            enable: true,
        },
        ripple: {
            enable: true,
            style: {
                right: 0,
                bottom: 0,
                marginRight: -12,
            }
        },
        style: {
            width,
            height,
        }
    }
}
const imgSrc = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750'

const contentWidth = 1570
const left = 20
const dWidth = 340
const dHeight = 200
const bottomNum = 120
const getContentItemConfig = (aConfig, data: IHistoryContentEntity): QTPoster => {
    const { width, height, left } = aConfig
    let subTitle = data.subTitle||''
    try {
        if(!subTitle && data.playCount){
            subTitle = data.playCount
            if(!isNaN(Number(data.playCount))){
                subTitle = `观看至${data.playCount}集`
            }
            let progress = (((data.currentPlayTime||0)/(data.allTime||1)) * 100) + '%'
            if(Number(data.currentPlayTime)<=0){
                progress = '不足1%'
            }
            subTitle += ' ' + progress
        }
    } catch (error) {
        
    }
    return {
        _key: data.id,
        metaId: data.metaId,
        type: 10001,
        decoration: {
            left,
            bottom: bottomNum
        },
        title: {
            text: data.assetLongTitle,
            enable: true,
            style: {
                width,
            }
        },
        subTitle: {
            text: subTitle,//`观看至1集 不足1%`,
            enable: true,
            style: {
                width
            }
        },
        floatTitle: {
            text: data.description1||'',
            enable: true,
            style: {
                width,
            },
            background: { colors: ['#e5000000', '#00000000'], orientation: 4 }
        },
        shimmer: {
            enable: true,
        },
        ripple: {
            enable: true,
            style: {
                right: 0,
                bottom: 0,
                marginRight: -12,
            }
        },
        image: {
            src: data.assetLongCoverH,
            enable: true,
            style: {
                width,
                height
            }
        },
        style: {
            width,
            height
        },
        titleStyle: {
            width,
            height: 120,
            marginTop: height - 60
        },
        titleFocusStyle: {
            width,
            marginTop: height - 60
        },
        focusTitle: {
            text: data.assetLongTitle,
            enable: true,
            style: {
                width,
                height: 120
            }
        }
    }
}
// const getContentItemConfig = (aConfig, data: IcontentItem): object => {
//     const { width, height, left } = aConfig
//     return {
//         _key: data.id,
//         type: 10001,
//         title: {
//             text: data.assetLongTitle,
//             style: {
//                 width
//             }
//         },
//         subTitle: {
//             text: `观看至1集 不足1%`,
//             style: {
//                 width
//             }
//         },
//         floatTitle: {
//             text: data.description1,
//             style: {
//                 width,
//             },
//         },
//         image: {
//             src: data.assetLongCoverH,
//             enable: true,
//             style: {
//                 width,
//                 height
//             }
//         }
//     }
// }

export const getContentList = (dataList: any[] = [], splitNum = 4, itemHeight:number) => {
    const width = Math.floor(contentWidth / splitNum) - (left * 2);
    const ratio = width / dWidth
    const height = itemHeight || Math.min(Math.floor(dHeight * ratio), 350)
    const rows = Math.ceil(dataList.length / splitNum)
    const rowsHeight = height + bottomNum
    const dataHeight = rows * rowsHeight

    // const categorys = ['今天', '一周内', '更早']
    const arr: Array<QTGridViewItem> = []
    for (let i = 0; i < dataList.length; i++) {
        const dataItem = dataList[i]
        const isCategory = false//i % 10 === 0;
        let poster: any = null
        if (isCategory) {
            poster = getContentCategoryConfig({ width, height, left }, {...dataItem,h_modeName:'今天'})
        } else {
            poster = getContentItemConfig({ width, height, left }, dataItem)
        }
        arr.push(poster)
    }
    return { arr, dataHeight }
}

// 对象深度合并
export const hw_deepMergeObj = (...objects) => {
    const result = {};
    for (const obj of objects) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // 如果值是对象，则递归合并
                    result[key] = hw_deepMergeObj(result[key] || {}, obj[key]);
                } else {
                    // 如果值不是对象，直接赋值
                    result[key] = obj[key];
                }
            }
        }
    }
    return result;
}