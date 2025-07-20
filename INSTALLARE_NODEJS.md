# 🚨 PRIMA DI INIZIARE - INSTALLAZIONE NECESSARIA

## ❌ Problema Rilevato
L'applicazione non può partire perché **Node.js** non è installato sul sistema.

## 📥 Soluzione: Installare Node.js

### Step 1: Download Node.js
1. Vai su **https://nodejs.org/**
2. Clicca su **"Download Node.js (LTS)"** - versione 20.x.x
3. Scarica il file `.msi` per Windows

### Step 2: Installazione
1. **Esegui** il file `.msi` scaricato
2. **Segui** la procedura guidata (lascia tutte le opzioni di default)
3. **Accetta** i termini di licenza
4. **Installa** (potrebbero servire alcuni minuti)

### Step 3: Verifica Installazione
1. **Chiudi** tutti i terminali/PowerShell aperti
2. **Apri** un nuovo PowerShell
3. **Testa** l'installazione:
   ```bash
   node --version
   npm --version
   ```
4. **Dovresti vedere** qualcosa come:
   ```
   v20.11.0
   10.2.4
   ```

### Step 4: Avvia l'App
1. **Naviga** nella cartella del progetto
2. **Esegui** lo script di setup:
   ```bash
   cd "c:\Development\AI_CoralTPU_Phonics\Tricky_word_phonics"
   .\start_app.bat
   ```

## 🎯 Script Rapido di Verifica

Puoi testare se Node.js è installato correttamente con questo comando:

```powershell
# Test completo
node --version; npm --version; python --version
```

## ⚡ Installazione Alternative

### Opzione A: Winget (Windows 11)
```powershell
winget install OpenJS.NodeJS
```

### Opzione B: Chocolatey
```powershell
choco install nodejs
```

### Opzione C: Download Manuale
- Link diretto: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi

## 🔄 Dopo l'Installazione

Una volta installato Node.js:

1. **Riavvia** PowerShell
2. **Torna** in questa cartella
3. **Esegui**: `.\start_app.bat`
4. **Goditi** l'app! 🎉

---

**Una volta installato Node.js, l'app di lettura per tuo figlio sarà pronta! 🌟**
