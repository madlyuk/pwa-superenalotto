<template>
  <div class="oracolo-page">
    <div class="header-section text-center mb-10">
      <h1 class="main-title text-5xl mb-2">L'Oracolo</h1>
      <p class="subtitle text-xl">Le previsioni dei nostri Modelli ML per la prossima estrazione</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center my-12 text-slate-400">
      Consultazione dell'oracolo in corso...
    </div>

    <div v-else-if="!nextDate" class="text-center my-12 text-slate-400">
      Nessuna previsione futura trovata. Lancia il motore ML dal terminale.
    </div>

    <div v-else>
      <div class="target-date-banner glass-panel text-center mb-8">
        <span class="text-slate-400 uppercase tracking-widest text-sm">Obiettivo</span>
        <h2 class="text-3xl font-bold text-white mt-1">{{ formatDate(nextDate) }}</h2>
      </div>

      <div class="models-list">
        <!-- Machine Learning Cards -->
        <div v-for="pred in mlPredictions" :key="pred.id" class="model-card-thin glass-panel" :class="{'is-best': pred.is_best}">
          
          <div class="card-top-section">
             <div class="ml-info">
                <div v-if="pred.is_best" class="best-badge-inline">🔥 Consigliato</div>
                <h3 class="text-xl font-semibold" :class="pred.is_best ? 'text-amber-400' : 'text-purple-300'">
                  {{ pred.logic_version }}
                </h3>
             </div>

             <div class="numbers-container-inline">
                <div v-for="(num, idx) in pred.predicted_numbers" :key="'num-'+idx" class="ball prediction-ball sm">
                  {{ num }}
                </div>
             </div>
          </div>
          
          <div class="card-divider"></div>
          
          <div class="card-bottom-section">
             <div class="card-actions">
                <button class="info-btn" @click="toggleInfo(pred.id)">
                   {{ expandedCards[pred.id] ? 'Chiudi Info' : 'Info' }}
                </button>
                <button class="play-btn-small" :class="{'played': pred.is_played}" @click="togglePlayed(pred)">
                  <span v-if="pred.is_played">✅ Giocata</span>
                  <span v-else>Gioca Sestina</span>
                </button>
             </div>
          </div>

          <!-- Accordion Content -->
          <div v-show="expandedCards[pred.id]" class="accordion-content">
             <div class="description-box mb-4">
               <h4 class="text-md font-bold text-slate-200 mb-2">Il Tuo Prompt / Descrizione</h4>
               <p class="text-sm text-slate-300 leading-relaxed italic bg-black bg-opacity-30 p-4 rounded-lg font-mono" style="white-space: pre-wrap;">
                 {{ pred.description || 'Nessun prompt fornito' }}
               </p>
             </div>
          </div>
        </div>

        <!-- Human Predictions -->
        <div v-if="humanPredictions.length > 0" class="model-card-thin glass-panel human-card mt-8">
           <h3 class="text-2xl font-semibold text-center human-text mb-6">
             Le Tue Sestine Personali
           </h3>
           <p class="text-sm text-slate-300 leading-relaxed text-center italic mb-6">
             Le tue combinazioni personali scelte manualmente.
           </p>

           <div class="human-stack-thin">
             <div v-for="pred in humanPredictions" :key="pred.id" class="human-item-thin bg-black bg-opacity-20 rounded-xl mb-4 p-4">
                
                <div class="card-top-section">
                   <div class="ml-info">
                      <h4 class="text-lg text-emerald-300 font-bold">{{ pred.logic_version.replace('👤 ', '') }}</h4>
                   </div>
                   <div class="numbers-container-inline">
                      <div v-for="(num, idx) in pred.predicted_numbers" :key="'num-'+idx" class="ball prediction-ball sm">
                        {{ num }}
                      </div>
                   </div>
                </div>
                
                <div class="card-divider"></div>
                
                <div class="card-bottom-section">
                   <div class="card-actions">
                      <button class="info-btn" @click="toggleInfo(pred.id)">
                         {{ expandedCards[pred.id] ? 'Chiudi Info' : 'Info' }}
                      </button>
                      <button class="play-btn-small" :class="{'played': pred.is_played}" @click="togglePlayed(pred)">
                         <span v-if="pred.is_played">✅ Giocata</span>
                         <span v-else>Gioca Sestina</span>
                      </button>
                   </div>
                </div>
                
                <!-- Accordion Content -->
                <div v-show="expandedCards[pred.id]" class="accordion-content">
                   <div class="description-box">
                     <h4 class="text-md font-bold text-slate-200 mb-2">Descrizione</h4>
                     <p class="text-sm text-slate-300 leading-relaxed italic" style="white-space: pre-line;">
                       {{ pred.description || 'Le tue combinazioni personali scelte manualmente.' }}
                     </p>
                   </div>
                </div>
                
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'lottery'
})

