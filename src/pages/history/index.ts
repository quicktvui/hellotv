import {
    QTINavBar,
    QTNavBarItemType,
    QTIListView, QTListViewItem, QTPoster, QTGridViewItem
} from '@quicktvui/quicktvui3';

const menuTexts = ['观看历史', '我的收藏', '已购内容', '收藏专区']
export const getMenuList = () => {
    return menuTexts.map(item => {
        return {
            type: QTNavBarItemType.QT_NAV_BAR_ITEM_TYPE_TEXT,
            text: item,
            titleSize: 20,
            decoration: {
                left: 40,
                right: 20,
            }
        }
    })
}

const getContentCategoryConfig = (width:number, height:number, i:number):QTPoster =>{
    return {
        type: 1003,
        assetTitle: i < 10 ? '今天' : (i < 20 ? '一周内' : '更早'),
        decoration: {
            top: 0,
            left: 30,
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
const getContentItemConfig = (width:number, height:number, i:number):QTPoster => {
    return {
        type: 10001,
        decoration: {
            top: 0,
            left: 30,
            bottom: 80
        },
        title: {
            text: '主标题' + i,
            enable: true,
            style: {
                width,
            }
        },
        subTitle: {
            text: '副标题' + i,
            enable: true,
            style: {
                width
            }
        },
        floatTitle: {
            text: '浮动标题',
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
            src: imgSrc,
            enable: true,
            style: {
                width,
                height
            }
        },
        style: {
            width,
            height,
        },
        titleStyle: {
            width,
            height: 120,
            marginTop: height - 60,
        },
        titleFocusStyle: { width: 260, marginTop: height - 100 },
    }
}
export const getContentList = (size = 5) => {
    
    let width = 330
    let height = 200
    const categorys = ['今天', '一周内', '更早']
    const arr: Array<QTGridViewItem> = []
    for (let i = 0; i < size; i++) {
        const isCategory = i % 10 === 0;
        let poster:any = null
        if(isCategory){
            poster = getContentCategoryConfig(width, height, i)
        } else {
            poster = getContentItemConfig(width, height, i)
        }
        arr.push(poster)
    }
    return arr
}