<template>
  <div class="my-ml-page">
    <ClientOnly>
      <div class="page-header mb-8">
        <h1 class="main-title text-4xl mb-2">I Miei Modelli ML</h1>
        <p class="subtitle text-gray-400 mb-6">Gestisci, addestra e monitora i tuoi algoritmi previsionali privati.</p>
        
        <NuxtLink to="/lottery/my-ml/create" class="export-button inline-flex items-center gap-2 mb-6 text-white no-underline">
          <span>➕</span> Crea Nuovo Modello
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-10">
        Caricamento modelli in corso...
      </div>

      <div v-else-if="models.length === 0" class="glass-panel text-center py-10">
        <p class="text-gray-300 mb-4">Non hai ancora creato nessun modello ML.</p>
        <NuxtLink to="/lottery/my-ml/create" class="text-purple-400 hover:text-purple-300 underline">
          Creane uno adesso!
        </NuxtLink>
      </div>

      <div v-else class="glass-panel activity-table-wrapper">
        <table class="activity-table">
          <thead>
            <tr>
              <th style="width: 40%">Nome Modello</th>
              <th style="width: 45%">Stato Addestramento</th>
              <th style="width: 15%">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="model in models" :key="model.id">
              <td>
                <div class="text-lg font-bold text-white">{{ model.name }}</div>
                <span class="text-xs text-gray-500">{{ model.engine_class }}</span>
              </td>

              <td>
                <div class="status-badge" :class="model.run_status ? model.run_status.toLowerCase() : 'idle'">
                  {{ model.run_status || 'IDLE' }}
                </div>
                <div v-if="model.last_run_message" class="text-xs text-gray-500 mt-1">Info: {{ model.last_run_message }}</div>
              </td>
              <td>
                <div class="action-btn-group">
                  <button @click="trainModel(model.id)" class="action-btn train-btn" title="Addestra" :disabled="model.run_status === 'RUNNING' || trainingIds.includes(model.id)">
                    <svg v-if="model.run_status === 'RUNNING' || trainingIds.includes(model.id)" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="btn-label">Addestra</span>
                  </button>
                  <NuxtLink :to="`/lottery/my-ml/${model.id}`" class="action-btn edit-btn no-underline" title="Modifica">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    <span class="btn-label">Modifica</span>
                  </NuxtLink>
                  <button @click="deleteModel(model.id)" class="action-btn delete-btn" title="Elimina">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    <span class="btn-label">Elimina</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'lottery',
})

const models = ref([])
const loading = ref(true)
const trainingIds = ref([])
const token = useCookie('auth_token')

const fetchModels = async () => {
  try {
    const response = await $fetch('http://localhost:8000/api/lottery/my-ml-models/', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    // Supporta sia risposte paginate (Django REST) che array semplici
    models.value = response.results || response || []
  } catch (err) {
    console.error("Errore recupero modelli:", err)
    alert("Impossibile caricare i modelli.")
  } finally {
    loading.value = false
  }
}

const trainModel = async (id) => {
  if (!confirm("Sei sicuro di voler avviare un backtest completo per questo modello? L'operazione potrebbe richiedere alcuni minuti.")) return;
  
  trainingIds.value.push(id)
  try {
    await $fetch(`http://localhost:8000/api/lottery/my-ml-models/${id}/train/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    // Aggiorniamo la lista per vedere il nuovo status "RUNNING"
    await fetchModels()
  } catch (err) {
    console.error("Errore avvio training:", err)
    alert("Impossibile avviare l'addestramento.")
    trainingIds.value = trainingIds.value.filter(t_id => t_id !== id)
  }
}

const deleteModel = async (id) => {
  if (!confirm("Attenzione: questo eliminerà definitivamente il modello e tutto il suo storico di previsioni. Procedere?")) return;
  
  try {
    await $fetch(`http://localhost:8000/api/lottery/my-ml-models/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    models.value = models.value.filter(m => m.id !== id)
  } catch (err) {
    console.error("Errore cancellazione modello:", err)
    alert("Impossibile cancellare il modello.")
  }
}

onMounted(() => {
  fetchModels()
  
  // Polling per aggiornare gli stati se c'è qualcosa in esecuzione
  const interval = setInterval(() => {
    if (models.value.some(m => m.run_status === 'RUNNING')) {
      fetchModels()
    }
  }, 10000)
  
  onUnmounted(() => clearInterval(interval))
})
</script>


<style scoped>
/* Activity Table Styles (from dashboard) */
.activity-table-wrapper {
  width: 100%;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1rem;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
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
  vertical-align: middle;
}

.activity-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-block;
}
.status-badge.idle { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }
.status-badge.running { background: rgba(234, 179, 8, 0.2); color: #fde047; animation: pulse 2s infinite; }
.status-badge.success { background: rgba(34, 197, 94, 0.2); color: #86efac; }
.status-badge.failed { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

.action-btn-group {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #94a3b8; /* slate-400 */
}

.btn-label {
  display: none;
}

.train-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1); /* blue */
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.3);
}
.train-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-btn:hover {
  background: rgba(16, 185, 129, 0.1); /* emerald */
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.3);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1); /* red */
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Mobile Responsive Adjustments */
@media (max-width: 768px) {
  .activity-table, .activity-table tbody, .activity-table tr, .activity-table td {
    display: block;
    width: 100%;
  }
  
  .activity-table thead {
    display: none; /* Hide headers on mobile */
  }
  
  .activity-table tr {
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1rem;
    transition: transform 0.2s ease;
  }
  
  .activity-table tr:hover {
    transform: translateY(-2px);
  }
  
  .activity-table td {
    padding: 0.5rem 0;
    border: none;
  }
  
  /* Separator after Model Name */
  .activity-table td:first-child {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 0.5rem;
    padding-bottom: 0.75rem;
  }
  
  /* Actions container */
  .action-btn-group {
    margin-top: 0.5rem;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .action-btn {
    width: auto;
    padding: 0 0.75rem;
    gap: 0.35rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .btn-label {
    display: inline-block;
  }
}
</style>

