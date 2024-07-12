import { QTListViewItem } from '@quicktvui/quicktvui3';
import { IrankingTabItem } from '../../api/ranking/types';

/**
 * tab栏数据转换函数
 */
export const transRankingTabList = (arr:IrankingTabItem[]):QTListViewItem[] => {
  return arr.map(item => {
    return { text: item.text, type: 1, decoration: { right: 0 } }
  })
}