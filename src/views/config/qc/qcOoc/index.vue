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
            <el-form-item label="判定结果" prop="judgment">
              <el-select v-model="queryParams.judgment" placeholder="请选择判定结果" clearable>
                <el-option label="在控" value="IN_CONTROL" />
                <el-option label="警告" value="WARNING" />
                <el-option label="失控" value="OOC" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理状态" prop="oocStatus">
              <el-select v-model="queryParams.oocStatus" placeholder="请选择处理状态" clearable>
                <el-option label="待处理" value="PENDING" />
                <el-option label="已处理" value="RESOLVED" />
                <el-option label="已解锁" value="UNLOCKED" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理时间" prop="handleTime">
              <el-date-picker
                v-model="handleTimeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="handleHandleTimeChange"
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
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="qcOocList"
          :height="tableHeight"
        >
          <el-table-column label="OOC ID" align="center" prop="oocId" width="80" />
          <el-table-column label="记录ID" align="center" prop="recordId" width="80" />
          <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
          <el-table-column label="失控原因" align="center" prop="oocCause" min-width="140" show-overflow-tooltip />
          <el-table-column label="纠正措施" align="center" prop="correctiveAction" min-width="160" show-overflow-tooltip />
          <el-table-column label="处理人" align="center" prop="handler" width="100" />
          <el-table-column label="处理状态" align="center" prop="oocStatus" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.oocStatus === 'PENDING' ? 'danger' : scope.row.oocStatus === 'RESOLVED' ? 'warning' : 'success'"
                disable-transitions
              >
                {{ scope.row.oocStatus === 'PENDING' ? '待处理' : scope.row.oocStatus === 'RESOLVED' ? '已处理' : '已解锁' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="处理时间" align="center" prop="handleTime" width="170" />
          <el-table-column label="解锁时间" align="center" prop="unlockTime" width="170" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="160"
          >
            <template #default="scope">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleOoc(scope.row)"
                v-if="scope.row.oocStatus === 'PENDING'"
                v-hasPermi="['lis:qc:ooc:handle']"
              >处理</el-button>
              <el-button
                link
                type="primary"
                icon="Unlock"
                @click="handleUnlock(scope.row)"
                v-if="scope.row.oocStatus === 'RESOLVED'"
                v-hasPermi="['lis:qc:ooc:unlock']"
              >解除锁定</el-button>
            </template>
          </el-table-column>
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

    <!-- 失控处理对话框 -->
    <OocDialog
      v-model:visible="oocDialog.visible"
      :record-data="oocDialog.recordData"
      @submitted="handleOocSubmitted"
    />
  </div>
</template>

<script setup name="QcOoc" lang="ts">
import {
  listQcOocRecord,
  handleQcOoc,
  unlockQcOoc,
  listOocCauseDict,
} from "@/api/lis/qcOoc";
import {
  QcOocRecordVO,
  QcOocRecordForm,
  QcOocRecordQuery,
  OocCauseDictVO,
} from "@/api/lis/qcOoc/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";
import OocDialog from "@/components/qc/OocDialog.vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const qcOocList = ref<QcOocRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const oocDialog = reactive({
  visible: false,
  recordData: null as QcOocRecordVO | null,
});

const initFormData: QcOocRecordForm = {
  oocId: undefined,
  recordId: undefined,
  instrumentId: undefined,
  oocCause: undefined,
  correctiveAction: undefined,
  handler: undefined,
  oocStatus: undefined,
  handleTime: undefined,
  unlockTime: undefined,
};
const data = reactive<PageData<QcOocRecordForm, QcOocRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instrumentId: undefined,
    judgment: undefined,
    oocStatus: undefined,
    params: {},
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

// 日期范围
const handleTimeRange = ref<[string, string] | null>(null);
const handleHandleTimeChange = (val: [string, string] | null) => {
  if (val && val.length === 2) {
    queryParams.value.params = {
      ...queryParams.value.params,
      beginHandleTime: val[0],
      endHandleTime: val[1],
    };
  } else {
    delete queryParams.value.params?.beginHandleTime;
    delete queryParams.value.params?.endHandleTime;
  }
};

// 下拉选项
const instrumentOptions = ref<CommInstrumentVO[]>([]);

const loadOptions = async () => {
  const instrumentRes = await listCommInstrument({ pageNum: 1, pageSize: 999, params: {} });
  instrumentOptions.value = instrumentRes.rows;
};

/** 查询失控处理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listQcOocRecord(queryParams.value);
  qcOocList.value = res.rows;
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

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  handleTimeRange.value = null;
  delete queryParams.value.params?.beginHandleTime;
  delete queryParams.value.params?.endHandleTime;
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 处理按钮操作 */
const handleOoc = (row: QcOocRecordVO) => {
  oocDialog.recordData = row;
  oocDialog.visible = true;
};

/** 处理提交回调 */
const handleOocSubmitted = async (data: { oocCause: string; correctiveAction: string; handler: string; recordId: number }) => {
  buttonLoading.value = true;
  try {
    await handleQcOoc(data);
    proxy?.$modal.msgSuccess("处理成功");
    oocDialog.visible = false;
    oocDialog.recordData = null;
    await getList();
  } finally {
    buttonLoading.value = false;
  }
};

/** 解除锁定按钮操作 */
const handleUnlock = async (row: QcOocRecordVO) => {
  await proxy?.$modal.confirm('确认解除锁定？解除后该记录可重新进行质控判定。');
  buttonLoading.value = true;
  try {
    await unlockQcOoc(row.oocId);
    proxy?.$modal.msgSuccess("解除锁定成功");
    await getList();
  } finally {
    buttonLoading.value = false;
  }
};

onMounted(async () => {
  await loadOptions();
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
