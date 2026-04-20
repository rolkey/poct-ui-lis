export interface InspectionGroupVO {
  /**
   * 分组ID
   */
  groupId: string;

  /**
   * 分组代码
   */
  groupCode: string;

  /**
   * 排序号
   */
  groupSort: string;

  /**
   * 分组名称
   */
  groupName: string;

  /**
   * 检验科室
   */
  inspectionDept: string;

  /**
   * 分组类型
   */
  groupClass: string;

  /**
   * 项目显示格式
   */
  testItemAppend: string;

  /**
   * 项目显示
   */
  itemDisplay: string;

  /**
   * 起诉样本号
   */
  startNo: string;

  /**
   * 开始焦点
   */
  startFocus: string;

  /**
   * 回顾条件设置
   */
  resultReview: string;

  /**
   * 同类分组
   */
  sameGroup: string;

  /**
   * 结果图形类型
   */
  graphFormat: string;

  /**
   * 对应老系统仪器
   */
  graphSwitchFile: string;

  /**
   * 状态
   */
  stateFlag: string;

  /**
   * 默认结果
   */
  defaultResult: string;
}

export interface InspectionGroupForm extends BaseEntity {
  /**
   * 分组ID
   */
  groupId?: string | number;

  /**
   * 分组代码
   */
  groupCode?: string;

  /**
   * 排序号
   */
  groupSort?: string;

  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 检验科室
   */
  inspectionDept?: string;

  /**
   * 分组类型
   */
  groupClass?: string;

  /**
   * 项目显示格式
   */
  testItemAppend?: string;

  /**
   * 项目显示
   */
  itemDisplay?: string;

  /**
   * 起诉样本号
   */
  startNo?: string;

  /**
   * 开始焦点
   */
  startFocus?: string;

  /**
   * 回顾条件设置
   */
  resultReview?: string;

  /**
   * 同类分组
   */
  sameGroup?: string;

  /**
   * 结果图形类型
   */
  graphFormat?: string;

  /**
   * 对应老系统仪器
   */
  graphSwitchFile?: string;

  /**
   * 状态
   */
  stateFlag?: string;

  /**
   * 默认结果
   */
  defaultResult?: string;
}

export interface InspectionGroupQuery extends PageQuery {
  /**
   * 分组代码
   */
  groupCode?: string;

  /**
   * 排序号
   */
  groupSort?: string;

  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 检验科室
   */
  inspectionDept?: string;

  /**
   * 分组类型
   */
  groupClass?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
