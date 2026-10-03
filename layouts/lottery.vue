<template>
  <div class="dashboard-layout">
    <!-- Sidebar (Desktop only) -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <NuxtLink to="/">
          <img src="~/assets/logo-light.png" alt="Madlyuk Logo" class="brand-logo" />
          <span class="brand-text">APP HUB</span>
        </NuxtLink>
      </div>
      
      <div class="sidebar-nav">
        <div class="nav-section-title">Menu</div>
        <NuxtLink to="/lottery" class="sidebar-link" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Dashboard
        </NuxtLink>
        <NuxtLink to="/lottery/oracolo" class="sidebar-link" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> L'Oracolo
        </NuxtLink>
        <NuxtLink to="/lottery/mie-giocate" class="sidebar-link" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Mie Giocate
        </NuxtLink>
        <NuxtLink to="/lottery/my-ml" class="sidebar-link" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h2v2H9V9zm4 0h2v2h-2V9z"></path></svg> Le tue ML
        </NuxtLink>
        <NuxtLink to="/lottery/classifica" class="sidebar-link" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg> Classifica
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <!-- Brand Logo for Mobile (Hidden on Desktop) -->
          <NuxtLink to="/" class="mobile-brand">
            <img src="~/assets/logo-light.png" alt="Madlyuk Logo" class="brand-logo-mobile" />
            <span class="brand-text">APP HUB</span>
          </NuxtLink>
        </div>

        <div class="header-right">
          <div class="header-actions">
            <!-- Azione: Aggiungi Estrazione Extra -->
            <div class="action-item hidden sm:flex">
              <input 
                id="extra-date"
                type="date" 
                v-model="customTargetDate" 
                class="date-input" 
                title="Forza una data specifica per l'estrazione" 
              />
            </div>
            
            <button @click="triggerUpdate" :disabled="updating" class="btn-update">
              <span v-if="updating">⏳...</span>
              <span v-else>⚡ Aggiorna IA</span>
            </button>
          </div>
          
          <div class="user-profile relative">
            <div class="user-profile-trigger" @click="toggleUserMenu">
              <div class="user-avatar">
                <img src="https://i.pravatar.cc/150?img=68" alt="User" />
              </div>
              <div class="user-info hidden sm:flex sm:flex-col">
                <div class="user-name">{{ username || 'Utente Attivo' }}</div>
                <!-- <div class="user-role">Premium</div> -->
              </div>
            </div>
            
            <!-- Dropdown Menu -->
            <div v-if="userMenuOpen" class="user-dropdown">
              <button @click="logout" class="dropdown-item text-red-400 hover:text-red-300">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="nav-inner">
        <NuxtLink to="/lottery" class="nav-item" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="label">Home</span>
        </NuxtLink>
        <NuxtLink to="/lottery/oracolo" class="nav-item" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span class="label">Oracolo</span>
        </NuxtLink>
        <NuxtLink to="/lottery/mie-giocate" class="nav-item" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="label">Giocate</span>
        </NuxtLink>
        <NuxtLink to="/lottery/my-ml" class="nav-item" active-class="active">
          <svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h2v2H9V9zm4 0h2v2h-2V9z"></path></svg>
          <span class="label">Auto ML</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const updating = ref(false)
const customTargetDate = ref('')
const refreshTrigger = useState('refreshLotteryData', () => 0)
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const username = useCookie('username')

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const logout = () => {
  const token = useCookie('auth_token')
  token.value = null
  userMenuOpen.value = false
  navigateTo('/login') // or wherever the login page is
}

const triggerUpdate = async () => {
  updating.value = true
  const token = useCookie('auth_token')
  try {
    const payload = {
      target_date: customTargetDate.value || undefined
    }
    await $fetch(`http://localhost:8000/api/lottery/trigger-update/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: payload
    })
    
    // Trigger the refresh on the active page
    refreshTrigger.value++
    
  } catch (error) {
    console.error("Errore durante l'aggiornamento:", error)
    alert("Errore durante l'aggiornamento dei dati.")
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
/* Sidebar Styles */
.sidebar-brand {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-brand a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  height: 52px;
  width: auto;
  border-radius: 4px;
  object-fit: contain;
}

.brand-logo-mobile {
  height: 42px;
  width: auto;
  border-radius: 4px;
  object-fit: contain;
}

.brand-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-left: 0.5rem;
  letter-spacing: 0.5px;
}

.mobile-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section-title {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sidebar-link.active {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05));
  color: var(--text-primary);
  border-left: 3px solid var(--accent-primary);
}

.sidebar-link .icon {
  font-size: 1.25rem;
  opacity: 0.8;
}

/* Header Styles */
.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-right: 1px solid var(--surface-border);
  padding-right: 1.5rem;
}

.date-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  font-size: 0.875rem;
}
.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.btn-update {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-update:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.btn-update:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.user-profile {
  position: relative;
}

.user-profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: background 0.2s;
}

.user-profile-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent-primary);
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 150px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: slideDown 0.2s ease-out;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hidden { display: none !important; }

.bottom-nav {
  display: none;
}

.mobile-brand {
  display: none;
}

/* Mobile Adjustments */
@media (min-width: 768px) {
  .md\:flex { display: flex !important; }
}
@media (min-width: 640px) {
  .sm\:flex { display: flex !important; }
  .sm\:block { display: block !important; }
}

@media (max-width: 768px) {
  .bottom-nav {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--surface-border);
    z-index: 900;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .nav-inner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .nav-item.active {
    color: var(--accent-primary);
  }

  .nav-item .icon {
    font-size: 1.25rem;
    margin-bottom: 2px;
  }

  .nav-item .label {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .page-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
  }
  
  .user-dropdown {
    position: fixed;
    bottom: 4rem;
    left: 0;
    right: 0;
    top: auto;
    width: 100%;
    margin: 0;
    border-radius: 24px 24px 0 0;
    padding: 1.5rem;
    background: rgba(15, 23, 42, 0.98);
    border: 1px solid var(--surface-border);
    border-bottom: none;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .dropdown-item {
    text-align: center;
    padding: 1rem;
    font-size: 1.1rem;
    background: rgba(255,255,255,0.05);
  }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.icon-svg {
  width: 22px;
  height: 22px;
  margin-right: 12px;
  display: inline-block;
  vertical-align: text-bottom;
  color: var(--text-secondary);
}

.nav-link.router-link-active .icon-svg, .nav-link:hover .icon-svg {
  color: var(--primary-light);
}

.nav-item .icon-svg {
  margin-right: 0;
  margin-bottom: 4px;
  width: 24px;
  height: 24px;
}

</style>
