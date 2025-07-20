# Setup Instructions - Tricky Words Phonics

## 🎯 Prima di Iniziare

Questa applicazione richiede alcune configurazioni per funzionare correttamente. Segui questa guida passo dopo passo.

## 📋 Prerequisiti

### 1. Installa Node.js
- Vai su [nodejs.org](https://nodejs.org/)
- Scarica la versione LTS (Long Term Support)
- Esegui l'installer e segui le istruzioni
- Verifica l'installazione aprendo PowerShell e digitando:
  ```bash
  node --version
  npm --version
  ```

### 2. Browser Compatibile
- **Raccomandato**: Google Chrome o Microsoft Edge
- **Evita**: Firefox e Safari (supporto limitato per speech recognition)

## 🚀 Installazione dell'Applicazione

### 1. Apri PowerShell o Terminal
```bash
cd "c:\Development\AI_CoralTPU_Phonics\Tricky_word_phonics"
```

### 2. Installa le Dipendenze
```bash
npm install
```

### 3. Avvia l'Applicazione
```bash
npm run dev
```

### 4. Apri il Browser
Vai su `http://localhost:3000`

## 🎤 Configurazione del Microfono

### Chrome/Edge:
1. Vai su chrome://settings/content/microphone
2. Assicurati che il microfono sia abilitato
3. Aggiungi localhost alla lista dei siti autorizzati

### Windows:
1. Vai in Impostazioni > Privacy > Microfono
2. Assicurati che "Consenti alle app di accedere al microfono" sia attivo
3. Verifica che il browser sia nell'elenco delle app autorizzate

## 🔧 Risoluzione Problemi

### "npm non riconosciuto"
- Node.js non è installato correttamente
- Riavvia PowerShell/Terminal dopo l'installazione
- Controlla che Node.js sia nel PATH di sistema

### "Microfono non funziona"
- Verifica le impostazioni di privacy del browser
- Controlla le impostazioni di sistema per il microfono
- Prova a ricaricare la pagina e consentire l'accesso al microfono

### "Speech Recognition non supportato"
- Usa Chrome o Edge invece di Firefox/Safari
- Verifica che il browser sia aggiornato all'ultima versione

### Errori di Build
```bash
# Pulisci la cache e reinstalla
npm cache clean --force
rm -rf node_modules
npm install
```

## 📚 Comandi Utili

```bash
# Sviluppo
npm run dev          # Avvia server di sviluppo

# Build
npm run build        # Crea build di produzione
npm run preview      # Anteprima build di produzione

# Linting
npm run lint         # Controlla errori di codice
```

## 🌐 Configurazioni Aggiuntive

### Per Uso in Rete Locale
Se vuoi far utilizzare l'app ad altri dispositivi nella tua rete:

1. Modifica `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'  // Consente connessioni da qualsiasi IP
  }
})
```

2. Trova il tuo IP locale:
```bash
ipconfig  # Su Windows
ifconfig  # Su Mac/Linux
```

3. Altri dispositivi possono accedere tramite: `http://TUO_IP:3000`

### HTTPS per Microfono su Dispositivi Mobili
I dispositivi mobili richiedono HTTPS per l'accesso al microfono:

```bash
npm install --save-dev @vitejs/plugin-basic-ssl
```

Aggiungi a `vite.config.ts`:
```typescript
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true
  }
})
```

## 🎉 Tutto Pronto!

Una volta completati questi passaggi, l'applicazione dovrebbe funzionare correttamente. 

**Buon Divertimento con l'Apprendimento! 🌟**

---

### Supporto
Se hai ancora problemi, controlla:
1. La console del browser (F12) per errori
2. Che il microfono funzioni in altre applicazioni
3. Che la connessione internet sia stabile
