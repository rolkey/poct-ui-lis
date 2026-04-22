<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="排序号" prop="testItemSort">
              <el-input
                v-model="queryParams.testItemSort"
                placeholder="请输入排序号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="中文名称" prop="chineseName">
              <el-input
                v-model="queryParams.chineseName"
                placeholder="请输入中文名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="中文简称" prop="chineseShortName">
              <el-input
                v-model="queryParams.chineseShortName"
                placeholder="请输入中文简称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="英文名称" prop="englishName">
              <el-input
                v-model="queryParams.englishName"
                placeholder="请输入英文名称"
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
        <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['his:testItem:add']"
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
              v-hasPermi="['his:testItem:edit']"
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
              v-hasPermi="['his:testItem:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:testItem:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="testItemList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目ID" align="center" prop="testItemId" v-if="false" />
          <el-table-column label="项目代码" align="center" prop="testItemCode" />
          <el-table-column label="排序号" align="center" prop="testItemSort" />
          <el-table-column label="中文名称" align="center" prop="chineseName" />
          <el-table-column label="中文简称" align="center" prop="chineseShortName" />
          <el-table-column label="英文名称" align="center" prop="englishName" />
          <el-table-column label="英文简称" align="center" prop="englishShortName" />
          <el-table-column label="标准代码" align="center" prop="standardId" />
          <el-table-column label="HIS代码" align="center" prop="hisId" />
          <el-table-column label="老系统代码" align="center" prop="lisId" />
          <el-table-column label="医保代码" align="center" prop="medicalId" />
          <el-table-column label="项目类型:计算类、非计算类" align="center" prop="testItemType" />
          <el-table-column label="项目分类" align="center" prop="testItemClass" />
          <el-table-column label="计算公式" align="center" prop="expressions" />
          <el-table-column label="收费金额" align="center" prop="testItemCharge" />
          <el-table-column label="单位" align="center" prop="testItemUnit" />
          <el-table-column label="结果精度" align="center" prop="testItemPrecision" />
          <el-table-column label="项目系数" align="center" prop="modulus" />
          <el-table-column label="相关方程" align="center" prop="correlativeEquation" />
          <el-table-column label="显示类型" align="center" prop="displayType" />
          <el-table-column label="对照Key" align="center" prop="correspondKey" />
          <el-table-column label="操作规程文件" align="center" prop="regulationFile" />
          <el-table-column label="知识库文件" align="center" prop="repositoryFile" />
          <el-table-column label="检验方法" align="center" prop="testMethod" />
          <el-table-column label="试剂用量" align="center" prop="reagentDosage" />
          <el-table-column label="自定义码" align="center" prop="customCode" />
          <el-table-column label="拼音码" align="center" prop="spellCode" />
          <el-table-column label="五笔码" align="center" prop="strokeCode" />
          <el-table-column label="状态" align="center" prop="stateFlag" />
          <el-table-column label="标准名称" align="center" prop="standardName" />
          <el-table-column label="项目总分类" align="center" prop="testItemTotalClass" />
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
                  v-hasPermi="['his:testItem:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:testItem:remove']"
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
    <!-- 添加或修改检验项目对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <el-form ref="testItemFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序号" prop="testItemSort">
              <el-input v-model="form.testItemSort" placeholder="请输入排序号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名称" prop="chineseName">
              <el-input v-model="form.chineseName" placeholder="请输入中文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文简称" prop="chineseShortName">
              <el-input v-model="form.chineseShortName" placeholder="请输入中文简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称" prop="englishName">
              <el-input v-model="form.englishName" placeholder="请输入英文名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="英文简称" prop="englishShortName">
              <el-input v-model="form.englishShortName" placeholder="请输入英文简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准代码" prop="standardId">
              <el-input v-model="form.standardId" placeholder="请输入标准代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="HIS代码" prop="hisId">
              <el-input v-model="form.hisId" placeholder="请输入HIS代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="老系统代码" prop="lisId">
              <el-input v-model="form.lisId" placeholder="请输入老系统代码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医保代码" prop="medicalId">
              <el-input v-model="form.medicalId" placeholder="请输入医保代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目分类" prop="testItemClass">
              <el-input v-model="form.testItemClass" placeholder="请输入项目分类" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计算公式" prop="expressions">
              <el-input v-model="form.expressions" placeholder="请输入计算公式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收费金额" prop="testItemCharge">
              <el-input v-model="form.testItemCharge" placeholder="请输入收费金额" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位" prop="testItemUnit">
              <el-input v-model="form.testItemUnit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目系数" prop="modulus">
              <el-input v-model="form.modulus" placeholder="请输入项目系数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="相关方程" prop="correlativeEquation">
              <el-input v-model="form.correlativeEquation" placeholder="请输入相关方程" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对照Key" prop="correspondKey">
              <el-input v-model="form.correspondKey" placeholder="请输入对照Key" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作规程文件" prop="regulationFile">
              <file-upload v-model="form.regulationFile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识库文件" prop="repositoryFile">
              <file-upload v-model="form.repositoryFile" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验方法" prop="testMethod">
              <el-input v-model="form.testMethod" placeholder="请输入检验方法" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试剂用量" prop="reagentDosage">
              <el-input v-model="form.reagentDosage" placeholder="请输入试剂用量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义码" prop="customCode">
              <el-input v-model="form.customCode" placeholder="请输入自定义码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拼音码" prop="spellCode">
              <el-input v-model="form.spellCode" placeholder="请输入拼音码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="五笔码" prop="strokeCode">
              <el-input v-model="form.strokeCode" placeholder="请输入五笔码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准名称" prop="standardName">
              <el-input v-model="form.standardName" placeholder="请输入标准名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目总分类" prop="testItemTotalClass">
              <el-input v-model="form.testItemTotalClass" placeholder="请输入项目总分类" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体检关联码" prop="pesId">
              <el-input v-model="form.pesId" placeholder="请输入体检关联码" />
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

