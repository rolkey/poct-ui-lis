<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="仪器" prop="instrumentId">
              <el-select
                v-model="queryParams.instrumentId"
                placeholder="请选择仪器"
                clearable
                filterable
              >
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.instrumentId"
                  :label="item.instrumentName"
                  :value="item.instrumentId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="检验项目" prop="testItemId">
              <el-select
                v-model="queryParams.testItemId"
                placeholder="请选择检验项目"
                clearable
                filterable
              >
                <el-option
                  v-for="item in testItemOptions"
                  :key="item.testItemId"
                  :label="item.chineseName"
                  :value="item.testItemId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="判定结果" prop="judgment">
              <el-select
                v-model="queryParams.judgment"
                placeholder="请选择判定结果"
                clearable
              >
                <el-option label="在控" value="IN_CONTROL" />
                <el-option label="警告" value="WARNING" />
                <el-option label="失控" value="OOC" />
              </el-select>
            </el-form-item>
            <el-form-item label="采集方式" prop="collectionType">
              <el-select
                v-model="queryParams.collectionType"
                placeholder="请选择采集方式"
                clearable
              >
                <el-option label="自动" value="AUTO" />
                <el-option label="手动" value="MANUAL" />
              </el-select>
            </el-form-item>
            <el-form-item label="检测时间" prop="testTime">
              <el-date-picker
                v-model="testTimeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="handleTestTimeChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="flex flex-col flex-1 table-card">
      <template #header>
        <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['lis:qc:execution:add']"
            >手动录入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['lis:qc:execution:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="qcRecordList"
          :height="tableHeight"
        >
          <el-table-column label="记录ID" align="center" prop="recordId" width="80" />
          <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
          <el-table-column label="检验项目" align="center" prop="testItemName" min-width="120" />
          <el-table-column label="批次" align="center" prop="batchNo" width="120" />
          <el-table-column label="测定值" align="center" prop="testValue" width="100">
            <template #default="scope">
              <span class="font-mono">{{ scope.row.testValue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="判定结果" align="center" prop="judgment" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.judgment === 'IN_CONTROL' ? 'success' : scope.row.judgment === 'WARNING' ? 'warning' : 'danger'"
                disable-transitions
              >
                {{ scope.row.judgment === 'IN_CONTROL' ? '在控' : scope.row.judgment === 'WARNING' ? '警告' : '失控' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="触发规则" align="center" prop="triggeredRules" min-width="160" show-overflow-tooltip />
          <el-table-column label="采集方式" align="center" prop="collectionType" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.collectionType === 'AUTO' ? '' : 'primary'" disable-transitions>
                {{ scope.row.collectionType === 'AUTO' ? '自动' : '手动' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作人" align="center" prop="operator" width="100" />
          <el-table-column label="检测时间" align="center" prop="testTime" width="170" />
        </el-table>
      </div>

      <pagination
        ref="paginationRef"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 手动录入质控数据对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body draggable>
      <el-form ref="qcRecordFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器" prop="instrumentId">
              <el-select v-model="form.instrumentId" placeholder="请选择仪器" filterable clearable>
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.instrumentId"
                  :label="item.instrumentName"
                  :value="item.instrumentId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验项目" prop="testItemId">
              <el-select v-model="form.testItemId" placeholder="请选择检验项目" filterable clearable>
                <el-option
                  v-for="item in testItemOptions"
                  :key="item.testItemId"
                  :label="item.chineseName"
                  :value="item.testItemId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="质控批次" prop="batchId">
              <el-select v-model="form.batchId" placeholder="请选择质控批次" filterable clearable>
                <el-option
                  v-for="item in batchOptions"
                  :key="item.batchId"
                  :label="item.lotNo"
                  :value="item.batchId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测定值" prop="testValue">
              <el-input-number v-model="form.testValue" :precision="4" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="form.operator" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测时间" prop="testTime">
              <el-date-picker
                v-model="form.testTime"
                type="datetime"
                placeholder="选择检测时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="QcRecord" lang="ts">
import {
  listQcRecord,
  addQcRecord,
} from "@/api/lis/qcRecord";
import {
  QcRecordVO,
  QcRecordForm,
  QcRecordQuery,
} from "@/api/lis/qcRecord/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";
import { listQcMaterialBatch } from "@/api/lis/qcMaterial";
import { QcMaterialBatchVO } from "@/api/lis/qcMaterial/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const qcRecordList = ref<QcRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const qcRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: QcRecordForm = {
  recordId: undefined,
  instrumentId: undefined,
  testItemId: undefined,
  batchId: undefined,
  testValue: undefined,
  collectionType: "MANUAL",
  operator: undefined,
  testTime: undefined,
  remark: undefined,
};
const data = reactive<PageData<QcRecordForm, QcRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instrumentId: undefined,
    testItemId: undefined,
    judgment: undefined,
    collectionType: undefined,
    params: {},
  },
  rules: {
    instrumentId: [{ required: true, message: "请选择仪器", trigger: "change" }],
    testItemId: [{ required: true, message: "请选择检验项目", trigger: "change" }],
    batchId: [{ required: true, message: "请选择质控批次", trigger: "change" }],
    testValue: [{ required: true, message: "请输入测定值", trigger: "blur" }],
    testTime: [{ required: true, message: "请选择检测时间", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

// 日期范围
const testTimeRange = ref<[string, string] | null>(null);
const handleTestTimeChange = (val: [string, string] | null) => {
  if (val && val.length === 2) {
    queryParams.value.params = {
      ...queryParams.value.params,
      beginTestTime: val[0],
      endTestTime: val[1],
    };
  } else {
    delete queryParams.value.params?.beginTestTime;
    delete queryParams.value.params?.endTestTime;
  }
};

// 下拉选项
const testItemOptions = ref<TestItemVO[]>([]);
const instrumentOptions = ref<CommInstrumentVO[]>([]);
const batchOptions = ref<QcMaterialBatchVO[]>([]);

const loadOptions = async () => {
  const [testItemRes, instrumentRes] = await Promise.all([
    listTestItem({ pageNum: 1, pageSize: 999, params: {} }),
    listCommInstrument({ pageNum: 1, pageSize: 999, params: {} }),
  ]);
  testItemOptions.value = testItemRes.rows;
  instrumentOptions.value = instrumentRes.rows;
};

const loadBatchOptions = async () => {
  const res = await listQcMaterialBatch({ pageNum: 1, pageSize: 999, params: {} });
  batchOptions.value = res.rows;
};

/** 查询质控记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQcRecord(queryParams.value);
  qcRecordList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
const tableHeight = ref("500px");

const updateHeight = () => {
  setTimeout(() => {
    if (tableWrapperRef.value) {
      const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
      const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
      const tabHeightCale =
        tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
      if (tabHeightCale > 500) {
        queryParams.value.pageSize = 20;
      } else if (tabHeightCale < 500) {
        queryParams.value.pageSize = 10;
      }
      tableHeight.value = tabHeightCale + "px";
    }
  }, 150);
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  qcRecordFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  testTimeRange.value = null;
  delete queryParams.value.params?.beginTestTime;
  delete queryParams.value.params?.endTestTime;
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  form.value.collectionType = "MANUAL";
  dialog.visible = true;
  dialog.title = "手动录入质控数据";
};

/** 提交按钮 */
const submitForm = () => {
  qcRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        await addQcRecord(form.value);
        proxy?.$modal.msgSuccess("录入成功");
        dialog.visible = false;
        await getList();
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "lis/qc/record/export",
    {
      ...queryParams.value,
    },
    `qcRecord_${new Date().getTime()}.xlsx`,
  );
};

onMounted(async () => {
  await loadOptions();
  await loadBatchOptions();
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
