<template>
  <div class="my-ml-form-page custom-max-width mx-auto">
    <div class="page-header flex items-center justify-between mb-8">
      <div>
        <NuxtLink to="/lottery/my-ml" class="text-gray-400 hover:text-white mb-2 inline-block no-underline">
          &larr; Torna alla lista
        </NuxtLink>
        <h1 class="main-title text-4xl mb-2">Crea Nuovo Modello ML</h1>
        <p class="subtitle text-gray-400">Descrivi l'intelligenza artificiale che vuoi creare.</p>
      </div>
    </div>

    <div class="glass-panel form-container w-full">
      <form @submit.prevent="submitModel" class="flex flex-col gap-6">
        
        <div class="form-group">
          <label for="name">Nome del Modello <span class="text-red-400">*</span></label>
          <input type="text" id="name" v-model="form.name" class="glass-input" placeholder="Es. Il Mio Predittore Avanzato" required />
          <span class="text-xs text-gray-500 mt-1">Scegli un nome univoco per la tua IA.</span>
        </div>

        <div class="form-group">
          <label for="description">Descrivi la tua intelligenza (Prompt) <span class="text-red-400">*</span></label>
          <textarea id="description" v-model="form.description" class="glass-input" rows="6" placeholder="Spiega a parole tue come dovrebbe ragionare il modello (es. 'Usa un algoritmo genetico per trovare i numeri più frequenti negli ultimi mesi e scarta i ritardatari')..." required></textarea>
          <span class="text-xs text-gray-500 mt-1">Il sistema utilizzerà questa descrizione per generare automaticamente la logica Python del tuo modello.</span>
        </div>

        <div v-if="error" class="bg-red-900/30 text-red-300 p-3 rounded-lg text-sm border border-red-800">
          {{ error }}
        </div>

        <div class="form-actions flex justify-end gap-4 mt-4">
          <NuxtLink to="/lottery/my-ml" class="export-button !bg-transparent !border-gray-600 !text-gray-300 hover:!bg-white/5 no-underline">
            Annulla
          </NuxtLink>
          <button type="submit" class="export-button" :disabled="saving">
            {{ saving ? 'Generazione in corso...' : 'Genera Modello' }}
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

const router = useRouter()
const token = useCookie('auth_token')
const saving = ref(false)
const error = ref('')

const form = ref({
  name: '',
  description: ''
})

const submitModel = async () => {
  saving.value = true
  error.value = ''
  
  try {
    await $fetch('http://localhost:8000/api/lottery/my-ml-models/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        ...form.value,
        is_active: true,
        is_public: false
      }
    })
    
    router.push('/lottery/my-ml')
  } catch (err) {
    console.error("Errore salvataggio:", err)
    if (err.response?._data?.name) {
      error.value = `Errore: ${err.response._data.name[0]}`
    } else {
      error.value = "Si è verificato un errore durante la creazione del modello."
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
