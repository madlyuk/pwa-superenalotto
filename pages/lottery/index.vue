<template>
  <div class="dashboard-page">
    <div class="page-header mb-8">
      <h1 class="text-3xl font-bold mb-2">Dashboard Previsioni</h1>
      <p class="text-gray-400">Ecco un riepilogo delle performance dei tuoi Modelli IA e delle estrazioni.</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending && !backtestRunning" class="loading-state glass-panel">
      <div class="loader-spinner"></div>
      <p class="mt-4 text-gray-400">Sincronizzazione dati in corso...</p>
    </div>

    <!-- Global Backtest Running Overlay -->
    <div v-if="backtestRunning" class="backtest-overlay glass-panel mb-8">
      <div class="loader-spinner"></div>
      <h2 class="text-xl font-bold mt-4 text-accent-warning">Addestramento IA in corso...</h2>
      <p class="text-gray-300 mt-2">Il sistema sta simulando tutte le estrazioni storiche.</p>
      <p class="text-sm text-gray-500 mt-1">Non chiudere questa pagina. I dati si aggiorneranno automaticamente al termine.</p>
    </div>

    <div class="tabs-container mb-6">
      <div class="tabs-nav">
        <button class="tab-btn" :class="{ active: activeTab === 'vincite' }" @click="activeTab = 'vincite'">
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> 
          Vincite
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'previsioni' }" @click="activeTab = 'previsioni'">
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> 
          Previsioni
        </button>
        <button class="tab-btn" :class="{ active: activeTab === 'distribuzioni' }" @click="activeTab = 'distribuzioni'">
          <svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> 
          Distribuzioni
        </button>
      </div>
    </div>
    
    <div v-show="activeTab === 'vincite'">
    <!-- Top Charts Grid -->
    <!-- Performance Modelli -->
    <div v-if="chartData && hasChartData" class="glass-panel chart-card mb-8">
      <div class="card-header">
          <h3 class="card-title">Storico Prestazioni Intelligenza Artificiale</h3>
        <div class="card-actions text-xs text-gray-500">Punteggio Cumulativo</div>
      </div>
      <div class="chart-wrapper">
        <ClientOnly>
          <Line :data="chartData" :options="chartOptions" />
        </ClientOnly>
      </div>
    </div>

    <!-- 6 Doughnuts (Hit Rate) -->
    <div v-if="hasHitsData" class="hit-rates-section mb-10">
      <h2 class="text-xl font-bold mb-4">Vittorie su Numero Estratto</h2>
      
      <!-- Global Legend -->
      <div class="global-legend mb-6">
        <div v-for="(model, idx) in modelsLegend" :key="idx" class="legend-item">
          <span class="legend-color-box" :style="{ backgroundColor: model.color }"></span>
          <span class="legend-label">{{ model.name }}</span>
        </div>
      </div>

      <div class="hit-rates-grid">
        <div v-for="(chart, idx) in hitChartsData" :key="idx" class="glass-panel chart-card-mini">
          <div class="card-header-mini">
            <h4 class="card-title-mini">{{ idx + 1 }} Numer{{ idx === 0 ? 'o' : 'i' }}</h4>
          </div>
        <div class="doughnut-wrapper">
          <ClientOnly>
            <Doughnut :data="chart" :options="doughnutOptions" />
          </ClientOnly>
        </div>
        </div>
      </div>
    </div>


      <div v-if="barChartData && hasChartData" class="glass-panel chart-card mb-8">
        <div class="card-header">
            <h3 class="card-title">Dettaglio Vincite Giornaliere</h3>
            <div class="card-actions text-xs text-gray-500">Numeri esatti indovinati per singola data</div>
        </div>
        <div class="chart-wrapper-sm">
          <ClientOnly>
            <Bar :data="barChartData" :options="barChartOptions" />
          </ClientOnly>
        </div>
      </div>
    </div> <!-- Fine tab Vincite -->
    
    <div v-show="activeTab === 'distribuzioni'">
    <!-- Distribution Charts -->
    <div v-if="hasDistributions" class="mb-8">
      <h2 class="text-xl font-bold mb-4">Distribuzione Frequenze</h2>
      <div class="dashboard-grid grid-cols-2">
        <div v-for="(chart, name) in distributionCharts" :key="name" class="glass-panel chart-card">
          <div class="card-header">
            <h3 class="card-title">{{ name }}</h3>
          </div>
          <div class="chart-wrapper-sm">
            <ClientOnly>
              <Line :data="chart" :options="distChartOptions" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline/Recent Activity -->
    </div> <!-- Fine tab Distribuzioni -->
    <div v-show="activeTab === 'previsioni'">
    <div v-if="!pending" class="glass-panel mb-10 mt-6">
      <div class="card-header mb-6">
        <h3 class="card-title">Estrazioni e Previsioni</h3>
      </div>

      <!-- Filtri -->
      <div class="filters-bar mb-6">
        <div class="filter-group">
          <label class="filter-label">Filtro Giocate</label>
          <button class="filter-toggle" :class="{ active: filterPlayed }" @click="filterPlayed = !filterPlayed">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            {{ filterPlayed ? 'Solo Giocate' : 'Tutte' }}
          </button>
        </div>
        <div class="filter-group">
          <label class="filter-label">Filtro Vincite (numeri indovinati)</label>
          <div class="filter-chips">
            <button class="filter-chip" :class="{ active: filterWins === null }" @click="filterWins = null">Tutte</button>
            <button v-for="n in 6" :key="n" class="filter-chip" :class="{ active: filterWins === n }" @click="filterWins = n">
              {{ n }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="activity-table-wrapper">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Estrazione Reale</th>
              <th>Previsioni Modelli (Ordinate per Vittoria)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredTimeline" :key="item.date" :class="{'is-future': !item.real_draw}">
              <!-- Data -->
              <td class="td-date">
                <div class="date-text">{{ formatDate(item.date) }}</div>
                <span v-if="!item.real_draw" class="result-badge pending mt-2 block w-fit">In corso</span>
              </td>

              <!-- Estrazione Reale -->
              <td class="td-real">
                <div v-if="item.real_draw" class="numbers-row">
                  <div v-for="(num, i) in item.real_draw.winning_numbers" :key="'win-'+i" class="num-ball win-ball">
                    {{ num }}
                  </div>
                </div>
                <div v-if="item.winner" class="result-badge won mt-3 block w-fit">{{ item.winner }}</div>
                <div v-else-if="!item.real_draw" class="text-gray-500 italic text-sm mt-2">In attesa dei numeri...</div>
              </td>

              <!-- Modelli -->
              <td class="td-models">
                <div v-if="!item.predictions || item.predictions.length === 0" class="text-gray-500 text-sm italic">
                  Nessuna previsione.
                </div>
                <div v-else class="model-stack">
                  <div v-for="pred in item.predictions" :key="pred.id" class="model-row" :class="{'is-human': pred.logic_version.startsWith('👤')}">
                    <span class="model-name">{{ pred.logic_version }}</span>
                    <div class="numbers-row small">
                      <div v-for="(num, i) in pred.predicted_numbers" :key="'pred-'+i" class="num-ball pred-ball">
                        {{ num }}
                      </div>
                    </div>
                    <div class="model-status">
                      <span v-if="pred.is_evaluated" class="status-badge" :class="getMatchClass(pred.matched_numbers)">
                        {{ pred.matched_numbers }}/6
                      </span>
                      <button @click="togglePlayed(pred)" class="btn-played" :class="{'played': pred.is_played}" :title="pred.is_played ? 'Giocata ✓' : 'Non giocata'">
                        {{ pred.is_played ? '✅ Giocata' : '☐ Non giocata' }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination-controls mt-6">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1 || pending" class="btn-outline">
          Precedenti
        </button>
        <span class="page-info">Pagina {{ currentPage }} di {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages || pending" class="btn-outline">
          Successivi
        </button>
      </div>
    </div>
      </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

definePageMeta({
  layout: 'lottery'
})

const timeline = ref([])
const activeTab = ref('vincite')
const filterPlayed = ref(false)
const filterWins = ref(null)

const filteredTimeline = computed(() => {
  if (!filterPlayed.value && filterWins.value === null) return timeline.value

  return timeline.value.map(item => {
    if (!item.predictions || item.predictions.length === 0) return null

    const matchingPreds = item.predictions.filter(pred => {
      if (filterPlayed.value && !pred.is_played) return false
      if (filterWins.value !== null && Number(pred.matched_numbers || 0) !== Number(filterWins.value)) return false
      return true
    })

    if (matchingPreds.length === 0) return null

    return {
      ...item,
      predictions: matchingPreds
    }
  }).filter(Boolean)
})
const pending = ref(true)
const customTargetDate = ref('')
const chartData = ref(null)
const barChartData = ref(null)
const hasChartData = ref(false)

const hitChartsData = ref([])
const hasHitsData = ref(false)

const distributionsData = ref(null)
const hasDistributions = ref(false)
const distributionCharts = ref({})

const currentPage = ref(1)
const totalPages = ref(1)

const backtestRunning = ref(false)
let backtestPollInterval = null

const zoomConfig = {
  pan: {
    enabled: true,
    mode: 'x'
  },
  zoom: {
    drag: {
      enabled: true,
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      borderColor: '#8B5CF6',
      borderWidth: 1
    },
    wheel: {
      enabled: true
    },
    pinch: {
      enabled: true
    },
    mode: 'x'
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#e2e8f0' } },
    title: { display: true, text: 'Vittorie Cumulative (Punti)', color: '#f8fafc' },
    tooltip: { mode: 'index', intersect: false },
    zoom: zoomConfig
  },
  scales: {
    y: { 
      ticks: { color: '#94a3b8' }, 
      grid: { color: 'rgba(255,255,255,0.1)' },
      title: { display: true, text: 'Punti Cumulativi', color: '#9CA3AF' }
    },
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#e2e8f0' } },
    title: { display: true, text: 'Dettaglio Vincite Giornaliere (Numeri Indovinati)', color: '#f8fafc' },
    tooltip: { mode: 'index', intersect: false },
    zoom: zoomConfig
  },
  scales: {
    y: { 
      beginAtZero: true,
      min: 0,
      max: 6,
      ticks: { color: '#94a3b8', stepSize: 1 }, 
      grid: { color: 'rgba(255,255,255,0.1)' },
      title: { display: true, text: 'Numeri Indovinati (0 - 6)', color: '#9CA3AF' }
    },
    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } }
  }
}

const distChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    x: { ticks: { color: '#94a3b8', maxTicksLimit: 15 }, grid: { display: false } }
  },
  elements: {
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index' }
  },
  cutout: '65%'
}

