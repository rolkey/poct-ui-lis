import modal from '@/plugins/modal';
import tab from '@/plugins/tab';
import download from '@/plugins/download';
import auth from '@/plugins/auth';
import cache from '@/plugins/cache';
import animate from '@/animate';
import { useDict } from '@/utils/dict';
import { handleTree, addDateRange, selectDictLabel, selectDictLabels, parseTime } from '@/utils/ruoyi';
import { getConfigKey, updateConfigByKey } from '@/api/system/config';
import { download as rd } from '@/utils/request';
import type { LanguageType } from '@/lang';
import type { ComponentInternalInstance } from 'vue';

export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $modal: typeof modal;
    $tab: typeof tab;
    $download: typeof download;
    $auth: typeof auth;
    $cache: typeof cache;
    animate: typeof animate;
    useDict: typeof useDict;
    addDateRange: typeof addDateRange;
    download: typeof rd;
    handleTree: typeof handleTree;
    getConfigKey: typeof getConfigKey;
    updateConfigByKey: typeof updateConfigByKey;
    selectDictLabel: typeof selectDictLabel;
    selectDictLabels: typeof selectDictLabels;
    parseTime: typeof parseTime;
  }

  interface ComponentInternalInstance {
    $modal: typeof modal;
    $tab: typeof tab;
    animate: typeof animate;
  }
}

export type ObjKeysToUnion<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T]: ObjKeysToUnion<T[K], P extends '' ? `${K & string}` : `${P}.${K & string}`>;
    }[keyof T]
  : P;
