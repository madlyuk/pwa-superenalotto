<template>
  <div class="my-ml-form-page custom-max-width mx-auto">
    <div class="page-header flex items-center justify-between mb-8">
      <div>
        <NuxtLink to="/lottery/my-ml" class="text-gray-400 hover:text-white mb-2 inline-block no-underline">
          &larr; Torna alla lista
        </NuxtLink>
        <h1 class="main-title text-4xl mb-2">Modifica Modello ML</h1>
        <p class="subtitle text-gray-400">Aggiorna la descrizione o il nome della tua IA.</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      Caricamento dati modello...
    </div>

    <div v-else class="glass-panel form-container w-full">
      <form @submit.prevent="submitModel" class="flex flex-col gap-6">
        
        <div class="form-group">
          <label for="name">Nome del Modello <span class="text-red-400">*</span></label>
          <input type="text" id="name" v-model="form.name" class="glass-input" required />
        </div>

        <div class="form-group">
          <label for="description">Descrivi la tua intelligenza (Prompt) <span class="text-red-400">*</span></label>
          <textarea id="description" v-model="form.description" class="glass-input" rows="6" required></textarea>
          <span class="text-xs text-gray-500 mt-1">Salvare una nuova descrizione rigenererà il codice dell'IA tramite Gemini.</span>
        </div>

        <div class="form-group">
          <label for="python_code">Codice Generato dall'IA (Sola Lettura)</label>
          <textarea id="python_code" v-model="form.python_code" class="glass-input code-input opacity-70 cursor-not-allowed" rows="10" readonly></textarea>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="is_active" v-model="form.is_active" class="w-4 h-4 rounded text-purple-600 bg-gray-700 border-gray-600" />
          <label for="is_active" class="!text-gray-300">Modello Attivo (mostralo nei calcoli)</label>
        </div>

        <div v-if="error" class="bg-red-900/30 text-red-300 p-3 rounded-lg text-sm border border-red-800">
          {{ error }}
        </div>

        <div class="form-actions">
          <NuxtLink to="/lottery/my-ml" class="export-button cancel-btn no-underline">
            Annulla
          </NuxtLink>
          <button type="submit" class="export-button save-btn" :disabled="saving">
            {{ saving ? 'Salvataggio in corso...' : 'Salva Modifiche' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'lottery',
})

const route = useRoute()
const router = useRouter()
const token = useCookie('auth_token')
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  description: '',
  python_code: '',
  is_active: true
})

onMounted(async () => {
  try {
    const data = await $fetch(`http://localhost:8000/api/lottery/my-ml-models/${route.params.id}/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    form.value = {
      name: data.name,
      description: data.description,
      python_code: data.python_code,
      is_active: data.is_active
    }
  } catch (err) {
    console.error("Errore caricamento modello:", err)
    alert("Impossibile caricare il modello.")
    router.push('/lottery/my-ml')
  } finally {
    loading.value = false
  }
})

const submitModel = async () => {
  saving.value = true
  error.value = ''
  
  try {
    await $fetch(`http://localhost:8000/api/lottery/my-ml-models/${route.params.id}/`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        ...form.value,
        is_public: false
      }
    })
    
    router.push('/lottery/my-ml')
  } catch (err) {
    console.error("Errore salvataggio:", err)
    if (err.response?._data?.name) {
      error.value = `Errore: ${err.response._data.name[0]}`
    } else {
      error.value = "Si è verificato un errore durante l'aggiornamento."
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-container {
  max-width: 800px;
  padding: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.checkbox-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  margin: 0;
}

.glass-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 100%;
  resize: vertical;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.code-input {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cancel-btn {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #9ca3af !important; /* gray-400 */
  box-shadow: none !important;
  width: auto;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #f3f4f6 !important;
}

.save-btn {
  width: auto;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  .cancel-btn, .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
