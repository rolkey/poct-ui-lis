<template>
  <div ref="containerRef" class="lj-chart-container" :style="{ width: width + 'px', height: height + 'px' }">
    <svg
      v-if="chartData.length > 0"
      :width="svgWidth"
      :height="svgHeight"
      xmlns="http://www.w3.org/2000/svg"
      class="lj-chart-svg"
    >
      <!-- Background -->
      <rect x="0" y="0" :width="svgWidth" :height="svgHeight" fill="#fff" />

      <!-- Y-axis grid lines and labels -->
      <g v-for="(line, idx) in yAxisLines" :key="'grid-' + idx">
        <line
          :x1="padding.left"
          :y1="line.y"
          :x2="svgWidth - padding.right"
          :y2="line.y"
          :stroke="line.color"
          :stroke-width="line.width"
          :stroke-dasharray="line.dash"
        />
        <text
          :x="padding.left - 6"
          :y="line.y + 4"
          text-anchor="end"
          font-size="11"
          fill="#666"
        >{{ line.label }}</text>
      </g>

      <!-- X-axis labels -->
      <g v-for="(d, idx) in xAxisLabels" :key="'xlabel-' + idx">
        <text
          :x="d.x"
          :y="svgHeight - padding.bottom + 16"
          text-anchor="middle"
          font-size="10"
          fill="#666"
        >{{ d.label }}</text>
      </g>

      <!-- Data line -->
      <polyline
        :points="dataPoints"
        fill="none"
        stroke="#409eff"
        stroke-width="2"
      />

      <!-- Data points -->
      <circle
        v-for="(pt, idx) in dataPointCoords"
        :key="'pt-' + idx"
        :cx="pt.x"
        :cy="pt.y"
        r="4"
        fill="#409eff"
        stroke="#fff"
        stroke-width="1.5"
      />
    </svg>
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      暂无数据
    </div>
  </div>
</template>

<script setup lang="ts">
interface LjDataPoint {
  testTime?: string
  testValue: number
}

interface LjChartLine {
  val: number
  color: string
  width: number
  dash: string
  label: string
}

const props = withDefaults(defineProps<{
  data?: LjDataPoint[]
  mean?: number
  sd?: number
  width?: number
  height?: number
}>(), {
  data: () => [],
  mean: 0,
  sd: 0,
  width: 800,
  height: 350,
});

const containerRef = ref<HTMLElement | null>(null);

const padding = { top: 20, right: 20, bottom: 40, left: 60 };

const svgWidth = computed(() => props.width);
const svgHeight = computed(() => props.height);
const chartW = computed(() => svgWidth.value - padding.left - padding.right);
const chartH = computed(() => svgHeight.value - padding.top - padding.bottom);

const chartData = computed(() => props.data || []);

const yMin = computed(() => {
  if (chartData.value.length === 0) return 0;
  const vals = chartData.value.map((d) => d.testValue);
  const min = Math.min(...vals, props.mean - (props.sd * 3 || 0));
  return min - Math.abs(min) * 0.1 || min - 1;
});

const yMax = computed(() => {
  if (chartData.value.length === 0) return 100;
  const vals = chartData.value.map((d) => d.testValue);
  const max = Math.max(...vals, props.mean + (props.sd * 3 || 0));
  return max + Math.abs(max) * 0.1 || max + 1;
});

const xScale = (i: number) => {
  return padding.left + (i / Math.max(chartData.value.length - 1, 1)) * chartW.value;
};

const yScale = (v: number) => {
  return padding.top + chartH.value - ((v - yMin.value) / (yMax.value - yMin.value)) * chartH.value;
};

const referenceLines = computed<LjChartLine[]>(() => {
  const s = props.sd || 0;
  const m = props.mean || 0;
  return [
    { val: m, color: "#333", width: 2, dash: "", label: m.toFixed(2) },
    { val: m + s, color: "#e6a23c", width: 1.5, dash: "6,3", label: (m + s).toFixed(2) },
    { val: m - s, color: "#e6a23c", width: 1.5, dash: "6,3", label: (m - s).toFixed(2) },
    { val: m + 2 * s, color: "#e6a23c", width: 1.5, dash: "4,4", label: (m + 2 * s).toFixed(2) },
    { val: m - 2 * s, color: "#e6a23c", width: 1.5, dash: "4,4", label: (m - 2 * s).toFixed(2) },
    { val: m + 3 * s, color: "#f56c6c", width: 1.5, dash: "3,5", label: (m + 3 * s).toFixed(2) },
    { val: m - 3 * s, color: "#f56c6c", width: 1.5, dash: "3,5", label: (m - 3 * s).toFixed(2) },
  ];
});

const yAxisLines = computed(() => {
  return referenceLines.value.map((line) => ({
    y: yScale(line.val),
    color: line.color,
    width: line.width,
    dash: line.dash,
    label: line.label,
  }));
});

const xAxisLabels = computed(() => {
  const step = Math.max(1, Math.floor(chartData.value.length / 8));
  const result: { x: number; label: string }[] = [];
  for (let i = 0; i < chartData.value.length; i += step) {
    const d = chartData.value[i];
    const label = d.testTime ? d.testTime.slice(5, 16) : String(i + 1);
    result.push({ x: xScale(i), label });
  }
  return result;
});

const dataPoints = computed(() => {
  return chartData.value
    .map((d, i) => `${xScale(i)},${yScale(d.testValue)}`)
    .join(" ");
});

const dataPointCoords = computed(() => {
  return chartData.value.map((d, i) => ({
    x: xScale(i),
    y: yScale(d.testValue),
  }));
});
</script>

<style scoped>
.lj-chart-container {
  overflow: hidden;
}

.lj-chart-svg {
  display: block;
}
</style>
