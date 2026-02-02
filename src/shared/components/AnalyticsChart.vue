<template>
  <div class="analytics-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController,
  DoughnutController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController,
  DoughnutController
)

interface Props {
  type: 'line' | 'bar' | 'doughnut'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
    }>
  }
  options?: any
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  // Ensure data has at least empty arrays to prevent errors
  const chartData = {
    labels: props.data.labels || [],
    datasets: props.data.datasets || []
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        enabled: true
      }
    }
  }

  const config = {
    type: props.type,
    data: chartData,
    options: { ...defaultOptions, ...props.options }
  }

  if (chartInstance) {
    chartInstance.destroy()
  }

  try {
    chartInstance = new ChartJS(chartCanvas.value, config)
  } catch (error) {
    console.error('Failed to create chart:', error)
  }
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.data = props.data
    chartInstance.update()
  }
}, { deep: true })

watch(() => props.type, () => {
  createChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.analytics-chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>

