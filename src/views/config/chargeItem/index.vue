<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="诊疗项目名称" prop="chineseName">
              <el-input
                v-model="queryParams.chineseName"
                placeholder="请输入诊疗项目名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="诊疗项目简称" prop="chineseNameShort">
              <el-input
                v-model="queryParams.chineseNameShort"
                placeholder="请输入诊疗项目简称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="诊疗项目英文名称" prop="englishName">
              <el-input
                v-model="queryParams.englishName"
                placeholder="请输入诊疗项目英文名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="HIS代码" prop="hisId">
              <el-input
                v-model="queryParams.hisId"
                placeholder="请输入HIS代码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="医保代码" prop="medicareId">
              <el-input
                v-model="queryParams.medicareId"
                placeholder="请输入医保代码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="标准代码" prop="standartId">
              <el-input
                v-model="queryParams.standartId"
                placeholder="请输入标准代码"
                clearable
                @keyup.enter="handleQuery"
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['his:chargeItem:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['his:chargeItem:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['his:chargeItem:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:chargeItem:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1">
        <el-table
          v-loading="loading"
          border
          :data="chargeItemList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="诊疗项目ID" align="center" prop="chargeItemId" v-if="true" />
          <el-table-column label="诊疗项目名称" align="center" prop="chineseName" />
          <el-table-column label="诊疗项目简称" align="center" prop="chineseNameShort" />
          <el-table-column label="诊疗项目英文名称" align="center" prop="englishName" />
          <el-table-column label="HIS代码" align="center" prop="hisId" />
          <el-table-column label="医保代码" align="center" prop="medicareId" />
          <el-table-column label="标准代码" align="center" prop="standartId" />
          <el-table-column label="条码规则序号" align="center" prop="barcodeSeq" />
          <el-table-column label="排序号" align="center" prop="chargeItemSort" />
          <el-table-column label="诊疗项目分类" align="center" prop="chargeItemClass" />
          <el-table-column label="诊疗项目金额" align="center" prop="charge" />
          <el-table-column label="默认标本种类" align="center" prop="sampleClass" />
          <el-table-column label="项目开展类型" align="center" prop="patientType" />
          <el-table-column label="采样要求" align="center" prop="samplingRequest" />
          <el-table-column label="允许采样时间" align="center" prop="samplingTime" />
          <el-table-column label="采样地点" align="center" prop="samplingPlace" />
          <el-table-column label="报告时间" align="center" prop="reportTime" />
          <el-table-column label="报告地点" align="center" prop="reportPlace" />
          <el-table-column label="报告时间序号" align="center" prop="reportTimeSort" />
          <el-table-column label="开展时间" align="center" prop="inspectionTime" />
          <el-table-column label="工作量" align="center" prop="workload" />
          <el-table-column label="项目数量" align="center" prop="testItemCount" />
          <el-table-column label="合并标记" align="center" prop="uniteFlag" />
          <el-table-column label="展开标记" align="center" prop="expandFlag" />
          <el-table-column label="自定义码" align="center" prop="customCode" />
          <el-table-column label="拼音码" align="center" prop="spellCode" />
          <el-table-column label="五笔码" align="center" prop="strokeCode" />
          <el-table-column label="实验室分类" align="center" prop="labClass" />
          <el-table-column label="是否常用：1是，空不是" align="center" prop="usedFlag" />
          <el-table-column label="使用状态：1使用，0禁用" align="center" prop="stateFlag" />
          <el-table-column label="起始编号" align="center" prop="numberFrom" />
          <el-table-column label="结束编号" align="center" prop="numberTo" />
          <el-table-column label="编号规则" align="center" prop="numberPriority" />
          <el-table-column label="标本保留天数" align="center" prop="saveTerm" />
          <el-table-column label="所属检验分组" align="center" prop="groupId" />
          <el-table-column label="发送标记" align="center" prop="sendFlag" />
          <el-table-column label="试管标记" align="center" prop="tubeFlag" />
          <el-table-column label="队列标记" align="center" prop="queueFlag" />
          <el-table-column label="项目代码" align="center" prop="itemCode" />
          <el-table-column label="体检代码" align="center" prop="tjxmbh" />
          <el-table-column label="危急值超时分钟" align="center" prop="policeMinute" />
          <el-table-column label="HIS名称" align="center" prop="hisName" />
          <el-table-column label="检验条码打印份数" align="center" prop="numberPrint" />
          <el-table-column label="试管数量" align="center" prop="tubeNumber" />
          <el-table-column label="采样人员规则" align="center" prop="samplingPersonRule" />
          <el-table-column label="体检关联码" align="center" prop="pesId" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['his:chargeItem:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:chargeItem:remove']"
                ></el-button>
              </el-tooltip>
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
    <!-- 添加或修改诊疗项目对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
      <el-form ref="chargeItemFormRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="诊疗项目名称" prop="chineseName">
          <el-input v-model="form.chineseName" placeholder="请输入诊疗项目名称" />
        </el-form-item>
        <el-form-item label="诊疗项目简称" prop="chineseNameShort">
          <el-input v-model="form.chineseNameShort" placeholder="请输入诊疗项目简称" />
        </el-form-item>
        <el-form-item label="诊疗项目英文名称" prop="englishName">
          <el-input v-model="form.englishName" placeholder="请输入诊疗项目英文名称" />
        </el-form-item>
        <el-form-item label="HIS代码" prop="hisId">
          <el-input v-model="form.hisId" placeholder="请输入HIS代码" />
        </el-form-item>
        <el-form-item label="医保代码" prop="medicareId">
          <el-input v-model="form.medicareId" placeholder="请输入医保代码" />
        </el-form-item>
        <el-form-item label="标准代码" prop="standartId">
          <el-input v-model="form.standartId" placeholder="请输入标准代码" />
        </el-form-item>
        <el-form-item label="排序号" prop="chargeItemSort">
          <el-input v-model="form.chargeItemSort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="诊疗项目分类" prop="chargeItemClass">
          <el-input v-model="form.chargeItemClass" placeholder="请输入诊疗项目分类" />
        </el-form-item>
        <el-form-item label="诊疗项目金额" prop="charge">
          <el-input v-model="form.charge" placeholder="请输入诊疗项目金额" />
        </el-form-item>
        <el-form-item label="默认标本种类" prop="sampleClass">
          <el-input v-model="form.sampleClass" placeholder="请输入默认标本种类" />
        </el-form-item>
        <el-form-item label="采样要求" prop="samplingRequest">
          <el-input v-model="form.samplingRequest" placeholder="请输入采样要求" />
        </el-form-item>
        <el-form-item label="允许采样时间" prop="samplingTime">
          <el-input v-model="form.samplingTime" placeholder="请输入允许采样时间" />
        </el-form-item>
        <el-form-item label="采样地点" prop="samplingPlace">
          <el-input v-model="form.samplingPlace" placeholder="请输入采样地点" />
        </el-form-item>
        <el-form-item label="报告时间" prop="reportTime">
          <el-input v-model="form.reportTime" placeholder="请输入报告时间" />
        </el-form-item>
        <el-form-item label="报告地点" prop="reportPlace">
          <el-input v-model="form.reportPlace" placeholder="请输入报告地点" />
        </el-form-item>
        <el-form-item label="报告时间序号" prop="reportTimeSort">
          <el-input v-model="form.reportTimeSort" placeholder="请输入报告时间序号" />
        </el-form-item>
        <el-form-item label="开展时间" prop="inspectionTime">
          <el-input v-model="form.inspectionTime" placeholder="请输入开展时间" />
        </el-form-item>
        <el-form-item label="工作量" prop="workload">
          <el-input v-model="form.workload" placeholder="请输入工作量" />
        </el-form-item>
        <el-form-item label="项目数量" prop="testItemCount">
          <el-input v-model="form.testItemCount" placeholder="请输入项目数量" />
        </el-form-item>
        <el-form-item label="合并标记" prop="uniteFlag">
          <el-input v-model="form.uniteFlag" placeholder="请输入合并标记" />
        </el-form-item>
        <el-form-item label="展开标记" prop="expandFlag">
          <el-input v-model="form.expandFlag" placeholder="请输入展开标记" />
        </el-form-item>
        <el-form-item label="自定义码" prop="customCode">
          <el-input v-model="form.customCode" placeholder="请输入自定义码" />
        </el-form-item>
        <el-form-item label="拼音码" prop="spellCode">
          <el-input v-model="form.spellCode" placeholder="请输入拼音码" />
        </el-form-item>
        <el-form-item label="五笔码" prop="strokeCode">
          <el-input v-model="form.strokeCode" placeholder="请输入五笔码" />
        </el-form-item>
        <el-form-item label="实验室分类" prop="labClass">
          <el-input v-model="form.labClass" placeholder="请输入实验室分类" />
        </el-form-item>
        <el-form-item label="是否常用：1是，空不是" prop="usedFlag">
          <el-input v-model="form.usedFlag" placeholder="请输入是否常用：1是，空不是" />
        </el-form-item>
        <el-form-item label="起始编号" prop="numberFrom">
          <el-input v-model="form.numberFrom" placeholder="请输入起始编号" />
        </el-form-item>
        <el-form-item label="结束编号" prop="numberTo">
          <el-input v-model="form.numberTo" placeholder="请输入结束编号" />
        </el-form-item>
        <el-form-item label="编号规则" prop="numberPriority">
          <el-input v-model="form.numberPriority" placeholder="请输入编号规则" />
        </el-form-item>
        <el-form-item label="标本保留天数" prop="saveTerm">
          <el-input v-model="form.saveTerm" placeholder="请输入标本保留天数" />
        </el-form-item>
        <el-form-item label="所属检验分组" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入所属检验分组" />
        </el-form-item>
        <el-form-item label="发送标记" prop="sendFlag">
          <el-input v-model="form.sendFlag" placeholder="请输入发送标记" />
        </el-form-item>
        <el-form-item label="试管标记" prop="tubeFlag">
          <el-input v-model="form.tubeFlag" placeholder="请输入试管标记" />
        </el-form-item>
        <el-form-item label="队列标记" prop="queueFlag">
          <el-input v-model="form.queueFlag" placeholder="请输入队列标记" />
        </el-form-item>
        <el-form-item label="项目代码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入项目代码" />
        </el-form-item>
        <el-form-item label="体检代码" prop="tjxmbh">
          <el-input v-model="form.tjxmbh" placeholder="请输入体检代码" />
        </el-form-item>
        <el-form-item label="危急值超时分钟" prop="policeMinute">
          <el-input v-model="form.policeMinute" placeholder="请输入危急值超时分钟" />
        </el-form-item>
        <el-form-item label="HIS名称" prop="hisName">
          <el-input v-model="form.hisName" placeholder="请输入HIS名称" />
        </el-form-item>
        <el-form-item label="检验条码打印份数" prop="numberPrint">
          <el-input v-model="form.numberPrint" placeholder="请输入检验条码打印份数" />
        </el-form-item>
        <el-form-item label="试管数量" prop="tubeNumber">
          <el-input v-model="form.tubeNumber" placeholder="请输入试管数量" />
        </el-form-item>
        <el-form-item label="体检关联码" prop="pesId">
          <el-input v-model="form.pesId" placeholder="请输入体检关联码" />
        </el-form-item>
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

<script setup name="ChargeItem" lang="ts">
import {
  listChargeItem,
  getChargeItem,
  delChargeItem,
  addChargeItem,
  updateChargeItem,
} from "@/api/lis/chargeItem";
import { ChargeItemVO, ChargeItemQuery, ChargeItemForm } from "@/api/lis/chargeItem/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const chargeItemList = ref<ChargeItemVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const chargeItemFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: ChargeItemForm = {
  chargeItemId: undefined,
  chineseName: undefined,
  chineseNameShort: undefined,
  englishName: undefined,
  hisId: undefined,
  medicareId: undefined,
  standartId: undefined,
  barcodeSeq: undefined,
  chargeItemSort: undefined,
  chargeItemClass: undefined,
  charge: undefined,
  sampleClass: undefined,
  patientType: undefined,
  samplingRequest: undefined,
  samplingTime: undefined,
  samplingPlace: undefined,
  reportTime: undefined,
  reportPlace: undefined,
  reportTimeSort: undefined,
  inspectionTime: undefined,
  workload: undefined,
  testItemCount: undefined,
  uniteFlag: undefined,
  expandFlag: undefined,
  customCode: undefined,
  spellCode: undefined,
  strokeCode: undefined,
  labClass: undefined,
  usedFlag: undefined,
  stateFlag: undefined,
  numberFrom: undefined,
  numberTo: undefined,
  numberPriority: undefined,
  saveTerm: undefined,
  groupId: undefined,
  sendFlag: undefined,
  tubeFlag: undefined,
  queueFlag: undefined,
  itemCode: undefined,
  tjxmbh: undefined,
  policeMinute: undefined,
  hisName: undefined,
  numberPrint: undefined,
  tubeNumber: undefined,
  samplingPersonRule: undefined,
  pesId: undefined,
};
const data = reactive<PageData<ChargeItemForm, ChargeItemQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    chineseName: undefined,
    chineseNameShort: undefined,
    englishName: undefined,
    hisId: undefined,
    medicareId: undefined,
    standartId: undefined,
    barcodeSeq: undefined,
    chargeItemSort: undefined,
    chargeItemClass: undefined,
    charge: undefined,
    sampleClass: undefined,
    patientType: undefined,
    samplingRequest: undefined,
    samplingTime: undefined,
    samplingPlace: undefined,
    reportTime: undefined,
    reportPlace: undefined,
    reportTimeSort: undefined,
    inspectionTime: undefined,
    workload: undefined,
    testItemCount: undefined,
    uniteFlag: undefined,
    expandFlag: undefined,
    customCode: undefined,
    spellCode: undefined,
    strokeCode: undefined,
    labClass: undefined,
    usedFlag: undefined,
    stateFlag: undefined,
    numberFrom: undefined,
    numberTo: undefined,
    numberPriority: undefined,
    saveTerm: undefined,
    groupId: undefined,
    sendFlag: undefined,
    tubeFlag: undefined,
    queueFlag: undefined,
    itemCode: undefined,
    tjxmbh: undefined,
    policeMinute: undefined,
    hisName: undefined,
    numberPrint: undefined,
    tubeNumber: undefined,
    samplingPersonRule: undefined,
    pesId: undefined,
    params: {},
  },
  rules: {
    chargeItemId: [{ required: true, message: "诊疗项目ID不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询诊疗项目列表 */
const getList = async () => {
  loading.value = true;
  const res = await listChargeItem(queryParams.value);
  chargeItemList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const tableWrapperRef = ref(null);
const paginationRef = ref(null);
// 计算高度
const tableHeight = ref("500px"); // 使用 ref 而非 computed

const updateHeight = () => {
  if (tableWrapperRef.value) {
    const pageinationHeight = paginationRef.value?.clientHeight || 0;
    const tabHeightCale = tableWrapperRef.value.clientHeight - pageinationHeight - 40;
    if (tabHeightCale > 500) {
      queryParams.value.pageSize = 20;
    } else if (tabHeightCale < 500) {
      queryParams.value.pageSize = 10;
    }
    tableHeight.value = tabHeightCale + "px";
  }
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  chargeItemFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: ChargeItemVO[]) => {
  ids.value = selection.map((item) => item.chargeItemId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加诊疗项目";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: ChargeItemVO) => {
  reset();
  const _chargeItemId = row?.chargeItemId || ids.value[0];
  const res = await getChargeItem(_chargeItemId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改诊疗项目";
};

/** 提交按钮 */
const submitForm = () => {
  chargeItemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.chargeItemId) {
        await updateChargeItem(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addChargeItem(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ChargeItemVO) => {
  const _chargeItemIds = row?.chargeItemId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除诊疗项目编号为"' + _chargeItemIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delChargeItem(_chargeItemIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/chargeItem/export",
    {
      ...queryParams.value,
    },
    `chargeItem_${new Date().getTime()}.xlsx`,
  );
};

onMounted(() => {
  getList();
  nextTick(updateHeight); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
