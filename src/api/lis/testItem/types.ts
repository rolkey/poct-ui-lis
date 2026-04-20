export interface TestItemVO {
  /**
   * 项目代码
   */
  testItemId: string;

  /**
   * 项目代码
   */
  testItemCode: string;

  /**
   * 排序号
   */
  testItemSort: string;

  /**
   * 中文名称
   */
  chineseName: string;

  /**
   * 中文简称
   */
  chineseShortName: string;

  /**
   * 英文名称
   */
  englishName: string;

  /**
   * 英文简称
   */
  englishShortName: string;

  /**
   * 标准代码
   */
  standardId: string | number;

  /**
   * HIS代码（HIS关联码）
   */
  hisId: string | number;

  /**
   * 老系统代码
   */
  lisId: string | number;

  /**
   * 医保代码
   */
  medicalId: string | number;

  /**
   * 项目类型:计算类、非计算类
   */
  testItemType: string;

  /**
   * 项目分类（按检验科室分类）
   */
  testItemClass: string;

  /**
   * 计算公式
   */
  expressions: string;

  /**
   * 收费金额
   */
  testItemCharge: number;

  /**
   * 单位
   */
  testItemUnit: string;

  /**
   * 结果精度（小数点保留）
   */
  testItemPrecision: string;

  /**
   * 项目系数
   */
  modulus: string;

  /**
   * 相关方程
   */
  correlativeEquation: string;

  /**
   * 显示类型
   */
  displayType: string;

  /**
   * 对照Key
   */
  correspondKey: string;

  /**
   * 操作规程文件
   */
  regulationFile: string;

  /**
   * 知识库文件
   */
  repositoryFile: string;

  /**
   * 检验方法
   */
  testMethod: string;

  /**
   * 试剂用量
   */
  reagentDosage: number;

  /**
   * 自定义码
   */
  customCode: string;

  /**
   * 拼音码
   */
  spellCode: string;

  /**
   * 五笔码
   */
  strokeCode: string;

  /**
   * 状态
   */
  stateFlag: string;

  /**
   * 标准名称
   */
  standardName: string;

  /**
   * 项目总分类
   */
  testItemTotalClass: string;

  /**
   * 体检关联码
   */
  pesId: string | number;
}

export interface TestItemForm extends BaseEntity {
  /**
   * 项目代码
   */
  testItemId: string;

  /**
   * 项目代码
   */
  testItemCode?: string;

  /**
   * 排序号
   */
  testItemSort?: string;

  /**
   * 中文名称
   */
  chineseName?: string;

  /**
   * 中文简称
   */
  chineseShortName?: string;

  /**
   * 英文名称
   */
  englishName?: string;

  /**
   * 英文简称
   */
  englishShortName?: string;

  /**
   * 标准代码
   */
  standardId?: string | number;

  /**
   * HIS代码（HIS关联码）
   */
  hisId?: string | number;

  /**
   * 老系统代码
   */
  lisId?: string | number;

  /**
   * 医保代码
   */
  medicalId?: string | number;

  /**
   * 项目类型:计算类、非计算类
   */
  testItemType?: string;

  /**
   * 项目分类（按检验科室分类）
   */
  testItemClass?: string;

  /**
   * 计算公式
   */
  expressions?: string;

  /**
   * 收费金额
   */
  testItemCharge?: number;

  /**
   * 单位
   */
  testItemUnit?: string;

  /**
   * 结果精度（小数点保留）
   */
  testItemPrecision?: string;

  /**
   * 项目系数
   */
  modulus?: string;

  /**
   * 相关方程
   */
  correlativeEquation?: string;

  /**
   * 显示类型
   */
  displayType?: string;

  /**
   * 对照Key
   */
  correspondKey?: string;

  /**
   * 操作规程文件
   */
  regulationFile?: string;

  /**
   * 知识库文件
   */
  repositoryFile?: string;

  /**
   * 检验方法
   */
  testMethod?: string;

  /**
   * 试剂用量
   */
  reagentDosage?: number;

  /**
   * 自定义码
   */
  customCode?: string;

  /**
   * 拼音码
   */
  spellCode?: string;

  /**
   * 五笔码
   */
  strokeCode?: string;

  /**
   * 状态
   */
  stateFlag?: string;

  /**
   * 标准名称
   */
  standardName?: string;

  /**
   * 项目总分类
   */
  testItemTotalClass?: string;

  /**
   * 体检关联码
   */
  pesId?: string | number;
}

export interface TestItemQuery extends PageQuery {
  /**
   * 项目代码
   */
  testItemId: string;

  /**
   * 项目代码
   */
  testItemCode?: string;

  /**
   * 排序号
   */
  testItemSort?: string;

  /**
   * 中文名称
   */
  chineseName?: string;

  /**
   * 中文简称
   */
  chineseShortName?: string;

  /**
   * 英文名称
   */
  englishName?: string;

  /**
   * 英文简称
   */
  englishShortName?: string;

  /**
   * 标准代码
   */
  standardId?: string | number;

  /**
   * HIS代码（HIS关联码）
   */
  hisId?: string | number;

  /**
   * 老系统代码
   */
  lisId?: string | number;

  /**
   * 医保代码
   */
  medicalId?: string | number;

  /**
   * 项目类型:计算类、非计算类
   */
  testItemType?: string;

  /**
   * 项目分类（按检验科室分类）
   */
  testItemClass?: string;

  /**
   * 计算公式
   */
  expressions?: string;

  /**
   * 收费金额
   */
  testItemCharge?: number;

  /**
   * 单位
   */
  testItemUnit?: string;

  /**
   * 结果精度（小数点保留）
   */
  testItemPrecision?: string;

  /**
   * 项目系数
   */
  modulus?: string;

  /**
   * 相关方程
   */
  correlativeEquation?: string;

  /**
   * 显示类型
   */
  displayType?: string;

  /**
   * 对照Key
   */
  correspondKey?: string;

  /**
   * 操作规程文件
   */
  regulationFile?: string;

  /**
   * 知识库文件
   */
  repositoryFile?: string;

  /**
   * 检验方法
   */
  testMethod?: string;

  /**
   * 试剂用量
   */
  reagentDosage?: number;

  /**
   * 自定义码
   */
  customCode?: string;

  /**
   * 拼音码
   */
  spellCode?: string;

  /**
   * 五笔码
   */
  strokeCode?: string;

  /**
   * 状态
   */
  stateFlag?: string;

  /**
   * 标准名称
   */
  standardName?: string;

  /**
   * 项目总分类
   */
  testItemTotalClass?: string;

  /**
   * 体检关联码
   */
  pesId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}
