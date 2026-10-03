<template>
  <div class="classifica-page">
    <div class="header-section text-center mb-10">
      <h1 class="main-title text-5xl mb-2">Classifica Oracolo</h1>
      <p class="subtitle text-xl">Le logiche più precise che hanno sfiorato (o raggiunto) il 6</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center my-12 text-slate-400">
      Calcolo della classifica in corso...
    </div>

    <div v-else-if="leaderboard.length === 0" class="text-center my-12 text-slate-400">
      Ancora nessuna logica ha indovinato almeno 3 numeri. Il tempo ci dirà la verità!
    </div>

    <div v-else>
      <div class="models-list">
        <div v-for="(item, index) in leaderboard" :key="item.logic_version" class="model-card-thin glass-panel" :class="{'is-first': index === 0, 'is-human': item.logic_version.startsWith('👤')}">
          
          <div class="card-top-section">
             <div class="ml-info">
                <div v-if="index === 0" class="best-badge-inline">🏆 Campione Assoluto</div>
                <div v-else-if="index === 1" class="silver-badge-inline">🥈 Secondo Posto</div>
                <div v-else-if="index === 2" class="bronze-badge-inline">🥉 Terzo Posto</div>

                <h3 class="text-xl font-semibold" :class="getHeadingClass(item, index)">
                  {{ formatName(item.logic_version) }}
                </h3>
             </div>

             <div class="stats-container-inline">
                <div class="stat-box" v-if="item.hits[6] > 0">
                   <span class="stat-value text-fuchsia-400">{{ item.hits[6] }}</span>
                   <span class="stat-label">Sestine (6)</span>
                </div>
                <div class="stat-box" v-if="item.hits[5] > 0">
                   <span class="stat-value text-amber-400">{{ item.hits[5] }}</span>
                   <span class="stat-label">Cinquine (5)</span>
                </div>
                <div class="stat-box" v-if="item.hits[4] > 0">
                   <span class="stat-value text-sky-400">{{ item.hits[4] }}</span>
                   <span class="stat-label">Quaterne (4)</span>
                </div>
                <div class="stat-box" v-if="item.hits[3] > 0">
                   <span class="stat-value text-emerald-400">{{ item.hits[3] }}</span>
                   <span class="stat-label">Terni (3)</span>
                </div>
             </div>
          </div>
          
          <div class="card-divider"></div>
          
          <div class="card-bottom-section">
             <div class="card-actions">
                <button class="info-btn" @click="toggleInfo(item.logic_version)">
                   {{ expandedCards[item.logic_version] ? 'Chiudi Info' : 'Info Logica' }}
                </button>
             </div>
          </div>

          <!-- Accordion Content -->
          <div v-show="expandedCards[item.logic_version]" class="accordion-content">
             <div class="description-box mb-2">
               <h4 class="text-md font-bold text-slate-200 mb-2">Descrizione</h4>
               <p class="text-sm text-slate-300 leading-relaxed italic" style="white-space: pre-line;">
                 {{ item.description }}
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

definePageMeta({
  layout: 'lottery'
})

const leaderboard = ref([])
const pending = ref(true)
const expandedCards = ref({})

const toggleInfo = (id) => {
  expandedCards.value[id] = !expandedCards.value[id]
}

const formatName = (name) => {
  return name.startsWith('👤') ? name.replace('👤 ', '') : name
}

const getHeadingClass = (item, index) => {
  if (item.logic_version.startsWith('👤')) return 'text-emerald-300'
  if (index === 0) return 'text-amber-400'
  return 'text-purple-300'
}

const fetchLeaderboard = async () => {
  pending.value = true
  const token = useCookie('auth_token')
  
  try {
    const res = await $fetch(`http://localhost:8000/api/lottery/leaderboard/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    
    if (res && res.length > 0) {
      leaderboard.value = res
    }
  } catch (error) {
    console.error("Errore recupero classifica:", error)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
.classifica-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.models-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.model-card-thin {
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.model-card-thin:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px -5px rgba(139, 92, 246, 0.2);
}

.model-card-thin.is-first {
  border: 2px solid rgba(251, 191, 36, 0.8) !important;
  background: rgba(251, 191, 36, 0.1) !important;
  box-shadow: 0 0 25px rgba(251, 191, 36, 0.3) !important;
}

.model-card-thin.is-human {
  border: 1px solid rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.05);
}

.card-top-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1.25rem 0;
}

.card-bottom-section {
  display: flex;
  justify-content: flex-end;
}

.ml-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.best-badge-inline {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  width: fit-content;
}

.silver-badge-inline {
  display: inline-block;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  width: fit-content;
}

.bronze-badge-inline {
  display: inline-block;
  background: linear-gradient(135deg, #b45309 0%, #78350f 100%);
  color: white;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  width: fit-content;
}

.stats-container-inline {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin-top: 0.2rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.info-btn {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  cursor: pointer;
}

.info-btn:hover {
  background: rgba(56, 189, 248, 0.2);
}

.accordion-content {
  margin-top: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .card-top-section {
    flex-direction: column;
    gap: 1rem;
  }
  .card-bottom-section {
    justify-content: center;
  }
  .card-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