// Per la global legend
const modelsLegend = ref([])
const backtestPolling = ref(false)

const buildChartData = (stats) => {
  if (!stats || Object.keys(stats).length === 0) return;
  
  // Raccogliamo tutte le date uniche
  const allDatesSet = new Set()
  Object.values(stats).forEach(model => {
    model.dates.forEach(d => allDatesSet.add(d))
  })
  
  const labels = Array.from(allDatesSet).sort()
  
  const datasets = []
  const barDatasets = []
  const hitLabels = []
  const hitBgColors = []
  const hitsByNumber = [[], [], [], [], [], []]
  
  const mlModels = Object.keys(stats).filter(k => !k.startsWith('👤'))
  const totalMl = mlModels.length
  let mlCount = 0
  
  modelsLegend.value = []

  for (const [logic, data] of Object.entries(stats)) {
    // Riempiamo i buchi: se un modello non ha score in una data, mantiene lo score precedente
    const dataPoints = []
    const barData = []
    let lastScore = 0
    labels.forEach(date => {
      const idx = data.dates.indexOf(date)
      if (idx !== -1) {
        lastScore = data.scores[idx]
        barData.push(data.daily_hits ? (data.daily_hits[idx] || 0) : 0)
      } else {
        barData.push(0)
      }
      dataPoints.push(lastScore)
    })
    
    const isHuman = logic.startsWith('👤')
    
    let color = ''
    if (isHuman) {
      color = '#10b981' // emerald-500
    } else {
      const hue = (200 + (mlCount * (360 / Math.max(1, totalMl)))) % 360
      color = `hsl(${hue}, 75%, 60%)`
      mlCount++
    }
    
    datasets.push({
      label: logic,
      data: dataPoints,
      borderColor: color,
      backgroundColor: color,
      tension: 0.3,
      borderDash: isHuman ? [5, 5] : []
    })

    barDatasets.push({
      label: logic,
      data: barData,
      backgroundColor: color,
      borderRadius: 4
    })
    
    // Preparazione array Doughnut
    hitLabels.push(logic)
    hitBgColors.push(color)
    const hitsObj = data.hits || {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}
    for(let i=1; i<=6; i++) {
      hitsByNumber[i-1].push(hitsObj[i] || 0)
    }
    
    modelsLegend.value.push({ name: logic, color: color })
  }
  
  if (datasets.length > 0) {
    chartData.value = { labels, datasets }
    barChartData.value = { labels, datasets: barDatasets }
    hasChartData.value = true
    
    const hCharts = []
    for(let i=0; i<6; i++) {
      hCharts.push({
        labels: hitLabels,
        datasets: [{
          data: hitsByNumber[i],
          backgroundColor: hitBgColors,
          borderWidth: 0
        }]
      })
    }
    hitChartsData.value = hCharts
    hasHitsData.value = true
  }
}

