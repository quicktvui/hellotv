## 在config.ts中自定义样式和布局
- 属性/样式
    - layout
        - 布局模式
            - menu左-tag上
            - 右-上
            - 上-右
            - 上-左
    - title
        - 页面标题
    - titleImg
        - 使用图片作为标题
    - menuStyle
        - 菜单样式{color:string, selectedColor:string}
    - menuList
        - 静态菜单数据
    - emptyTxt?
        - 空数据时的图片
    - emptyTxt
        - 空数据文案
    - contentColumn
        - 内容区列数
    - contentItemHeight?
        - 内容区列表海报的高度，不指定时自动根据宽度计算
## 在api/history/index.ts中重写baseApi方法，自定义获取数据的逻辑
    - getMenuList
        - 获取左侧动态菜单数据
    - getFilterTabList
        - 获取筛选条件数据，当返回值为空数组时不展示
    - getContentList
        - 获取内容列表数据
    - deleteContent
        - 删除指定id的数据
    - clearContent
        - 清空内容数据


## ./index.ts
- 242
```ts
// dev-lexue
const width = Math.floor((contentWidth - (30+40)) / options.contentColumn) - (left * 2);
// dev-1.3
titleEllipsizeMode: subTitle?3:2,
titleLines: subTitle?1:2,

const width = Math.floor((contentWidth - left) / options.contentColumn) - (left * 2);
```
- 129
```ts
// dev-lexue
// dev-1.3
titleEllipsizeMode: subTitle?3:2,
titleLines: subTitle?1:2,
```
- 52
```ts
// dev-lexue
const dContentWidth = 1600//1550
// dev-1.3
const dContentWidth = 1570//1550
```
## ./components/HContent.vue
- 47
```vue
<!-- dev-lexue -->
const dContentWidth = 1600
<!-- dev-1.3 -->
const dContentWidth = 1570
```
- 26
```vue
<!-- dev-lexue -->
<!-- <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false" /> -->
<!-- dev-1.3 -->
<qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false" />
```
- 307
```ts
// dev-leuxe
gvNextFocusName.value = {left: 'h_menu_list_name_no'}//up: 'clear_btn_name'
// dev-1.3
gvNextFocusName.value = { 'up': 'clear_btn_name' }
```
- 313
```ts
// dev-leuxe
gvNextFocusName.value = {left: 'h_menu_list_name'}//up: 'h_tab_name'
// dev-1.3
gvNextFocusName.value = {up: 'h_tab_name'}
```
- 408
```css
/* .history-right-content-loading */
/* dev-lexue */
height: 980px;
/* dev-1.3 */
height: 880px;
```
- all
```css
/* dev-lexue */
width: 1600px;
height: 980px;
/* dev-1.3 */
width: 1570px;
height: 880px;
```
## HContentPoster/index.vue
- all
```css
/* dev-lexue */
border-radius: 16px;
/* dev-1.3 */
border-radius: 8px;
```