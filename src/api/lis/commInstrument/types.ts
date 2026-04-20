export interface CommInstrumentVO {
  /**
   * 仪器代码
   */
  instrumentId: string;

  /**
   * 仪器名称
   */
  instrumentName: string;

  /**
   * 注册时间
   */
  instrumentKeyDate: string;

  /**
   * 仪器类型
   */
  instrumentType: string;

  /**
   * 接口程序
   */
  interfaceName: string;

  /**
   * 通讯方式
   */
  interfaceType: string;

  /**
   * 端口配置
   */
  instrumentCommport: string;

  /**
   * key
   */
  instrumentKey: string;
}

export interface CommInstrumentForm extends BaseEntity {
  /**
   * 仪器代码
   */
  instrumentId?: string | number;

  /**
   * 仪器名称
   */
  instrumentName?: string;

  /**
   * 注册时间
   */
  instrumentKeyDate?: string;

  /**
   * 仪器类型
   */
  instrumentType?: string;

  /**
   * 接口程序
   */
  interfaceName?: string;

  /**
   * 通讯方式
   */
  interfaceType?: string;

  /**
   * 端口配置
   */
  instrumentCommport?: string;

  /**
   * key
   */
  instrumentKey?: string;
}

export interface CommInstrumentQuery extends PageQuery {
  /**
   * 仪器代码
   */
  instrumentId?: string | number;

  /**
   * 仪器名称
   */
  instrumentName?: string;

  /**
   * 注册时间
   */
  instrumentKeyDate?: string;

  /**
   * 仪器类型
   */
  instrumentType?: string;

  /**
   * 接口程序
   */
  interfaceName?: string;

  /**
   * 通讯方式
   */
  interfaceType?: string;

  /**
   * 端口配置
   */
  instrumentCommport?: string;

  /**
   * key
   */
  instrumentKey?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