const fetchTimeline = async () => {
  pending.value = true
  const token = useCookie('auth_token')
  
  try {
    const res = await $fetch(`http://localhost:8000/api/lottery/timeline/?page=${currentPage.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // Sort predictions by matched_numbers (descending)
    const sortedResults = res.results.map(item => {
      if (item.predictions) {
        item.predictions.sort((a, b) => {
          const matchA = a.matched_numbers || 0
          const matchB = b.matched_numbers || 0
          return matchB - matchA
        })
      }
      return item
    })
    
    timeline.value = sortedResults
    totalPages.value = res.total_pages
    
    // Costruiamo il grafico solo sulla prima pagina (o sempre, se chart_stats copre tutto)
    if (currentPage.value === 1) {
      buildChartData(res.chart_stats)
    }
  } catch (error) {
    console.error("Errore fetch timeline:", error)
    timeline.value = []
  } finally {
    pending.value = false
  }
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    fetchTimeline()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('it-IT', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  }).format(new Date(dateString))
}

const getMatchClass = (matches) => {
  if (matches >= 3) return 'text-emerald-400'
  if (matches > 0) return 'text-emerald-300'
  return 'text-slate-400'
}

const fetchDistributions = async () => {
  const token = useCookie('auth_token')
  try {
    const res = await $fetch(`http://localhost:8000/api/lottery/distributions/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    distributionsData.value = res.distributions
    
    const labels = Array.from({length: 90}, (_, i) => i + 1)
    const charts = {}
    
    const colors = ['#34d399', '#a78bfa', '#f59e0b', '#ec4899', '#60a5fa']
    let cIdx = 0
    
    for (const [name, distObj] of Object.entries(res.distributions)) {
      const dData = labels.map(num => distObj[num] || 0)
      const color = colors[cIdx % colors.length]
      
      charts[name] = {
        labels,
        datasets: [{
          label: 'Frequenza',
          data: dData,
          borderColor: color,
          backgroundColor: color + '33', // 20% opacity approx
          fill: true,
          tension: 0.4
        }]
      }
      cIdx++
    }
    
    distributionCharts.value = charts
    hasDistributions.value = Object.keys(charts).length > 0
  } catch (error) {
    console.error("Errore fetch distributions:", error)
    hasDistributions.value = false
  }
}

const togglePlayed = async (pred) => {
  const token = useCookie('auth_token')
  try {
    const newValue = !pred.is_played
    await $fetch(`http://localhost:8000/api/lottery/predictions/${pred.id}/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { is_played: newValue }
    })
    pred.is_played = newValue
  } catch (error) {
    console.error("Errore aggiornamento previsione:", error)
    alert("Errore durante il salvataggio.")
  }
}

const checkBacktestStatus = async () => {
  if (backtestPolling.value) return
  
  // reset legend
  modelsLegend.value = []

  const token = useCookie('auth_token')
  try {
    const response = await $fetch(`http://localhost:8000/api/lottery/backtest-status/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    
    if (response.is_running) {
      backtestRunning.value = true
      if (!backtestPollInterval) startBacktestPolling()
    } else {
      if (backtestRunning.value) {
        // È appena finito!
        backtestRunning.value = false
        stopBacktestPolling()
        alert('L\'addestramento storico è stato completato con successo!')
        currentPage.value = 1
        fetchTimeline() // Ricarica la tabella
        fetchDistributions() // Ricarica i grafici
      }
    }
  } catch (err) {
    console.error('Error checking backtest status:', err)
  }
}

const startBacktestPolling = () => {
  if (backtestPollInterval) clearInterval(backtestPollInterval)
  backtestPollInterval = setInterval(checkBacktestStatus, 5000)
}

const stopBacktestPolling = () => {
  if (backtestPollInterval) {
    clearInterval(backtestPollInterval)
    backtestPollInterval = null
  }
}

const refreshTrigger = useState('refreshLotteryData', () => 0)
watch(refreshTrigger, async () => {
  currentPage.value = 1
  await fetchTimeline()
  await fetchDistributions()
})

onMounted(() => {
  fetchTimeline()
  fetchDistributions()
  checkBacktestStatus()
})

onUnmounted(() => {
  stopBacktestPolling()
})
</script>

<style scoped>
.dashboard-page {
  animation: fadeIn 0.4s ease-out;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.hit-rates-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .hit-rates-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .hit-rates-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1024px) {
  .hit-rates-grid { grid-template-columns: repeat(6, 1fr); }
}

/* Global Legend */
.global-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  background: rgba(0,0,0,0.1);
  padding: 1rem;
  border-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.legend-color-box {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart-card-mini {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-header-mini {
  margin-bottom: 0.5rem;
  text-align: center;
}

.card-title-mini {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.doughnut-wrapper {
  position: relative;
  height: 90px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-wrapper {
  position: relative;
  height: 280px;
  width: 100%;
  margin-top: 1rem;
}

.chart-wrapper-sm {
  position: relative;
  height: 220px;
  width: 100%;
  margin-top: 1rem;
}

/* Activity Table */
.activity-table-wrapper {
  width: 100%;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.activity-table th {
  text-align: left;
  padding: 1rem 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--surface-border);
}

.activity-table td {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  vertical-align: top; /* Align to top instead of middle for stacks */
}

.activity-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.activity-table tr.is-future td {
  background: rgba(139, 92, 246, 0.03);
}

.date-text {
  font-weight: 500;
}

.badge-future {
  font-size: 0.7rem;
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
  display: inline-block;
}

.numbers-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.numbers-row.small {
  gap: 0.2rem;
}

.num-ball {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.win-ball {
  background: linear-gradient(135deg, var(--accent-success), #059669);
}

.pred-ball {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}

.model-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.model-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0,0,0,0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.model-row.is-human {
  border-left: 2px solid var(--accent-success);
}

.model-name {
  font-size: 0.8rem;
  font-weight: 500;
  width: 120px;
  color: #cbd5e1;
}

.model-row.is-human .model-name {
  color: var(--accent-success);
}

.model-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
}

.match-high { color: var(--accent-success); }
.match-med { color: #6ee7b7; }
.match-low { color: var(--text-secondary); }

.btn-played {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #9CA3AF;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-played:hover { border-color: rgba(255, 255, 255, 0.3); }
.btn-played.played { 
  background: rgba(16, 185, 129, 0.15); 
  border-color: #10B981; 
  color: #34D399; 
}

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}
.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-label { font-size: 0.75rem; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.filter-toggle {
  display: flex; align-items: center; gap: 0.5rem;
  background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  padding: 6px 14px; color: #9CA3AF; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
}
.filter-toggle.active { border-color: #10B981; color: #34D399; }
.toggle-track {
  width: 36px; height: 20px; border-radius: 10px; background: rgba(255,255,255,0.1);
  display: flex; align-items: center; padding: 2px; transition: background 0.2s;
}
.filter-toggle.active .toggle-track { background: #10B981; }
.toggle-thumb {
  width: 16px; height: 16px; border-radius: 50%; background: white; transition: transform 0.2s;
}
.filter-toggle.active .toggle-thumb { transform: translateX(16px); }
.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-chip {
  padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: #9CA3AF; cursor: pointer; transition: all 0.2s;
}
.filter-chip:hover { border-color: rgba(255,255,255,0.3); color: #F8FAFC; }
.filter-chip.active { background: var(--accent-primary, #8B5CF6); border-color: var(--accent-primary, #8B5CF6); color: white; }

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-icon:hover { opacity: 1; }
.btn-icon.played { opacity: 1; }

.result-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  max-width: 100%;
  white-space: normal;
  word-break: break-word;
}

.result-badge.won {
  background: rgba(16, 185, 129, 0.15);
  color: var(--accent-success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.result-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-warning);
}

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  padding: 0.5rem 1.25rem;
  border-radius: 99px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover:not(:disabled) {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
}

.btn-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.2);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Grid */
@media (max-width: 1024px) {
  .dashboard-grid, .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  .chart-card.col-span-2 {
    grid-column: span 1;
  }
}

/* Modern Minimal Tabs */
.tabs-container { 
  width: 100%; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}
.tabs-nav {
  display: flex; 
  gap: 2rem;
  overflow-x: auto;
}
.tab-btn {
  padding: 1rem 0.5rem; 
  color: #9CA3AF; /* gray-400 */
  font-weight: 600; 
  font-size: 1.05rem; 
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
}
.tab-btn:hover { 
  color: #F8FAFC; /* slate-50 */
}
.tab-btn.active {
  color: var(--accent-primary, #8B5CF6); 
  border-bottom: 2px solid var(--accent-primary, #8B5CF6);
}
.tab-icon {
  width: 20px; 
  height: 20px; 
  margin-right: 8px; 
  display: inline-block; 
  vertical-align: text-bottom;
}
.chart-wrapper { height: 450px; }
.chart-wrapper-sm { position: relative; height: 300px; width: 100%; margin-top: 1rem; }

/* Modern Minimal Tabs */
.tabs-container { 
  width: 100%; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}
.tabs-nav {
  display: flex; 
  gap: 2rem;
  overflow-x: auto;
}
.tab-btn {
  padding: 1rem 0.5rem; 
  color: #9CA3AF; /* gray-400 */
  font-weight: 600; 
  font-size: 1.05rem; 
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
}
.tab-btn:hover { 
  color: #F8FAFC; /* slate-50 */
}
.tab-btn.active {
  color: var(--accent-primary, #8B5CF6); 
  border-bottom: 2px solid var(--accent-primary, #8B5CF6);
}
.tab-icon {
  width: 20px; 
  height: 20px; 
  margin-right: 8px; 
  display: inline-block; 
  vertical-align: text-bottom;
}
.chart-wrapper { height: 450px; }
.chart-wrapper-sm { position: relative; height: 300px; width: 100%; margin-top: 1rem; }
</style>
