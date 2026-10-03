<template>
  <div class="custom-page-container">
    <div class="custom-max-width">
      
      <!-- HEADER -->
      <div class="custom-header">
        <NuxtLink to="/lottery" class="custom-back-btn">
          <svg class="custom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <div>
          <h1 class="custom-title">Umano vs Macchina</h1>
          <p class="custom-subtitle">Le mie giocate storiche</p>
        </div>
      </div>

      <!-- FORM INSERIMENTO -->
      <div class="glass-panel custom-form-box">
        <h2 class="custom-section-title">
          <svg class="custom-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Aggiungi Nuova Sestina
        </h2>
        
        <form @submit.prevent="saveSestina" class="custom-form">
          <div class="custom-input-grid">
            <div class="custom-input-group">
              <label>Nome Autore</label>
              <input v-model="form.author" type="text" required placeholder="Es. Mario">
            </div>
            <div class="custom-input-group">
              <label>Nome Sestina</label>
              <input v-model="form.name" type="text" required placeholder="Es. I numeri della nonna">
            </div>
          </div>
          
          <div class="custom-numbers-section">
            <label>I 6 Numeri (1-90)</label>
            <div class="custom-balls-flex">
              <input 
                v-for="(n, idx) in 6" :key="idx"
                v-model.number="form.numbers[idx]" 
                type="number" min="1" max="90" required
                class="hide-arrows"
              >
            </div>
          </div>

          <button type="submit" class="custom-submit-btn">
            Salva Giocata
          </button>
        </form>
      </div>

      <!-- LISTA SESTINE -->
      <div class="custom-list-section">
        <h3 class="custom-list-title">Le tue Sestine Attive</h3>
        
        <div v-if="sestine.length === 0" class="custom-empty-state">
          Non hai ancora inserito nessuna sestina.
        </div>
        
        <div v-else class="custom-sestine-grid">
          <div v-for="sestina in sestine" :key="sestina.id" class="glass-panel custom-sestina-card">
            <div class="custom-card-header">
              <div>
                <span class="custom-author-badge">👤 {{ sestina.author }}</span>
                <h4 class="custom-sestina-name">{{ sestina.name }}</h4>
              </div>
              <button @click="deleteSestina(sestina.id)" class="custom-delete-btn">
                <svg class="custom-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            
            <div class="custom-card-balls">
              <div v-for="num in sestina.numbers" :key="num" class="custom-small-ball">
                {{ num }}
              </div>
            </div>

            <div class="custom-card-stats" v-if="sestina.stats">
              <div class="stat-item" :class="{'has-hits': sestina.stats['1'] > 0}"><span>1 Num:</span> {{ sestina.stats['1'] || 0 }}</div>
              <div class="stat-item" :class="{'has-hits': sestina.stats['2'] > 0}"><span>Ambi:</span> {{ sestina.stats['2'] || 0 }}</div>
              <div class="stat-item" :class="{'has-hits': sestina.stats['3'] > 0}"><span>Terni:</span> {{ sestina.stats['3'] || 0 }}</div>
              <div class="stat-item" :class="{'has-hits': sestina.stats['4'] > 0}"><span>Quaterne:</span> {{ sestina.stats['4'] || 0 }}</div>
              <div class="stat-item" :class="{'has-hits': sestina.stats['5'] > 0}"><span>Cinquine:</span> {{ sestina.stats['5'] || 0 }}</div>
              <div class="stat-item" :class="{'has-hits': sestina.stats['6'] > 0}"><span>Jackpot:</span> {{ sestina.stats['6'] || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'lottery'
})

const API_BASE = 'http://localhost:8000/api/lottery'
const sestine = ref([])

const form = ref({
  author: 'Umano',
  name: '',
  numbers: [null, null, null, null, null, null],
  is_active: true
})

onMounted(() => {
  const usernameCookie = useCookie('username')
  if (usernameCookie.value) {
    form.value.author = usernameCookie.value
  } else {
    // Fallback on token decoding if cookie is not set
    const token = useCookie('auth_token')
    if (token.value) {
      try {
        const payload = JSON.parse(atob(token.value.split('.')[1]))
        if (payload.username) {
          form.value.author = payload.username
        } else if (payload.user_id) {
          form.value.author = 'Utente ' + payload.user_id
        }
      } catch(e) {
        console.error("Error decoding token", e)
      }
    }
  }
  fetchSestine()
})