const nextDate = ref(null)
const nextPredictions = ref([])
const pending = ref(true)

const expandedCards = ref({})

const toggleInfo = (id) => {
  expandedCards.value[id] = !expandedCards.value[id]
}

const mlPredictions = computed(() => nextPredictions.value.filter(p => !p.logic_version.startsWith('👤')))
const humanPredictions = computed(() => nextPredictions.value.filter(p => p.logic_version.startsWith('👤')))

const fetchNextPredictions = async () => {
  pending.value = true
  const token = useCookie('auth_token')
  
  try {
    const res = await $fetch(`http://localhost:8000/api/lottery/timeline/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    
    if (res.results && res.results.length > 0) {
      const latest = res.results[0]
      if (!latest.real_draw) {
        nextDate.value = latest.date
        let bestScore = -1
        let bestIndex = -1
        
        // Sort predictions prioritizing highest hits first (6 down to 2), then cumulative
        if (latest.predictions) {
          const sortedPreds = [...latest.predictions].sort((a, b) => {
            const statsA = res.chart_stats ? res.chart_stats[a.logic_version] : null;
            const statsB = res.chart_stats ? res.chart_stats[b.logic_version] : null;
            
            if (!statsA && !statsB) return 0;
            if (!statsA) return 1;
            if (!statsB) return -1;

            // Compare hits from 6 down to 2
            for (let i = 6; i >= 2; i--) {
              const hitsA = statsA.hits[i] || 0;
              const hitsB = statsB.hits[i] || 0;
              if (hitsA !== hitsB) {
                return hitsB - hitsA;
              }
            }
            
            // Fallback to cumulative score if tied on higher hits
            return statsB.cumulative - statsA.cumulative;
          });
          
          let bestIndex = sortedPreds.findIndex(p => !p.logic_version.startsWith('👤'));
          
          nextPredictions.value = sortedPreds.map((p, index) => ({
            ...p,
            is_best: index === bestIndex && !p.logic_version.startsWith('👤')
          }))
        }
      }
    }
  } catch (error) {
    console.error("Errore oracolo:", error)
  } finally {
    pending.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('it-IT', { 
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' 
  }).format(new Date(dateString))
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

const refreshTrigger = useState('refreshLotteryData', () => 0)
watch(refreshTrigger, () => {
  fetchNextPredictions()
})

onMounted(() => {
  fetchNextPredictions()
})
</script>

<style scoped>
.oracolo-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
}

.target-date-banner {
  padding: 1.5rem;
  background: linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(56, 189, 248, 0.1));
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
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

.model-card-thin.is-best {
  border: 2px solid rgba(251, 191, 36, 0.8) !important;
  background: rgba(251, 191, 36, 0.1) !important;
  box-shadow: 0 0 25px rgba(251, 191, 36, 0.3) !important;
}

.model-card-thin.human-card {
  border: 2px solid rgba(16, 185, 129, 0.4);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
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

.numbers-container-inline {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.ball.sm {
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
}

.prediction-ball {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.is-best .prediction-ball {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
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

.play-btn-small {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  cursor: pointer;
}

.play-btn-small:hover {
  background: rgba(255, 255, 255, 0.2);
}

.is-best .play-btn-small {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #000;
}

.is-best .play-btn-small:hover {
  background: #fbbf24;
}

.play-btn-small.played {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
  color: #34d399;
}

.is-best .play-btn-small.played {
  background: #10b981;
  border-color: #059669;
  color: #fff;
}

.accordion-content {
  margin-top: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.human-item-thin {
  margin-bottom: 2.5rem;
}

.human-text {
  color: #34d399 !important;
  text-shadow: 0 0 10px rgba(52, 211, 153, 0.4);
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
