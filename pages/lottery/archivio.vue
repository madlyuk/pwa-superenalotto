<template>
  <div>
    <div class="header-section text-center">
      <h1 class="main-title">SuperEnalotto Storico</h1>
      <p class="subtitle">Consulta tutte le estrazioni passate</p>
    </div>

    <!-- Filtri -->
    <div class="filter-controls glass-panel">
      <div class="filter-group">
        <label>Anno</label>
        <select v-model="year" @change="fetchDraws" class="glass-select">
          <option value="">Tutti gli anni</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Mese</label>
        <select v-model="month" @change="fetchDraws" class="glass-select">
          <option value="">Tutti i mesi</option>
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <button @click="downloadExcel" class="export-button">
        📥 Scarica Excel
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center my-8 text-slate-400">
      Caricamento in corso...
    </div>

    <!-- Empty State -->
    <div v-else-if="!draws || draws.length === 0" class="empty-state">
      <h2>Nessuna estrazione trovata</h2>
      <p>Modifica i filtri per cercare altre date.</p>
    </div>

    <!-- Grid Estrazioni -->
    <div v-else class="draws-grid">
      <div v-for="draw in draws" :key="draw.id" class="draw-card glass-panel">
        <div class="card-header">
          <div class="draw-number">Estrazione n. {{ draw.draw_number }}</div>
          <div class="draw-date">{{ formatDate(draw.date) }}</div>
        </div>

        <div class="numbers-container">
          <div v-for="(num, idx) in draw.winning_numbers" :key="'win-'+idx" class="ball winning-ball">
            {{ num }}
          </div>
        </div>

        <div v-if="draw.jolly || draw.superstar" class="extra-numbers">
          <div v-if="draw.jolly" class="extra-group">
            <span class="extra-label">Jolly</span>
            <div class="ball jolly-ball">{{ draw.jolly }}</div>
          </div>
          <div v-if="draw.superstar" class="extra-group">
            <span class="extra-label">SuperStar</span>
            <div class="ball star-ball">{{ draw.superstar }}</div>
          </div>
        </div>

        <div v-if="draw.jackpot" class="draw-footer">
          <span class="jackpot-label">Montepremi Stimato:</span>
          <span class="jackpot-value">
            {{ new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(draw.jackpot) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'lottery'
})

const year = ref('')
const month = ref('')
const draws = ref([])
const pending = ref(true)

// Popola anni e mesi
const currentYearNum = new Date().getFullYear()
const years = Array.from({ length: currentYearNum - 1997 + 1 }, (_, i) => currentYearNum - i)
const months = [
  { value: '1', label: 'Gennaio' }, { value: '2', label: 'Febbraio' },
  { value: '3', label: 'Marzo' }, { value: '4', label: 'Aprile' },
  { value: '5', label: 'Maggio' }, { value: '6', label: 'Giugno' },
  { value: '7', label: 'Luglio' }, { value: '8', label: 'Agosto' },
  { value: '9', label: 'Settembre' }, { value: '10', label: 'Ottobre' },
  { value: '11', label: 'Novembre' }, { value: '12', label: 'Dicembre' }
]

const fetchDraws = async () => {
  pending.value = true
  const token = useCookie('auth_token')
  
  const params = new URLSearchParams()
  if (year.value) params.set('year', year.value)
  if (month.value) params.set('month', month.value)
  
  try {
    // Usiamo useFetch o fetch standard
    const res = await $fetch(`http://localhost:8000/api/lottery/draws/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    draws.value = res
  } catch (error) {
    console.error("Errore fetch:", error)
    draws.value = []
  } finally {
    pending.value = false
  }
}

const downloadExcel = () => {
  const params = new URLSearchParams()
  if (year.value) params.set('year', year.value)
  if (month.value) params.set('month', month.value)
  
  window.location.href = `http://localhost:8000/api/lottery/draws/export_excel/?${params.toString()}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('it-IT', { 
    day: '2-digit', month: 'long', year: 'numeric' 
  }).format(new Date(dateString))
}

onMounted(() => {
  fetchDraws()
})
</script>

<style scoped>
.text-center { text-align: center; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }
.text-slate-400 { color: #94a3b8; }
</style>
