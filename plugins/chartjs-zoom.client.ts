// Plugin Nuxt eseguito SOLO lato client (suffisso .client.ts)
// Registra il plugin zoom su Chart.js PRIMA che qualsiasi grafico venga montato
import { Chart as ChartJS } from 'chart.js'
// @ts-ignore — vendor locale
import zoomPlugin from '~/vendor/chartjs-plugin-zoom/dist/chartjs-plugin-zoom-v3.esm.js'

export default defineNuxtPlugin(() => {
  ChartJS.register(zoomPlugin)
})