const fetchSestine = async () => {
  const token = useCookie('auth_token')
  try {
    const data = await $fetch(`${API_BASE}/user-sestine/`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    sestine.value = data
  } catch (e) {
    console.error(e)
  }
}

const saveSestina = async () => {
  const nums = form.value.numbers
  if (nums.some(n => n < 1 || n > 90 || !n)) {
    alert("Inserisci tutti e 6 i numeri tra 1 e 90.")
    return
  }
  const uniqueNums = new Set(nums)
  if (uniqueNums.size !== 6) {
    alert("I numeri devono essere tutti diversi!")
    return
  }

  const token = useCookie('auth_token')
  try {
    await $fetch(`${API_BASE}/user-sestine/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}` 
      },
      body: {
        author: form.value.author,
        name: form.value.name,
        numbers: nums,
        is_active: true
      }
    })
    
    form.value.name = ''
    form.value.numbers = [null, null, null, null, null, null]
    
    fetchSestine()
    alert("Sestina salvata con successo!")
  } catch (e) {
    console.error("Errore salvataggio:", e)
    alert("Errore durante il salvataggio. Riprova.")
  }
}

const deleteSestina = async (id) => {
  if(!confirm('Eliminare questa sestina?')) return
  const token = useCookie('auth_token')
  try {
    await $fetch(`${API_BASE}/user-sestine/${id}/`, { 
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    fetchSestine()
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
/* Reset and Container */
.custom-page-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #000000);
  color: #f3f4f6;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}
.custom-max-width {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.custom-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}
.custom-back-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}
.custom-back-btn:hover {
  background: rgba(255,255,255,0.2);
}
.custom-icon {
  width: 24px;
  height: 24px;
}
.custom-icon-sm {
  width: 20px;
  height: 20px;
}
.custom-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(to right, #34d399, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.custom-subtitle {
  color: #9ca3af;
  margin: 0;
  font-size: 1.1rem;
}

/* Glass Panel Base */
.glass-panel {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
}

/* Form */
.custom-form-box {
  margin-bottom: 3rem;
  border-top: 1px solid rgba(52, 211, 153, 0.3);
}
.custom-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #34d399;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  margin-top: 0;
}
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.custom-input-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .custom-input-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.custom-input-group label {
  display: block;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* Inputs */
input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 0.75rem;
  outline: none;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}
input[type="text"]:focus {
  border-color: #34d399;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.2), inset 0 2px 4px rgba(0,0,0,0.5);
}

/* Balls Input */
.custom-numbers-section label {
  display: block;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
}
.custom-balls-flex {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
input[type="number"] {
  background: rgba(0,0,0,0.6);
  border: 2px solid rgba(52, 211, 153, 0.5);
  color: #34d399;
  padding: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  outline: none;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), 0 0 15px rgba(52, 211, 153, 0.1);
  transition: all 0.3s ease;
  -moz-appearance: textfield;
}
input[type="number"]:focus {
  border-color: #10b981;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.4);
  transform: scale(1.05);
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Submit Button */
.custom-submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.8rem 2.5rem;
  border-radius: 99px;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  transition: all 0.3s ease;
  display: inline-block;
  margin-top: 1rem;
  align-self: flex-start;
}
.custom-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}

/* List Section */
.custom-list-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.custom-list-title {
  font-size: 1.3rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1rem;
  margin: 0;
}
.custom-empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
}
.custom-sestine-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .custom-sestine-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Card */
.custom-sestina-card {
  padding: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.custom-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.custom-author-badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 0.2rem 0.8rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.custom-sestina-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}
.custom-delete-btn {
  background: transparent;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-delete-btn:hover {
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
}

/* Card Balls */
.custom-card-balls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.custom-small-ball {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1fae5;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

/* Stats */
.custom-card-stats {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
.stat-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
}
.stat-item span {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}
.stat-item.has-hits {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-weight: bold;
}
.stat-item.has-hits span {
  color: #a7f3d0;
}
</style>
