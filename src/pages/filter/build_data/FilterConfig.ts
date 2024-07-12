//是否展示顶部按钮
const isShowTopViewTag = true
//是否展示左侧列表
const isShowLeftListTag = true

export default {
  screenPageSize: 300,
  //是否展示顶部按钮
  isShowTopView:isShowTopViewTag,
  //是否展示左侧列表
  isShowLeftList:isShowLeftListTag,
  //左侧列表宽度
  leftListWidth:360,
  //左侧列表默认高度
  leftListHeight:960,
  //左侧列表子View默认高度
  leftItemHeight:106,
  //右侧列表默认宽度
  rightContentWidth:1580,
  //右侧列表默认高度
  rightContentHeight:960,
  //筛选条件高度
  filterTextHeight:60,
  //筛选条件记录高度
  filterRecordHeight:60,
  //筛选结果子View宽度
  contentItemWidth:260,
  //筛选结果子View的高度
  contentItemHeight:422,
  //筛选结果子View图片高度
  contentItemImgHeight:368,
  //筛选内容一行个数
  spanVCount: isShowLeftListTag ? 5 : 6,
  spanHCount: isShowLeftListTag ? 4 : 5
}
