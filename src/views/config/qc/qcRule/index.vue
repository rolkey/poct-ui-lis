<template>
  <div class="showFull p-2 flex flex-col">
    <el-card shadow="never" class="flex flex-col flex-1 table-card">
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
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </transition>

      <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['lis:qc:rule:edit']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate()"
            v-hasPermi="['lis:qc:rule:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete()"
            v-hasPermi="['lis:qc:rule:edit']"
          >删除</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getConfigList"></right-toolbar>
      </el-row>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="configLoading"
          border
          :data="ruleConfigList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="配置ID" align="center" prop="configId" width="80" />
          <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
          <el-table-column label="检验项目" align="center" prop="testItemName" min-width="120" />
          <el-table-column label="应用规则" align="center" prop="ruleNames" min-width="200" show-overflow-tooltip />
          <el-table-column label="均值(Mean)" align="center" prop="mean" width="110" />
          <el-table-column label="标准差(SD)" align="center" prop="sd" width="110" />
          <el-table-column label="变异系数(CV)" align="center" prop="cv" width="110" />
          <el-table-column label="总允许误差(TEa)" align="center" prop="tea" width="120" />
          <el-table-column label="允许偏倚" align="center" prop="allowableBias" width="100" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="170" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="100"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['lis:qc:rule:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['lis:qc:rule:edit']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        ref="paginationRef"
        v-show="configTotal > 0"
        :total="configTotal"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getConfigList"
      />
    </el-card>

    <!-- 添加或修改规则配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="700px" append-to-body draggable>
      <el-form ref="ruleConfigFormRef" :model="form" :rules="rules" label-width="120px">
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
          <el-col :span="24">
            <el-form-item label="应用规则" prop="ruleIds">
              <el-checkbox-group v-model="form.ruleIds">
                <el-checkbox
                  v-for="item in ruleOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="均值(Mean)" prop="mean">
              <el-input-number v-model="form.mean" :precision="4" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准差(SD)" prop="sd">
              <el-input-number v-model="form.sd" :precision="4" :step="0.01" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="变异系数(CV)" prop="cv">
              <el-input-number v-model="form.cv" :precision="4" :step="0.01" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总允许误差(TEa)" prop="tea">
              <el-input-number v-model="form.tea" :precision="4" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="允许偏倚" prop="allowableBias">
              <el-input-number v-model="form.allowableBias" :precision="4" :step="0.1" style="width: 100%" />
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

<script setup name="QcRule" lang="ts">
import {
  listQcRuleConfig,
  getQcRuleConfig,
  delQcRuleConfig,
  addQcRuleConfig,
  updateQcRuleConfig,
} from "@/api/lis/qcRule";
import {
  QcRuleConfigVO,
  QcRuleConfigForm,
  QcRuleConfigQuery,
} from "@/api/lis/qcRule/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";
import { getDicts } from "@/api/system/dict/data";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 规则选项（来自系统字典 lis_qc_rule_type）
const ruleOptions = ref<{ label: string; value: string }[]>([]);

const fetchRuleDict = async () => {
  const res = await getDicts("lis_qc_rule_type");
  ruleOptions.value = (res.data || []).map((d: any) => ({
    label: d.dictLabel,
    value: d.dictValue,
  }));
};

const configLoading = ref(false);
const ruleConfigList = ref<QcRuleConfigVO[]>([]);
const buttonLoading = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const configTotal = ref(0);

const queryFormRef = ref<ElFormInstance>();
const ruleConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: QcRuleConfigForm = {
  configId: undefined,
  instrumentId: undefined,
  testItemId: undefined,
  ruleIds: [],
  mean: undefined,
  sd: undefined,
  cv: undefined,
  tea: undefined,
  allowableBias: undefined,
};
const data = reactive<PageData<QcRuleConfigForm, QcRuleConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    instrumentId: undefined,
    testItemId: undefined,
    params: {},
  },
  rules: {
    instrumentId: [{ required: true, message: "请选择仪器", trigger: "change" }],
    testItemId: [{ required: true, message: "请选择检验项目", trigger: "change" }],
    ruleIds: [{ required: true, message: "请选择应用规则", trigger: "change" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

const testItemOptions = ref<TestItemVO[]>([]);
const instrumentOptions = ref<CommInstrumentVO[]>([]);

const loadOptions = async () => {
  const [testItemRes, instrumentRes] = await Promise.all([
    listTestItem({ pageNum: 1, pageSize: 999, params: {} }),
    listCommInstrument({ pageNum: 1, pageSize: 999, params: {} }),
  ]);
  testItemOptions.value = testItemRes.rows;
  instrumentOptions.value = instrumentRes.rows;
};

const getConfigList = async () => {
  configLoading.value = true;
  const res = await listQcRuleConfig(queryParams.value);
  ruleConfigList.value = res.rows;
  configTotal.value = res.total;
  configLoading.value = false;
};

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
const tableHeight = ref("500px");

const updateTableHeight = () => {
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

const cancel = () => {
  reset();
  dialog.visible = false;
};

const reset = () => {
  form.value = { ...initFormData };
  ruleConfigFormRef.value?.resetFields();
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getConfigList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

const handleSelectionChange = (selection: QcRuleConfigVO[]) => {
  ids.value = selection.map((item) => item.configId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "新增规则配置";
};

const handleUpdate = async (row?: QcRuleConfigVO) => {
  reset();
  const _configId = row?.configId || ids.value[0];
  const res = await getQcRuleConfig(_configId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改规则配置";
};

const submitForm = () => {
  ruleConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.configId) {
        await updateQcRuleConfig(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addQcRuleConfig(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getConfigList();
    }
  });
};

const handleDelete = async (row?: QcRuleConfigVO) => {
  const _configIds = row?.configId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除规则配置编号为"' + _configIds + '"的数据项？')
    .finally(() => (configLoading.value = false));
  await delQcRuleConfig(_configIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getConfigList();
};

onMounted(async () => {
  await Promise.all([loadOptions(), fetchRuleDict()]);
  getConfigList();
  nextTick(() => {
    updateTableHeight();
  });
  window.addEventListener("resize", updateTableHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>
