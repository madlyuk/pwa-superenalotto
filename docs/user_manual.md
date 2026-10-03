# Manuale d'Uso - PWA Superenalotto 🎟️

Benvenuto nel manuale d'uso della PWA Superenalotto. Questa interfaccia web progressiva ti permette di navigare e analizzare l'intero storico delle estrazioni, generare previsioni tramite Intelligenza Artificiale e analizzare le distribuzioni dei numeri.

## 1. Accesso alla Piattaforma (Login)
Essendo l'applicazione protetta, al primo accesso verrai reindirizzato alla schermata di Login.
* Inserisci le tue credenziali (fornite dall'amministratore del sistema).
* Il sistema genererà un **Token di Sicurezza (JWT)** che verrà salvato nel tuo browser, mantenendo la sessione attiva per le visite successive.

## 2. Navigazione Principale
L'interfaccia è strutturata in comode "Tab" (schede) ottimizzate sia per Desktop che per Dispositivi Mobili (Smartphone/Tablet):

### 📊 Archivio e Storico
Questa sezione mostra la cronologia completa delle estrazioni.
* **Aggiornamento Dati:** I dati si auto-aggiornano dal backend. All'avvio e ciclicamente, il server recupera le nuove estrazioni tramite un sistema di scraping indipendente.
* L'interfaccia mostra data, concorso e la combinazione vincente (Sestina + Jolly + SuperStar).

### 📈 Analisi e Distribuzioni (Statistiche)
Dedicata all'analisi statistica dei numeri:
* Ritardatari storici.
* Frequenze di estrazione per ogni singolo numero.
* Le distribuzioni sono presentate con indicatori grafici per una rapida consultazione visiva.

### 🔮 Oracolo (Previsioni di Machine Learning)
La sezione "Oracolo" è il cuore innovativo della PWA. Qui puoi consultare i risultati generati dai modelli di Intelligenza Artificiale:
* **Elaborazione Asincrona:** L'addestramento dei modelli è un processo pesante. Avviando una previsione, vedrai un indicatore di "Caricamento in corso" (Spinner). Puoi continuare a navigare: l'interfaccia chiederà aggiornamenti al server ogni 5 secondi e i risultati appariranno non appena completati.
* **Interfaccia ad Accordion (Fisarmonica):** Per evitare confusione a schermo, le previsioni sono raggruppate in "Card" (schede compatte). Cliccando su una card, questa si espande rivelando:
    1. I parametri del modello utilizzato (es. configurazione spaziale, vicini più prossimi).
    2. La sestina raccomandata dal motore.
    3. Il feedback storico (tasso di successo, ovvero quante volte la logica ha azzeccato in passato).

## 3. Gestione Personale
* **Mie Giocate (My ML):** Questa funzionalità (se attiva) permette di tenere traccia delle tue personali giocate o delle previsioni specifiche che hai salvato, per avere un riscontro rapido sulle vincite effettive dopo le estrazioni reali.

## 4. Installazione (Modalità PWA)
La piattaforma è una vera e propria App (Progressive Web App):
* **Su Smartphone (iOS/Android):** Aprendo il sito su Safari o Chrome, potrai selezionare l'opzione "Aggiungi a Schermata Home". L'app verrà installata come un'applicazione nativa, a schermo intero e senza barra degli indirizzi.
* **Su Desktop:** Chrome e Edge mostreranno un'icona "Installa" nella barra degli indirizzi per avere l'app sul tuo PC.

---
*Nota Tecnica:* Ogni dato visualizzato è letto direttamente dal server centrale (Single Source of Truth). Nessun dato sensibile o storico viene generato dal tuo telefono o computer.
