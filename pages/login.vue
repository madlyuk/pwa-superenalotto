<template>
  <div class="login-container">
    <div class="glass-panel login-card">
      <h1 class="main-title">MadVibeProject</h1>
      <p class="subtitle">Inserisci le tue credenziali per accedere</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label>Username</label>
          <input type="text" v-model="username" class="glass-input" required />
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input type="password" v-model="password" class="glass-input" required />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button type="submit" class="export-button login-btn" :disabled="loading">
          {{ loading ? 'Accesso in corso...' : 'Entra' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const tokenCookie = useCookie('auth_token')
const usernameCookie = useCookie('username')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await useFetch('http://localhost:8000/api/token/', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })
    
    if (fetchError.value) {
      error.value = 'Credenziali non valide. Riprova.'
    } else if (data.value && data.value.access) {
      // Salva il token in un cookie sicuro
      tokenCookie.value = data.value.access
      usernameCookie.value = username.value
      router.push('/')
    }
  } catch (e) {
    error.value = 'Errore di connessione al server.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.main-title {
  font-size: 2.2rem;
  line-height: 1.2;
}
.login-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}
.input-group label {
  font-size: 0.9rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: #f8fafc;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
}
.glass-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
.login-btn {
  justify-content: center;
  margin-top: 1rem;
}
.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
}
</style>
