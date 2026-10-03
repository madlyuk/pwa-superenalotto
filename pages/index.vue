<template>
  <div class="dashboard-container">
    <div class="header-section text-center flex flex-col items-center">
      <img src="~/assets/logo-light.png" alt="Madlyuk Logo" class="hub-logo mb-4" />
      <h1 class="main-title">App Hub</h1>
      <p class="subtitle">Seleziona l'applicazione a cui vuoi accedere</p>
    </div>

    <div class="apps-grid">
      <NuxtLink to="/lottery" class="app-card glass-panel">
        <div class="app-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1em; height: 1em; color: var(--accent-primary);"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg></div>
        <h2>SuperEnalotto</h2>
        <p>Previsioni e archivio storico delle estrazioni.</p>
      </NuxtLink>
    </div>
    
    <div class="logout-section">
      <button @click="logout" class="export-button">Esci</button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const tokenCookie = useCookie('auth_token')

const logout = () => {
  tokenCookie.value = null
  router.push('/login')
}
</script>

<style scoped>
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}
.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}
.app-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.5);
}
.app-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.app-card h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.logout-section {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.hub-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}
.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
