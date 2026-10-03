---
name: Frontend Architecture Context
description: Contesto dell'applicazione PWA Nuxt 3 e requisiti UI.
trigger: always_on
---
# 🧩 PWA Superenalotto (Frontend)

Questa applicazione è la Progressive Web App basata su Nuxt 3 per l'interazione con le API del VibeProject.

## Requisiti Applicativi
* **Dashboard Pubblica:** Consultazione storico estrazioni SuperEnalotto, accesso tramite login JWT verso Django.
* **UI/UX:**
  * Strutturata in Tab semantiche responsive (Vincite, Distribuzioni, Previsioni).
  * Ottimizzata per mobile tramite Tailwind CSS e layout flessibili.
  * UI per Machine Learning: visualizzazione incolonnata delle previsioni (Oracolo) con card compatte ed espansione accordion.
* **Accessibilità:** Utilizzo massivo di test UI e audit di accessibilità per Quality Assurance visiva.
* **Integrazione API:** Il client Nuxt 3 interroga unicamente le API del backend Django (Single Source of Truth), senza chiamate dirette a provider di terze parti a pagamento.

## Design System
* Compatibilità estetica e di layout con framework moderni e uso di librerie come Tailwind UI, Tabler o Shadcn/ui.