<script setup name="TestItem" lang="ts">
import {
  listTestItem,
  getTestItem,
  delTestItem,
  addTestItem,
  updateTestItem,
} from "@/api/lis/testItem";
import { TestItemVO, TestItemQuery, TestItemForm } from "@/api/lis/testItem/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const testItemList = ref<TestItemVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const testItemFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: TestItemForm = {
  testItemCode: undefined,
  testItemSort: undefined,
  chineseName: undefined,
  chineseShortName: undefined,
  englishName: undefined,
  englishShortName: undefined,
  standardId: undefined,
  hisId: undefined,
  lisId: undefined,
  medicalId: undefined,
  testItemType: undefined,
  testItemClass: undefined,
  expressions: undefined,
  testItemCharge: undefined,
  testItemUnit: undefined,
  testItemPrecision: undefined,
  modulus: undefined,
  correlativeEquation: undefined,
  displayType: undefined,
  correspondKey: undefined,
  regulationFile: undefined,
  repositoryFile: undefined,
  testMethod: undefined,
  reagentDosage: undefined,
  customCode: undefined,
  spellCode: undefined,
  strokeCode: undefined,
  stateFlag: undefined,
  standardName: undefined,
  testItemTotalClass: undefined,
  pesId: undefined,
  testItemId: "",
};
const data = reactive<PageData<TestItemForm, TestItemQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    testItemCode: undefined,
    testItemSort: undefined,
    chineseName: undefined,
    chineseShortName: undefined,
    englishName: undefined,
    englishShortName: undefined,
    standardId: undefined,
    hisId: undefined,
    lisId: undefined,
    medicalId: undefined,
    testItemType: undefined,
    testItemClass: undefined,
    expressions: undefined,
    testItemCharge: undefined,
    testItemUnit: undefined,
    testItemPrecision: undefined,
    modulus: undefined,
    correlativeEquation: undefined,
    displayType: undefined,
    correspondKey: undefined,
    regulationFile: undefined,
    repositoryFile: undefined,
    testMethod: undefined,
    reagentDosage: undefined,
    customCode: undefined,
    spellCode: undefined,
    strokeCode: undefined,
    stateFlag: undefined,
    standardName: undefined,
    testItemTotalClass: undefined,
    pesId: undefined,
    params: {},
    testItemId: "",
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

/** 查询检验项目列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTestItem(queryParams.value);
  testItemList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
// 计算高度
const tableHeight = ref("500px"); // 使用 ref 而非 computed

const updateHeight = () => {
  setTimeout(() => {
    if (tableWrapperRef.value) {
      const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
      const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
      const tabHeightCale =
        tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
      console.log(
        "tabHeightCale",
        tabHeightCale,
        "pageinationHeight",
        pageinationHeight,
        "editButtonsHeight",
        editButtonsHeight,
      );
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
  testItemFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TestItemVO[]) => {
  ids.value = selection.map((item) => item.testItemId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加检验项目";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TestItemVO) => {
  reset();
  const _testItemId = row?.testItemId || ids.value[0];
  const res = await getTestItem(_testItemId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改检验项目";
};

/** 提交按钮 */
const submitForm = () => {
  testItemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.testItemId) {
        await updateTestItem(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTestItem(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TestItemVO) => {
  const _testItemIds = row?.testItemId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除检验项目编号为"' + _testItemIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delTestItem(_testItemIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/testItem/export",
    {
      ...queryParams.value,
    },
    `testItem_${new Date().getTime()}.xlsx`,
  );
};

onMounted(() => {
  getList();
  updateHeight(); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
