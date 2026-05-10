<template>
  <div class="showFull p-2 flex flex-col">
    <el-card shadow="hover" class="mb-[10px]">
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
        <el-form-item label="日期范围" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-[10px]">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-gray-400 text-sm mb-1">在控率</div>
            <div class="text-3xl font-bold text-success">
              {{ inControlRateData.inControlRate ?? '-' }}%
            </div>
            <div class="text-xs text-gray-400 mt-1">
              在控 {{ inControlRateData.inControlCount ?? 0 }} / 总 {{ inControlRateData.totalCount ?? 0 }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-gray-400 text-sm mb-1">失控率</div>
            <div class="text-3xl font-bold text-danger">
              {{ outOfControlRate }}%
            </div>
            <div class="text-xs text-gray-400 mt-1">
              失控 {{ outOfControlCount }} / 总 {{ inControlRateData.totalCount ?? 0 }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="text-center">
            <div class="text-gray-400 text-sm mb-1">合格率</div>
            <div class="text-3xl font-bold text-primary">
              {{ passRate }}%
            </div>
            <div class="text-xs text-gray-400 mt-1">
              合格 {{ passCount }} / 总 {{ inControlRateData.totalCount ?? 0 }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-card shadow="never" class="flex flex-col flex-1 mb-[10px]">
      <template #header>
        <el-row :gutter="10" class="mb-[6px]">
          <el-col :span="12">
            <span class="font-bold">通过率趋势</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button
              type="primary"
              plain
              icon="Document"
              @click="handleExportPdf"
              v-hasPermi="['lis:qc:report:export']"
            >导出PDF</el-button>
            <el-button
              type="success"
              plain
              icon="Download"
              @click="handleExportExcel"
              v-hasPermi="['lis:qc:report:export']"
            >导出Excel</el-button>
          </el-col>
        </el-row>
      </template>
      <div ref="chartContainerRef" style="width: 100%; height: 350px">
        <el-table v-if="trendData.length === 0" :data="[]" border empty-text="暂无趋势数据" />
        <div v-else ref="svgChartRef" class="w-full h-full"></div>
      </div>
    </el-card>

    <!-- 月度统计表 -->
    <el-card shadow="never" class="flex flex-col flex-1 table-card">
      <template #header>
        <span class="font-bold">月度质控统计</span>
      </template>
      <el-table
        v-loading="monthlyLoading"
        border
        :data="monthlyData"
        max-height="300"
      >
        <el-table-column label="月份" align="center" prop="month" width="100" />
        <el-table-column label="仪器" align="center" prop="instrumentName" min-width="120" />
        <el-table-column label="检验项目" align="center" prop="testItemName" min-width="120" />
        <el-table-column label="测定次数" align="center" prop="testCount" width="90" />
        <el-table-column label="均值" align="center" prop="mean" width="100">
          <template #default="scope">
            <span class="font-mono">{{ scope.row.mean }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标准差" align="center" prop="sd" width="100">
          <template #default="scope">
            <span class="font-mono">{{ scope.row.sd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变异系数" align="center" prop="cv" width="100">
          <template #default="scope">
            <span class="font-mono">{{ scope.row.cv }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="在控率" align="center" prop="inControlRate" width="100">
          <template #default="scope">
            <span class="font-mono">{{ scope.row.inControlRate }}%</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup name="QcReport" lang="ts">
import {
  getInControlRate,
  getMonthlyReport,
  getTrendAnalysis,
  getInstrumentRate,
  exportPdf,
  exportExcel,
} from "@/api/lis/qcReport";
import {
  QcReportQuery,
  QcInControlRateVO,
  QcMonthlyReportVO,
  QcTrendAnalysisVO,
  QcInstrumentRateVO,
} from "@/api/lis/qcReport/types";
import { listTestItem } from "@/api/lis/testItem";
import { TestItemVO } from "@/api/lis/testItem/types";
import { listCommInstrument } from "@/api/lis/commInstrument";
import { CommInstrumentVO } from "@/api/lis/commInstrument/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const queryFormRef = ref<ElFormInstance>();

const queryParams = reactive<QcReportQuery>({
  instrumentId: undefined,
  testItemId: undefined,
  startDate: undefined,
  endDate: undefined,
  params: {},
});

const dateRange = ref<[string, string] | null>(null);
const handleDateRangeChange = (val: [string, string] | null) => {
  if (val && val.length === 2) {
    queryParams.startDate = val[0];
    queryParams.endDate = val[1];
  } else {
    queryParams.startDate = undefined;
    queryParams.endDate = undefined;
  }
};

// Dropdown options
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

// Stats cards
const inControlRateData = reactive<QcInControlRateVO>({
  instrumentId: "",
  instrumentName: "",
  testItemId: 0,
  testItemName: "",
  totalCount: 0,
  inControlCount: 0,
  inControlRate: 0,
  statMonth: "",
});

const outOfControlCount = ref(0);
const outOfControlRate = ref(0);
const passCount = ref(0);
const passRate = ref(0);

// Trend data
const trendData = ref<QcTrendAnalysisVO[]>([]);

// Monthly data
const monthlyData = ref<QcMonthlyReportVO[]>([]);
const monthlyLoading = ref(false);

// Chart refs
const chartContainerRef = ref(null);
const svgChartRef = ref(null);

/** 渲染SVG趋势图 */
const renderTrendChart = () => {
  if (!svgChartRef.value || trendData.value.length === 0) return;

  const data = trendData.value;
  const width = svgChartRef.value.clientWidth || 800;
  const height = 350;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Find min/max values
  let minVal = Infinity;
  let maxVal = -Infinity;
  data.forEach((d) => {
    const vals = [d.testValue, d.mean, d.upperSd, d.lowerSd, d.upper2Sd, d.lower2Sd, d.upper3Sd, d.lower3Sd];
    vals.forEach((v) => {
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    });
  });
  const yPadding = (maxVal - minVal) * 0.15 || 1;
  const yMin = minVal - yPadding;
  const yMax = maxVal + yPadding;

  const xScale = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#fff" />`;

  // Y-axis grid lines and labels
  const ySteps = 8;
  for (let i = 0; i <= ySteps; i++) {
    const val = yMin + ((yMax - yMin) * i) / ySteps;
    const y = yScale(val);
    svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#eee" stroke-width="1" />`;
    svg += `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#666">${val.toFixed(2)}</text>`;
  }

  // X-axis labels
  const xStep = Math.max(1, Math.floor(data.length / 10));
  for (let i = 0; i < data.length; i += xStep) {
    const x = xScale(i);
    const label = data[i].testDate ? data[i].testDate.slice(5, 10) : String(i);
    svg += `<text x="${x}" y="${height - padding.bottom + 18}" text-anchor="middle" font-size="10" fill="#666" transform="rotate(-30, ${x}, ${height - padding.bottom + 18})">${label}</text>`;
  }

  // Reference lines
  const lines = [
    { val: data[0]?.mean, color: "#333", width: 2, dash: "", label: "Mean" },
    { val: data[0]?.upperSd, color: "#e6a23c", width: 1.5, dash: "6,3", label: "+1SD" },
    { val: data[0]?.lowerSd, color: "#e6a23c", width: 1.5, dash: "6,3", label: "-1SD" },
    { val: data[0]?.upper2Sd, color: "#e6a23c", width: 1.5, dash: "4,4", label: "+2SD" },
    { val: data[0]?.lower2Sd, color: "#e6a23c", width: 1.5, dash: "4,4", label: "-2SD" },
    { val: data[0]?.upper3Sd, color: "#f56c6c", width: 1.5, dash: "3,5", label: "+3SD" },
    { val: data[0]?.lower3Sd, color: "#f56c6c", width: 1.5, dash: "3,5", label: "-3SD" },
  ];

  lines.forEach((line) => {
    if (line.val == null) return;
    const y = yScale(line.val);
    svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${line.color}" stroke-width="${line.width}" stroke-dasharray="${line.dash}" />`;
    svg += `<text x="${width - padding.right + 4}" y="${y + 4}" font-size="10" fill="${line.color}">${line.label}</text>`;
  });

  // Data line
  let pathD = "";
  data.forEach((d, i) => {
    const x = xScale(i);
    const y = yScale(d.testValue);
    pathD += i === 0 ? `M${x},${y}` : `L${x},${y}`;
  });
  svg += `<path d="${pathD}" fill="none" stroke="#409eff" stroke-width="2" />`;

  // Data points
  data.forEach((d, i) => {
    const x = xScale(i);
    const y = yScale(d.testValue);
    svg += `<circle cx="${x}" cy="${y}" r="4" fill="#409eff" stroke="#fff" stroke-width="1.5" />`;
  });

  svg += "</svg>";
  svgChartRef.value.innerHTML = svg;
};

/** 加载统计数据 */
const loadStats = async () => {
  try {
    const [rateRes, instrumentRateRes] = await Promise.all([
      getInControlRate(queryParams),
      getInstrumentRate(queryParams),
    ]);

    const rateData = rateRes.rows?.[0] || rateRes.data;
    if (rateData) {
      Object.assign(inControlRateData, rateData);
    }

    const instrumentRates = instrumentRateRes.rows || instrumentRateRes.data || [];
    if (instrumentRates.length > 0) {
      let totalOoc = 0;
      let totalCount = 0;
      instrumentRates.forEach((item: QcInstrumentRateVO) => {
        totalOoc += item.outOfControlCount || 0;
        totalCount += item.totalCount || 0;
      });
      outOfControlCount.value = totalOoc;
      outOfControlRate.value = totalCount > 0 ? Math.round((totalOoc / totalCount) * 10000) / 100 : 0;
      passCount.value = totalCount - totalOoc;
      passRate.value = totalCount > 0 ? Math.round(((totalCount - totalOoc) / totalCount) * 10000) / 100 : 0;
    }
  } catch {
    // Handle silently
  }
};

/** 加载趋势数据 */
const loadTrend = async () => {
  try {
    const res = await getTrendAnalysis(queryParams);
    trendData.value = res.rows || res.data || [];
    nextTick(() => renderTrendChart());
  } catch {
    trendData.value = [];
  }
};

/** 加载月度统计 */
const loadMonthly = async () => {
  monthlyLoading.value = true;
  try {
    const res = await getMonthlyReport(queryParams);
    monthlyData.value = res.rows || res.data || [];
  } finally {
    monthlyLoading.value = false;
  }
};

/** 查询 */
const handleQuery = () => {
  loadStats();
  loadTrend();
  loadMonthly();
};

/** 重置 */
const resetQuery = () => {
  dateRange.value = null;
  queryParams.startDate = undefined;
  queryParams.endDate = undefined;
  queryParams.instrumentId = undefined;
  queryParams.testItemId = undefined;
  handleQuery();
};

/** 导出PDF */
const handleExportPdf = async () => {
  try {
    const res = await exportPdf(queryParams);
    const blob = new Blob([res], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `qc_report_${new Date().getTime()}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch {
    proxy?.$modal.msgError("导出PDF失败");
  }
};

/** 导出Excel */
const handleExportExcel = async () => {
  try {
    const res = await exportExcel(queryParams);
    const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `qc_report_${new Date().getTime()}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch {
    proxy?.$modal.msgError("导出Excel失败");
  }
};

onMounted(async () => {
  await loadOptions();
  handleQuery();
  window.addEventListener("resize", renderTrendChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", renderTrendChart);
});
</script>
