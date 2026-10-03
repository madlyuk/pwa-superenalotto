# Documentazione Architetturale Frontend - PWA Superenalotto

Questo documento raccoglie in ordine le principali scelte strutturali e tecnologiche adottate nello sviluppo del frontend.

## 1. Migrazione a Nuxt 3 (Vue.js)

**Contesto:**
L'intero strato frontend è basato su Vue.js tramite il framework **Nuxt 3**. 
Il frontend deve garantire alta manutenibilità e favorire uno sviluppo veloce senza boilerplate complessi (motivo per cui è stato preferito a Next.js/React per questo specifico progetto).

**Dettagli Tecnici:**
- **Integrazione API:** Il client Nuxt 3 interroga unicamente le API del backend Django, fungendo da strato di presentazione.
- **Autenticazione (JWT):** Nuxt 3 protegge globalmente la navigazione tramite un *Route Middleware* dedicato (`middleware/auth.global.ts`), memorizzando il token localmente e consentendo l'accesso alle pagine protette solo dopo una corretta convalida delle credenziali sulla pagina di Login (`login.vue`).
- **Disaccoppiamento totale:** L'autenticazione JWT è sicura, intrinsecamente stateless e predisposta per essere espansa a future architetture.

## 2. Integrazione Embedded Build vs Iframe

**Decisione:**
Il sistema è progettato per essere servito come **Build Embedded**. 
In produzione, un automatismo si occupa di clonare il progetto, eseguire `npm run generate` e montare la build statica prodotta (`.output/public`) su un volume condiviso, che Nginx servirà sul path `/superenalotto/`.
Questo approccio risolve le problematiche legate ai cookie e all'integrazione di domini differenti rispetto a una soluzione con Iframe.

## 3. Gestione UX Asincrona (Es: Machine Learning Polling)

**Contesto:**
Le elaborazioni ML possono essere pesanti. Per evitare timeout, il backend implementa un task asincrono che restituisce lo stato `PENDING` o `RUNNING`.

**Decisione:**
Il frontend esegue un polling (chiamate cicliche ogni 5 secondi) all'API `backtest-status`. Finché è "RUNNING", la pagina mostra un overlay (spinner) di caricamento; non appena passa a SUCCESS o FAILED, il frontend si aggiorna automaticamente mostrando i nuovi dati. Questo fornisce una User Experience (UX) da applicazione single-page reattiva e premium.
